# TruckLook

**Développé par ErcanDuman.**

[English](../README.md) · [Deutsch](README.de.md) · Français · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md) · [中文](README.zh.md) · [Türkçe](README.tr.md)

TruckLook transforme les mouvements de la tête et des yeux captés par une webcam standard en mouvements fluides de la caméra de cabine dans Euro Truck Simulator 2 et American Truck Simulator. Les données de suivi sont envoyées localement à OpenTrack par UDP, puis présentées au jeu sous forme TrackIR.

## Fonctionnalités

- Suivi de la pose de la tête et du regard assisté par l'iris
- Calibration visuelle de cinq secondes, puis masquage de l'aperçu caméra pour réduire la charge graphique
- Capture caméra demandée jusqu'à 120 FPS et sortie OpenTrack interpolée à 120 Hz
- Sensibilité de la tête, contribution des yeux, lissage et zone morte réglables
- Inversion indépendante des axes de lacet, tangage et roulis
- Interface en anglais, allemand, français, russe, espagnol, portugais, chinois et turc
- Traitement local ; les images de la caméra ne sont ni enregistrées ni envoyées

## Configuration requise

- Windows 10 ou Windows 11
- Une webcam
- Euro Truck Simulator 2 ou American Truck Simulator
- [OpenTrack](https://github.com/opentrack/opentrack/releases)

## Installation et réglage d'OpenTrack

1. Téléchargez et lancez `TruckLook-0.2.0-x64.exe` depuis la page GitHub Releases.
2. Installez et ouvrez OpenTrack.
3. Réglez **Input** sur **UDP over network** et le port sur `4242`.
4. Réglez **Filter** sur **None**.
5. Réglez **Output** sur **freetrack 2.0 Enhanced** et activez l'interface TrackIR.
6. Cliquez sur **Start** dans OpenTrack.
7. Ouvrez TruckLook, choisissez la webcam et cliquez sur **Démarrer le suivi**.
8. Regardez le centre de l'écran pendant les cinq secondes de calibration, puis lancez ETS2/ATS.

La variable de configuration du jeu `g_trackir` doit être égale à `1`. Conservez d'abord une courbe linéaire dans OpenTrack : TruckLook filtre déjà la pose et produit un flux à 120 Hz ; un second filtre peut ajouter de la latence.

## Utilisation de TruckLook

L'aperçu de la caméra apparaît uniquement pendant la calibration. Il est masqué après cinq secondes tandis que le suivi continue en arrière-plan. Cliquez sur **Recentrer** à tout moment pour afficher à nouveau la caméra pendant cinq secondes et définir une nouvelle position centrale.

| Réglage | Fonction |
| --- | --- |
| Sensibilité de la tête | Multiplie la rotation physique de la tête |
| Contribution des yeux | Ajoute la direction du regard calculée avec l'iris au mouvement de caméra |
| Lissage | Réduit les tremblements ; une valeur élevée est plus stable mais augmente la latence |
| Zone morte | Ignore les très petits mouvements autour du centre |
| Inversion des axes | Inverse séparément gauche/droite, haut/bas ou le roulis |

La valeur FPS affichée correspond à la fréquence réelle de traitement de la caméra. TruckLook demande jusqu'à 120 FPS, mais la fréquence finale dépend de la webcam, du pilote, de l'éclairage et des performances de l'ordinateur. La sortie OpenTrack reste interpolée à 120 Hz.


## Licence

MIT © 2026 ErcanDuman. Consultez [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) pour les mentions relatives à MediaPipe.
