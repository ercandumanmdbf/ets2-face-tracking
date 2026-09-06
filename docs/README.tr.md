# TruckLook

**ErcanDuman tarafından geliştirildi.**

[English](../README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md) · [中文](README.zh.md) · Türkçe

TruckLook, standart bir webcam üzerinden kafa ve göz hareketlerini algılayarak Euro Truck Simulator 2 ve American Truck Simulator kabin kamerasını akıcı biçimde hareket ettirir. Takip verileri yerel UDP üzerinden OpenTrack'e gönderilir ve oyuna TrackIR olarak aktarılır.

## Özellikler

- Kafa duruşu ve iris destekli bakış takibi
- Beş saniyelik görsel kalibrasyon; sonrasında görüntü işleme yükünü azaltmak için gizlenen kamera önizlemesi
- 120 FPS'e kadar kamera yakalama isteği ve 120 Hz ara değerli OpenTrack çıkışı
- Ayarlanabilir kafa hassasiyeti, göz katkısı, yumuşatma ve ölü bölge
- Sağ/sol, yukarı/aşağı ve yatırma eksenleri için bağımsız ters çevirme
- İngilizce, Almanca, Fransızca, Rusça, İspanyolca, Portekizce, Çince ve Türkçe arayüz
- Yerel görüntü işleme; kamera kareleri kaydedilmez veya internete yüklenmez

## Gereksinimler

- Windows 10 veya Windows 11
- Bir webcam
- Euro Truck Simulator 2 veya American Truck Simulator
- [OpenTrack](https://github.com/opentrack/opentrack/releases)

## Kurulum ve OpenTrack ayarı

1. GitHub Releases sayfasından `TruckLook-0.2.0-x64.exe` dosyasını indirip çalıştırın.
2. OpenTrack'i kurup açın.
3. **Input** bölümünü **UDP over network**, port değerini `4242` yapın.
4. **Filter** bölümünü **None** yapın.
5. **Output** bölümünü **freetrack 2.0 Enhanced** seçip TrackIR arayüzünü etkinleştirin.
6. OpenTrack'te **Start** düğmesine basın.
7. TruckLook'u açın, kamerayı seçin ve **Takibi başlat** düğmesine basın.
8. Beş saniyelik kalibrasyon sırasında ekranın ortasına bakın, ardından ETS2/ATS'yi başlatın.

Oyun yapılandırmasındaki `g_trackir` değişkeni `1` olmalıdır. İlk kullanımda OpenTrack eşleme eğrilerini doğrusal tutun. TruckLook zaten duruşu filtreleyip 120 Hz akış üretir; ikinci bir filtre gecikmeye neden olabilir.

## TruckLook kullanımı

Kamera önizlemesi yalnızca kalibrasyon sırasında görünür. Beş saniye sonra gizlenir, ancak takip arka planda devam eder. Yeni bir merkez konumu oluşturmak ve kamerayı yeniden beş saniye göstermek için istediğiniz zaman **Merkezle** düğmesine basabilirsiniz.

| Kontrol | Görevi |
| --- | --- |
| Kafa hassasiyeti | Fiziksel kafa dönüşünü çarpar |
| Göz katkısı | İris tabanlı bakış yönünü kamera hareketine ekler |
| Yumuşatma | Titremeyi azaltır; yüksek değer daha dengeli fakat daha gecikmeli olur |
| Ölü bölge | Merkez çevresindeki çok küçük hareketleri yok sayar |
| Eksenleri ters çevir | Sağ/sol, yukarı/aşağı veya yatırma yönünü ayrı ayrı değiştirir |

Arayüzdeki FPS değeri gerçek kamera işleme hızını gösterir. TruckLook 120 FPS'e kadar akış istese de son hız webcam, sürücü, ışık ve bilgisayar performansına bağlıdır. OpenTrack çıkışı 120 Hz olarak ara değerlenmeye devam eder.

## Lisans

MIT © 2026 ErcanDuman. MediaPipe bildirimleri için [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) dosyasına bakın.
