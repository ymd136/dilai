# 🚀 DilAI - Yapay Zeka Destekli Kurumsal Dil Eğitimi ve Ödev Yönetim Platformu

## 👥 Takım Bilgileri

### **Takım İsmi**
Takım 107

### **Takım Elemanları**
* **Yiğit Mert Demir:** Product Owner
* **Batuhan Bilgili:** Scrum Master
* **Sudenaz Şenbay:** Team Member / Developer
* **Ceyda Kuş:** Team Member / Developer

---

## 📝 Ürün Bilgileri

### **Ürün İsmi**
**DilAI**

### **Ürün Açıklaması**
DilAI; eğitim kurumlarının, dil kurslarının ve üniversitelerin TOEFL, YDS, YÖKDİL gibi akademik sınav süreçlerini dijitalleştiren ve yapay zeka ile optimize eden bir platformdur. Kurumların öğrencilerine sesli ve yazılı ödevler atamasını sağlarken; gelişmiş dil modelleri (LLM) ve ses analitiği altyapısıyla öğrencilerin konuşma, telaffuz ve gramer hatalarını anlık olarak tespit edip raporlar. Böylece hem eğitmenlerin ödev kontrol yükünü hafifletir hem de öğrencilere stressiz, interaktif bir sınav hazırlık deneyimi sunar.

### **Ürün Özellikleri**
* **Yapay Zeka Destekli Konuşma (Speaking) Analizi:** Öğrencilerin ses kayıtlarını metne dönüştürerek telaffuz, akıcılık ve kelime doğruluğu analizi yapar.
* **Akademik Sınav Standartlarında Değerlendirme:** TOEFL, YDS ve YÖKDİL kriterlerine (Rubric) uygun otomatik puanlama ve yapay zeka geri bildirimi sağlar.
* **Gelişmiş Kurumsal Ödev Yönetimi (LMS):** Eğitmenlerin kolayca sınıflar oluşturmasına, sınav formatlarına uygun ödevler tanımlamasına och öğrenci gelişimini takip etmesine olanak tanır.
* **Anlık Hata Belirleme ve Gramer Tespiti:** Cümle içi zaman (Tense) uyumsuzluklarını, yanlış bağlaç kullanımlarını ve kelime hatalarını detaylı açıklamalarıyla birlikte listeler.

### **Hedef Kitle**
* Eğitim Kurumları, Dil Okulları ve Üniversiteler
* TOEFL, YDS ve YÖKDİL sınavlarına hazırlanan öğrenciler
* Akademik seviyede İngilizce yetkinliği kazanmak isteyen profesyoneller
* Öğrencilerine verimli ve pratik konuşma ödevleri atamak isteyen İngilizce Eğitmenleri

---

## 📅 Proje Yönetimi ve Planlama

* **Product Backlog URL:** [Jira](https://dilai.atlassian.net/jira/software/projects/KAN/list?jql=project%20%3D%20KAN%20ORDER%20BY%20cf%5B10019%5D%20ASC)
* **Güncel Süreç:** Sprint 1

Bu sprint kapsamında projenin temel altyapısı kurulmuş, yetkilendirme sistemleri geliştirilmiş ve kullanıcı arayüzlerinin ilk versiyonları tamamlanmıştır.

### 📈 Proje Yönetimi ve Süreç
**Backlog Düzeni ve Görev Dağılımı:** 
Sprint planlamasında görevler Jira üzerinden yönetilmiş ve iş kalemleri (User Story'ler) alt task'lere bölünerek ekip üyelerine atanmıştır. Görev önceliklendirmeleri (Highest, High, Medium) yapılarak sprint hedefine uygun bir iş akışı sağlanmıştır.

**Daily Scrum & İletişim:** 
Ekip içi iletişim ve günlük (Daily Scrum) toplantıları zaman verimliliğini artırmak adına Google Meet üzerinden gerçekleştirilmektedir. Alınan kararlar ve güncellemeler eşzamanlı olarak Jira board'una yansıtılmaktadır.

**Sprint Board:**
<!-- Lütfen Jira Sprint Board görselini buraya sürükleyip bırakın -->
<img width="1384" height="331" alt="Ekran Resmi 2026-07-02 21 04 02" src="https://github.com/user-attachments/assets/3a39454b-dc49-4116-b9fc-e544d60bf8a5" />

### ✨ Tamamlanan Geliştirmeler
Bu sprint içerisinde tamamlanan başlıca geliştirmeler şunlardır:

1. **Landing Page & Login Sistemi:** Platformun tanıtım sayfası (Landing Page) ve güvenli giriş/kayıt (Login) ekranları tasarlandı ve entegre edildi.
   <!-- Lütfen Landing Page ve Login Ekranı görsellerini buraya sürükleyip bırakın -->
    <img width="1905" height="934" alt="Ekran Resmi 2026-07-02 20 41 49" src="https://github.com/user-attachments/assets/7ea02af4-abf0-432e-be08-10e3c7ee2e2b" /> 
    <img width="1905" height="934" alt="Ekran Resmi 2026-07-02 20 41 57" src="https://github.com/user-attachments/assets/d0732120-3c9b-49af-b6aa-7ba553abd213" />

  <!-- Lütfen Admin ve Kurum Paneli görsellerini buraya sürükleyip bırakın -->
  <img width="1905" height="937" alt="Ekran Resmi 2026-07-02 20 48 23" src="https://github.com/user-attachments/assets/ef1e1098-4ad5-4c71-ac1a-c9e849549f23" /> 
  <img width="1905" height="937" alt="Ekran Resmi 2026-07-02 20 47 52" src="https://github.com/user-attachments/assets/36d33f50-1ab8-41a0-acac-93d1d202e00f" />


3. **Dashboard Altyapısı ve Ar-Ge:** Kullanıcıların giriş sonrasında görecekleri panellerin tasarımları tamamlandı ve ses-metin dönüştürme (Speech-to-Text) sürecinin Ar-Ge çalışmaları başlatıldı.

---

### 🔍 Sprint Review
* **Participants:** <kbd>**Batuhan Bilgili**</kbd>, <kbd>**Yiğit Mert Demir**</kbd>, <kbd>**Sudenaz Şenbay**</kbd>
* **Değerlendirme:** Sprint 1 için planlanan temel modüller (Landing Page, Login ve Dashboard taslakları) başarıyla tamamlanmış ve canlı prototip üzerinde review edilmiştir. Product Owner, geliştirilen arayüzlerin kurumsal kimliğe ve kullanıcı deneyimine (UX) uygunluğunu onaylamıştır. Yapay zeka ses analiz motoru için yapılan ön Ar-Ge çalışmaları ekiple paylaşılmış ve sonraki sprint'te entegrasyona hazır olduğu doğrulanmıştır.

### Sprint Retrospective
* **Neler İyi Gitti?**
  * Ekip içi iletişim ve görev dağılımı oldukça verimliydi.
  * Jira board aktif ve güncel tutularak iş takibi şeffaf bir şekilde sağlandı.
  * Tasarımların hızlıca koda dökülmesi sürecine erken başlandı.
* **Neler Geliştirilebilir?**
  * Görevlerin alt task'lere bölünmesi aşamasında zaman tahminlemeleri biraz daha esnek tutulabilir.
  * Teknik bağımlılıklar (özellikle ses analitiği kütüphaneleri) sonraki sprint planlamasından önce netleştirilmelidir.
* **Aksiyon Planı:** Sprint 2 planlamasında yapay zeka entegrasyonu için teknik araştırma süreleri (Spike) önceden tanımlanacak ve iş yükü dağılımı buna göre optimize edilecektir.
