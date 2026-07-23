import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Gemini yanıtından geçerli JSON nesnesini çıkarır.
 * Fazladan kapanış brace'i gibi sorunları handle eder.
 */
function extractJSON(text: string): Record<string, unknown> {
  // Önce direkt parse dene
  try {
    return JSON.parse(text);
  } catch {
    // Brace sayarak ilk tam JSON nesnesinin sonunu bul
    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (ch === "\\") {
        escape = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0) {
          return JSON.parse(text.substring(0, i + 1));
        }
      }
    }

    // Hiçbiri çalışmadıysa orijinal hatayı fırlat
    return JSON.parse(text);
  }
}

export async function POST(req: NextRequest) {
  try {
    // --- dryRun modu: DB'ye kaydetmeden sadece Gemini analizini döndür ---
    const dryRun =
      req.nextUrl.searchParams.get("dryRun") === "true";

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const assignmentId = formData.get("assignmentId") as string;
    const userId = formData.get("userId") as string;
    const referenceText = formData.get("referenceText") as string | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Ses dosyası bulunamadı" },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Dosya boyutu çok büyük. Maksimum: ${MAX_FILE_SIZE / 1024 / 1024}MB, Gönderilen: ${(audioFile.size / 1024 / 1024).toFixed(1)}MB`,
        },
        { status: 400 }
      );
    }

    if (!assignmentId || !userId) {
      return NextResponse.json(
        { error: "assignmentId ve userId zorunludur" },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key bulunamadı" },
        { status: 500 }
      );
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");
    const mimeType = audioFile.type || "audio/webm";

    const prompt = referenceText
      ? `Bu bir İngilizce dil öğrencisinin konuşma kaydı.
Öğrencinin okuması gereken referans metin: "${referenceText}"
Lütfen sadece aşağıdaki JSON formatında yanıt ver:
{
  "transcript": "öğrencinin söylediklerinin transkripsiyonu",
  "overallScore": 75,
  "grammarErrors": [
    {"error": "hatalı ifade", "correction": "doğru ifade", "explanation": "açıklama"}
  ],
  "pronunciationFeedback": "telaffuz ve akıcılık değerlendirmesi",
  "fluencyScore": 80,
  "accuracyScore": 70,
  "feedback": "genel geri bildirim"
}`
      : `Bu bir İngilizce dil öğrencisinin serbest konuşma kaydı.
Lütfen sadece aşağıdaki JSON formatında yanıt ver:
{
  "transcript": "öğrencinin söylediklerinin transkripsiyonu",
  "overallScore": 75,
  "grammarErrors": [
    {"error": "hatalı ifade", "correction": "doğru ifade", "explanation": "açıklama"}
  ],
  "pronunciationFeedback": "telaffuz ve akıcılık değerlendirmesi",
  "fluencyScore": 80,
  "accuracyScore": 70,
  "feedback": "genel geri bildirim"
}`;

    // Model adını environment'tan al, yoksa varsayılan kullan
    const modelName =
      process.env.GEMINI_MODEL || "gemini-3.5-flash";

    console.log(
      `[Speech API] Model: ${modelName}, Dosya: ${audioFile.name}, Boyut: ${(audioFile.size / 1024).toFixed(1)}KB, MIME: ${mimeType}, dryRun: ${dryRun}`
    );

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    let response;
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: audioBase64,
                },
              },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });
    } catch (geminiError: unknown) {
      const errMsg =
        geminiError instanceof Error
          ? geminiError.message
          : String(geminiError);
      console.error("[Speech API] Gemini API hatası:", errMsg);

      // Billing/quota hatası kontrolü
      const isBillingError =
        errMsg.includes("429") ||
        errMsg.includes("quota") ||
        errMsg.includes("billing") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      return NextResponse.json(
        {
          error: isBillingError
            ? "Gemini API kota limiti aşıldı. Lütfen billing ayarlarını kontrol edin."
            : `Gemini API hatası: ${errMsg}`,
        },
        { status: isBillingError ? 429 : 502 }
      );
    }

    const rawText = response.text;

    if (!rawText) {
      console.error("[Speech API] Gemini boş yanıt döndü");
      return NextResponse.json(
        { error: "Gemini yanıt vermedi" },
        { status: 500 }
      );
    }

    let analysisResult;
    try {
      // Gemini bazen JSON'u markdown code fence ile sarıyor
      // veya fazladan kapanış brace'i ekliyor
      let cleanText = rawText.trim();

      // Markdown code fence temizle
      const codeFenceMatch = cleanText.match(
        /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/
      );
      if (codeFenceMatch) {
        cleanText = codeFenceMatch[1].trim();
      }

      // İlk geçerli JSON nesnesini çıkar (fazla } varsa kırp)
      analysisResult = extractJSON(cleanText);
    } catch {
      console.error(
        "[Speech API] JSON parse hatası. Raw yanıt:",
        rawText.substring(0, 1000)
      );
      return NextResponse.json(
        {
          error: "Analiz sonucu işlenemedi",
          rawResponse: rawText.substring(0, 500),
        },
        { status: 500 }
      );
    }

    console.log(
      `[Speech API] Analiz başarılı. Skor: ${analysisResult.overallScore}, Transcript: "${analysisResult.transcript?.substring(0, 50)}..."`
    );

    // --- dryRun modunda DB'ye kaydetme, sadece sonucu döndür ---
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        transcript: analysisResult.transcript,
        overallScore: analysisResult.overallScore,
        fluencyScore: analysisResult.fluencyScore,
        accuracyScore: analysisResult.accuracyScore,
        grammarErrors: analysisResult.grammarErrors,
        pronunciationFeedback: analysisResult.pronunciationFeedback,
        feedback: analysisResult.feedback,
      });
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        userId,
        content: analysisResult.transcript,
        score: analysisResult.overallScore,
        feedback: analysisResult.feedback,
        aiAnalysis: analysisResult,
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      transcript: analysisResult.transcript,
      overallScore: analysisResult.overallScore,
      fluencyScore: analysisResult.fluencyScore,
      accuracyScore: analysisResult.accuracyScore,
      grammarErrors: analysisResult.grammarErrors,
      pronunciationFeedback: analysisResult.pronunciationFeedback,
      feedback: analysisResult.feedback,
    });
  } catch (error) {
    console.error("[Speech API] Beklenmeyen hata:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
