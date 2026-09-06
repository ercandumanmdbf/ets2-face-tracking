# TruckLook

**Desenvolvido por ErcanDuman.**

[English](../README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Русский](README.ru.md) · [Español](README.es.md) · Português · [中文](README.zh.md) · [Türkçe](README.tr.md)

O TruckLook transforma movimentos da cabeça e dos olhos captados por uma webcam comum em movimentos fluidos da câmara da cabine no Euro Truck Simulator 2 e American Truck Simulator. Os dados de rastreamento são enviados localmente ao OpenTrack por UDP e apresentados ao jogo como TrackIR.

## Funcionalidades

- Rastreamento da posição da cabeça e do olhar assistido pela íris
- Calibração visual de cinco segundos; depois a pré-visualização é ocultada para reduzir a carga gráfica
- Captura da câmara solicitada até 120 FPS e saída OpenTrack interpolada a 120 Hz
- Sensibilidade da cabeça, contribuição dos olhos, suavização e zona morta ajustáveis
- Inversão independente dos eixos de guinada, inclinação e rotação
- Interface em inglês, alemão, francês, russo, espanhol, português, chinês e turco
- Processamento local; as imagens da câmara não são gravadas nem enviadas para a internet

## Requisitos

- Windows 10 ou Windows 11
- Uma webcam
- Euro Truck Simulator 2 ou American Truck Simulator
- [OpenTrack](https://github.com/opentrack/opentrack/releases)

## Instalação e configuração do OpenTrack

1. Transfira e execute `TruckLook-0.2.0-x64.exe` a partir da página GitHub Releases.
2. Instale e abra o OpenTrack.
3. Defina **Input** como **UDP over network** e a porta como `4242`.
4. Defina **Filter** como **None**.
5. Defina **Output** como **freetrack 2.0 Enhanced** e ative a interface TrackIR.
6. Clique em **Start** no OpenTrack.
7. Abra o TruckLook, selecione a webcam e clique em **Iniciar rastreamento**.
8. Olhe para o centro do ecrã durante os cinco segundos de calibração e depois inicie o ETS2/ATS.

A variável de configuração do jogo `g_trackir` deve estar definida como `1`. Mantenha inicialmente as curvas do OpenTrack lineares: o TruckLook já filtra a posição e produz um fluxo de 120 Hz; um segundo filtro pode adicionar latência.

## Utilizar o TruckLook

A pré-visualização da câmara só aparece durante a calibração. Após cinco segundos, é ocultada enquanto o rastreamento continua em segundo plano. Clique em **Recentralizar** a qualquer momento para voltar a mostrar a câmara durante cinco segundos e definir uma nova posição central.

| Controlo | Função |
| --- | --- |
| Sensibilidade da cabeça | Multiplica a rotação física da cabeça |
| Contribuição dos olhos | Adiciona a direção do olhar calculada pela íris ao movimento da câmara |
| Suavização | Reduz as vibrações; um valor alto é mais estável, mas aumenta a latência |
| Zona morta | Ignora movimentos muito pequenos perto do centro |
| Inverter eixos | Inverte separadamente esquerda/direita, cima/baixo ou rotação |

O valor FPS apresentado corresponde à frequência real de processamento da câmara. O TruckLook solicita até 120 FPS, mas a frequência final depende da webcam, do controlador, da iluminação e do desempenho do computador. A saída OpenTrack continua interpolada a 120 Hz.

## Desenvolvimento

É necessário o Node.js 20 ou mais recente.

```powershell
npm install
npm run dev
npm test
npm run package
```

O executável portátil para Windows é criado em `release/`. Os ficheiros WASM do MediaPipe são copiados da dependência npm durante a compilação. O modelo Face Landmarker é transferido durante a execução a partir do endereço oficial da Google e não é redistribuído neste repositório.

## Publicação no GitHub

Execute `npm run prepare:github` após criar o pacote. Envie apenas o conteúdo de `github-upload/` para o repositório de código. Anexe o conteúdo de `github-release/` a uma GitHub Release, em vez de incluir o executável no Git. Consulte o [guia de envio em turco](../GITHUB_UPLOAD_GUIDE_TR.md) para obter os comandos exatos.

## Licença

MIT © 2026 ErcanDuman. Consulte [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) para os avisos do MediaPipe.
