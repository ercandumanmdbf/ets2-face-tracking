# TruckLook

**Developed by ErcanDuman.**

English · [Deutsch](docs/README.de.md) · [Français](docs/README.fr.md) · [Русский](docs/README.ru.md) · [Español](docs/README.es.md) · [Português](docs/README.pt.md) · [中文](docs/README.zh.md) · [Türkçe](docs/README.tr.md)

TruckLook turns head and eye movement from a standard webcam into smooth cabin-camera movement in Euro Truck Simulator 2 and American Truck Simulator. Tracking data is sent locally to OpenTrack over UDP and exposed to the game as TrackIR.


## Features

- Head-pose and iris-assisted gaze tracking
- Five-second visual calibration; the camera preview is hidden afterwards to reduce rendering load
- Camera capture requested at up to 120 FPS and interpolated OpenTrack output at 120 Hz
- Adjustable head sensitivity, eye contribution, smoothing and dead zone
- Independent inversion controls for yaw, pitch and roll
- English, German, French, Russian, Spanish, Portuguese, Chinese and Turkish interface
- Local processing; camera frames are neither recorded nor uploaded

## Requirements

- Windows 10 or Windows 11
- A webcam
- Euro Truck Simulator 2 or American Truck Simulator
- [OpenTrack](https://github.com/opentrack/opentrack/releases)

## Installation and OpenTrack setup

1. Download and run `TruckLook-0.2.0-x64.exe` from the GitHub Releases page.
2. Install and open OpenTrack.
3. Set **Input** to **UDP over network** and its port to `4242`.
4. Set **Filter** to **None**.
5. Set **Output** to **freetrack 2.0 Enhanced** and enable the TrackIR interface.
6. Click **Start** in OpenTrack.
7. Open TruckLook, select the webcam and click **Start tracking**.
8. Look at the center of the screen during the five-second calibration, then start ETS2/ATS.

The game configuration variable `g_trackir` must be `1`. Keep OpenTrack mapping linear at first: TruckLook already filters the pose and produces a 120 Hz stream, so a second filter can add latency.

## Using TruckLook

The camera preview appears only during calibration. After five seconds it is hidden while tracking continues in the background. Click **Recenter** at any time to show the camera for another five seconds and create a new center position.

| Control | Purpose |
| --- | --- |
| Head sensitivity | Multiplies physical head rotation |
| Eye contribution | Adds iris-based gaze direction to the camera movement |
| Smoothing | Reduces jitter; higher values feel steadier but add latency |
| Dead zone | Ignores very small movements near the center |
| Reverse axes | Reverses left/right, up/down or roll independently |

The displayed FPS value is the actual camera-processing rate. Although TruckLook requests up to 120 FPS, the final rate depends on the webcam, driver, lighting and computer performance. OpenTrack output stays interpolated at 120 Hz.


## License

MIT © 2026 ErcanDuman. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for MediaPipe notices.
