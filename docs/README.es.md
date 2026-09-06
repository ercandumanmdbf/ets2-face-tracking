# TruckLook

**Desarrollado por ErcanDuman.**

[English](../README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Русский](README.ru.md) · Español · [Português](README.pt.md) · [中文](README.zh.md) · [Türkçe](README.tr.md)

TruckLook convierte los movimientos de cabeza y ojos captados por una webcam normal en movimientos fluidos de la cámara de cabina de Euro Truck Simulator 2 y American Truck Simulator. Los datos de seguimiento se envían localmente a OpenTrack por UDP y se presentan al juego como TrackIR.

## Funciones

- Seguimiento de la posición de la cabeza y de la mirada asistido por el iris
- Calibración visual de cinco segundos; después se oculta la vista previa para reducir la carga gráfica
- Captura de cámara solicitada hasta 120 FPS y salida OpenTrack interpolada a 120 Hz
- Sensibilidad de cabeza, aporte ocular, suavizado y zona muerta ajustables
- Inversión independiente de los ejes de guiñada, cabeceo y balanceo
- Interfaz en inglés, alemán, francés, ruso, español, portugués, chino y turco
- Procesamiento local; las imágenes de la cámara no se graban ni se suben a internet

## Requisitos

- Windows 10 o Windows 11
- Una webcam
- Euro Truck Simulator 2 o American Truck Simulator
- [OpenTrack](https://github.com/opentrack/opentrack/releases)

## Instalación y configuración de OpenTrack

1. Descarga y ejecuta `TruckLook-0.2.0-x64.exe` desde la página GitHub Releases.
2. Instala y abre OpenTrack.
3. Configura **Input** como **UDP over network** y el puerto como `4242`.
4. Configura **Filter** como **None**.
5. Configura **Output** como **freetrack 2.0 Enhanced** y activa la interfaz TrackIR.
6. Pulsa **Start** en OpenTrack.
7. Abre TruckLook, selecciona la webcam y pulsa **Iniciar seguimiento**.
8. Mira al centro de la pantalla durante los cinco segundos de calibración y después inicia ETS2/ATS.

La variable de configuración del juego `g_trackir` debe valer `1`. Mantén inicialmente las curvas de OpenTrack lineales: TruckLook ya filtra la posición y produce un flujo de 120 Hz, por lo que un segundo filtro puede añadir latencia.

## Uso de TruckLook

La vista previa de la cámara solo aparece durante la calibración. Después de cinco segundos se oculta mientras el seguimiento continúa en segundo plano. Pulsa **Centrar** cuando quieras para volver a mostrar la cámara durante cinco segundos y establecer una nueva posición central.

| Control | Función |
| --- | --- |
| Sensibilidad de cabeza | Multiplica el giro físico de la cabeza |
| Contribución ocular | Añade la dirección de la mirada calculada con el iris al movimiento de cámara |
| Suavizado | Reduce las vibraciones; un valor alto es más estable, pero añade latencia |
| Zona muerta | Ignora movimientos muy pequeños cerca del centro |
| Invertir ejes | Invierte de forma independiente izquierda/derecha, arriba/abajo o el balanceo |

El valor FPS mostrado corresponde a la frecuencia real de procesamiento de la cámara. TruckLook solicita hasta 120 FPS, pero la frecuencia final depende de la webcam, el controlador, la iluminación y el rendimiento del equipo. La salida OpenTrack se mantiene interpolada a 120 Hz.

## Desarrollo

Se necesita Node.js 20 o una versión posterior.

```powershell
npm install
npm run dev
npm test
npm run package
```

El ejecutable portátil de Windows se crea en `release/`. Los archivos WASM de MediaPipe se copian desde la dependencia npm durante la compilación. El modelo Face Landmarker se descarga en tiempo de ejecución desde la dirección oficial de Google y no se redistribuye en este repositorio.

## Publicación en GitHub

Ejecuta `npm run prepare:github` después de empaquetar. Confirma únicamente el contenido de `github-upload/` en el repositorio de código. Adjunta el contenido de `github-release/` a una GitHub Release en lugar de confirmar el ejecutable. Consulta la [guía de carga en turco](../GITHUB_UPLOAD_GUIDE_TR.md) para ver los comandos exactos.

## Licencia

MIT © 2026 ErcanDuman. Consulta [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) para los avisos de MediaPipe.
