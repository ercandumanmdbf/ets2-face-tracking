# TruckLook

**Entwickelt von ErcanDuman.**

[English](../README.md) · Deutsch · [Français](README.fr.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md) · [中文](README.zh.md) · [Türkçe](README.tr.md)

TruckLook überträgt Kopf- und Augenbewegungen einer normalen Webcam als flüssige Kabinenkamerabewegung an Euro Truck Simulator 2 und American Truck Simulator. Die Trackingdaten werden lokal per UDP an OpenTrack gesendet und dem Spiel als TrackIR bereitgestellt.

## Funktionen

- Kopfposen- und irisgestütztes Blicktracking
- Fünf Sekunden sichtbare Kalibrierung; danach wird die Kameravorschau ausgeblendet, um die Renderlast zu senken
- Kameraaufnahme mit bis zu 120 FPS und interpolierte OpenTrack-Ausgabe mit 120 Hz
- Einstellbare Kopfempfindlichkeit, Augenanteil, Glättung und Totzone
- Getrennte Richtungsumkehr für Gier-, Nick- und Rollachse
- Oberfläche auf Englisch, Deutsch, Französisch, Russisch, Spanisch, Portugiesisch, Chinesisch und Türkisch
- Lokale Verarbeitung; Kamerabilder werden weder aufgezeichnet noch hochgeladen

## Voraussetzungen

- Windows 10 oder Windows 11
- Eine Webcam
- Euro Truck Simulator 2 oder American Truck Simulator
- [OpenTrack](https://github.com/opentrack/opentrack/releases)

## Installation und OpenTrack-Einrichtung

1. `TruckLook-0.2.0-x64.exe` von der GitHub-Releases-Seite herunterladen und starten.
2. OpenTrack installieren und öffnen.
3. **Input** auf **UDP over network** und den Port auf `4242` setzen.
4. **Filter** auf **None** setzen.
5. **Output** auf **freetrack 2.0 Enhanced** setzen und die TrackIR-Schnittstelle aktivieren.
6. In OpenTrack auf **Start** klicken.
7. TruckLook öffnen, die Webcam auswählen und auf **Tracking starten** klicken.
8. Während der fünfsekündigen Kalibrierung in die Bildschirmmitte schauen und danach ETS2/ATS starten.

Die Spielvariable `g_trackir` muss auf `1` stehen. Die OpenTrack-Kurven sollten anfangs linear bleiben: TruckLook filtert die Pose bereits und erzeugt einen 120-Hz-Datenstrom; ein zweiter Filter kann zusätzliche Verzögerung verursachen.

## TruckLook verwenden

Die Kameravorschau ist nur während der Kalibrierung sichtbar. Nach fünf Sekunden wird sie ausgeblendet, während das Tracking im Hintergrund weiterläuft. Mit **Zentrieren** kann die Kamera jederzeit erneut fünf Sekunden lang angezeigt und eine neue Mittelposition festgelegt werden.

| Einstellung | Funktion |
| --- | --- |
| Kopf-Empfindlichkeit | Verstärkt die tatsächliche Kopfdrehung |
| Augenanteil | Ergänzt die Kamerabewegung um die irisbasierte Blickrichtung |
| Glättung | Verringert Zittern; höhere Werte sind ruhiger, erhöhen aber die Verzögerung |
| Totzone | Ignoriert sehr kleine Bewegungen nahe der Mittelposition |
| Achsen umkehren | Kehrt Links/Rechts, Oben/Unten oder Neigung getrennt um |

Die FPS-Anzeige entspricht der tatsächlichen Kamera-Verarbeitungsrate. TruckLook fordert bis zu 120 FPS an; die erreichbare Rate hängt jedoch von Webcam, Treiber, Beleuchtung und Rechnerleistung ab. Die OpenTrack-Ausgabe wird weiterhin auf 120 Hz interpoliert.


## Lizenz

MIT © 2026 ErcanDuman. Hinweise zu MediaPipe stehen in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).
