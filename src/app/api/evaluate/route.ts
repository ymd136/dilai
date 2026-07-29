import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Değerlendirilecek metin bulunamadı.' }, { status: 400 });
    }

    const prompt = `
      Sen profesyonel bir TOEFL, YDS ve YÖKDİL dil eğitmenisin.
      Sana aşağıda sunulan öğrenci metnini dilbilgisi, kelime dağarcığı, akıcılık ve içerik açısından değerlendir.
      
      Yanıtını ASLA düz metin veya markdown etiketleri içinde verme, sadece ve sadece şu geçerli JSON formatında döndür:
      {
        "overall_score": (0 ile 100 arasında bir sayı),
        "grammar_score": (0 ile 100 arasında bir sayı),
        "vocabulary_score": (0 ile 100 arasında bir sayı),
        "feedback": "Genel değerlendirme ve tavsiye metni (Türkçe)",
        "corrections": [
          {
            "original": "Öğrencinin hatalı cümlesi veya ifadesi",
            "corrected": "Doğru hali",
            "reason": "Hatanın neden yanlış olduğuna dair kısa açıklama"
          }
        ]
      }

      Öğrenci Metni: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json', // Saf JSON dönmesini garantiler
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error("Yapay zekadan boş yanıt döndü.");
    }

    const cleanedJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const evaluationResult = JSON.parse(cleanedJsonText);

    return NextResponse.json({ success: true, data: evaluationResult });

  } catch (error: any) {
    console.error('Değerlendirme Hatası:', error);
    return NextResponse.json({ success: false, error: error.message || 'Bir hata oluştu.' }, { status: 500 });
  }
}