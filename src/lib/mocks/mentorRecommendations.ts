import type { MentorRecommendation } from "@/types/mentor";

export const MOCK_MENTOR_RECOMMENDATIONS: MentorRecommendation[] = [
  {
    id: "speaking-sim",
    type: "speaking_simulation",
    title: "AI Konuşma Simülasyonu Başlat",
    description:
      "TOEFL Speaking Task 1 formatında 45 saniyelik anlık pratik yap. AI, telaffuz ve akıcılığını anında analiz edecek.",
    examType: "TOEFL",
    priority: "high",
  },
  {
    id: "weakness-boost",
    type: "weakness_boost",
    title: "Zayıf Noktanı Güçlendir",
    description:
      "Son 3 denemende Present Perfect tense hatalarında %68 sapma tespit edildi. Sana özel 5 soruluk mikro-ödev hazırlandı.",
    examType: "TOEFL",
    priority: "medium",
    meta: {
      weakness: "Present Perfect Tense",
    },
  },
  {
    id: "word-of-day",
    type: "word_of_day",
    title: "Günün Kurumsal Kelimesi",
    description: "İş hayatında sık kullanılan akademik kelimelerle kelime dağarcığını genişlet.",
    examType: "TOEFL",
    priority: "low",
    meta: {
      word: "Leverage",
      meaning: "Bir avantajı veya kaynağı en verimli şekilde kullanmak",
      exampleSentence:
        "Our team leveraged data analytics to improve student engagement by 34%.",
    },
  },
  {
    id: "speaking-sim-yds",
    type: "speaking_simulation",
    title: "AI Konuşma Simülasyonu Başlat",
    description:
      "YDS çeviri bölümüne hazırlık için cümle kurma pratiği yap. AI geri bildirimini anında al.",
    examType: "YDS",
    priority: "high",
  },
  {
    id: "weakness-boost-yds",
    type: "weakness_boost",
    title: "Zayıf Noktanı Güçlendir",
    description:
      "Kelime bilgisi testlerinde akademik fiiller kategorisinde düşük performans. 10 kelimelik tekrar seti hazır.",
    examType: "YDS",
    priority: "medium",
    meta: {
      weakness: "Akademik Fiiller",
    },
  },
  {
    id: "word-of-day-yds",
    type: "word_of_day",
    title: "Günün Kurumsal Kelimesi",
    description: "YDS metinlerinde sık geçen kurumsal kelimelerle pratik yap.",
    examType: "YDS",
    priority: "low",
    meta: {
      word: "Comprehensive",
      meaning: "Kapsamlı, her yönüyle ele alan",
      exampleSentence:
        "The institution published a comprehensive report on language proficiency trends.",
    },
  },
  {
    id: "speaking-sim-yokdil",
    type: "speaking_simulation",
    title: "AI Konuşma Simülasyonu Başlat",
    description:
      "YÖKDİL Fen Bilimleri alanında teknik terimlerle konuşma pratiği yap.",
    examType: "YOKDIL",
    priority: "high",
  },
  {
    id: "weakness-boost-yokdil",
    type: "weakness_boost",
    title: "Zayıf Noktanı Güçlendir",
    description:
      "Okuma hızın alan ortalamasının %22 altında. Süre yönetimi odaklı 3 pasajlık mini set hazır.",
    examType: "YOKDIL",
    priority: "medium",
    meta: {
      weakness: "Okuma Hızı",
    },
  },
  {
    id: "word-of-day-yokdil",
    type: "word_of_day",
    title: "Günün Kurumsal Kelimesi",
    description: "Fen bilimleri metinlerinde geçen teknik kelimelerle çalış.",
    examType: "YOKDIL",
    priority: "low",
    meta: {
      word: "Hypothesis",
      meaning: "Araştırma öncesi ileri sürülen varsayım",
      exampleSentence:
        "The researchers formulated a hypothesis before conducting the experiment.",
    },
  },
];
