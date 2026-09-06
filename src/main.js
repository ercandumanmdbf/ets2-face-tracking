import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { PoseSmoother } from './tracking/filter.js';
import { estimateGaze, fusePose, matrixToEulerDegrees } from './tracking/pose.js';
import { languages, resolveLanguage, translate } from './i18n.js';
import './styles.css';

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const CALIBRATION_MS = 5000;
const els = Object.fromEntries([...document.querySelectorAll('[id]')].map((el) => [el.id, el]));
const smoother = new PoseSmoother();
let faceLandmarker = null;
let stream = null;
let running = false;
let animationId = null;
let videoFrameId = null;
let lastVideoTime = -1;
let lastFrameAt = performance.now();
let frameCounter = 0;
let fps = 0;
let calibration = null;
let calibrationSamples = [];
let calibrationStartedAt = null;
let calibrationTimer = null;
let systemStatus = { openTrack: false, ets2: false };
let currentLanguage = resolveLanguage(localStorage.getItem('trucklook.language') || navigator.language);

const settings = {
  headGain: 2.2,
  eyeGain: 0.2,
  smoothing: 0.58,
  deadzone: 1.2,
  rollGain: 0.8,
  invertYaw: false,
  invertPitch: true,
  invertRoll: false,
};

function t(key, values) {
  return translate(currentLanguage, key, values);
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  els.openTrackHint.innerHTML = t('openTrackHint').split('|').join('<br>');
  els.languageSelect.value = currentLanguage;
  els.startButton.textContent = t(running ? 'stop' : 'start');
  if (!running) {
    setStatus(t('ready'));
  } else if (calibration) {
    setStatus(t(systemStatus.openTrack ? 'sending' : 'openTrackMissing'), systemStatus.openTrack ? 'active' : 'error');
  } else if (calibrationTimer !== null) {
    const remaining = Math.max(0, (CALIBRATION_MS - (performance.now() - calibrationStartedAt)) / 1000).toFixed(1);
    setStatus(t('calibrating', { value: remaining }));
  } else {
    setStatus(t('faceMissing'));
  }
  refreshSystemStatus().catch(() => {});
}

function initializeLanguages() {
  for (const [code, label] of languages) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = label;
    els.languageSelect.append(option);
  }
  els.languageSelect.addEventListener('change', () => {
    currentLanguage = els.languageSelect.value;
    localStorage.setItem('trucklook.language', currentLanguage);
    applyLanguage();
    listCameras().catch(() => {});
  });
}

function setStatus(message, kind = '') {
  els.statusText.textContent = message;
  els.statusDot.className = `dot ${kind}`;
}

async function refreshSystemStatus() {
  if (!window.truckLook?.getSystemStatus) return;
  systemStatus = await window.truckLook.getSystemStatus();
  els.openTrackState.textContent = t(systemStatus.openTrack ? 'running' : 'notRunning');
  els.openTrackState.className = systemStatus.openTrack ? 'active' : 'error';
  els.openTrackDot.className = `state-dot ${systemStatus.openTrack ? 'active' : 'error'}`;
  els.ets2State.textContent = t(systemStatus.ets2 ? 'running' : 'closed');
  els.ets2State.className = systemStatus.ets2 ? 'active' : '';
  els.ets2Dot.className = `state-dot ${systemStatus.ets2 ? 'active' : ''}`;
  if (running && calibration && !systemStatus.openTrack) setStatus(t('openTrackMissing'), 'error');
}

function readSettings() {
  for (const key of ['headGain', 'eyeGain', 'smoothing', 'deadzone']) settings[key] = Number(els[key].value);
  for (const key of ['invertYaw', 'invertPitch', 'invertRoll']) settings[key] = els[key].checked;
  els.headGainOut.value = `${settings.headGain.toFixed(1)}×`;
  els.eyeGainOut.value = `${Math.round(settings.eyeGain * 100)}%`;
  els.smoothingOut.value = `${Math.round(settings.smoothing * 100)}%`;
  els.deadzoneOut.value = `${settings.deadzone.toFixed(1)}°`;
  localStorage.setItem('trucklook.settings.v2', JSON.stringify(settings));
}

function restoreSettings() {
  try { Object.assign(settings, JSON.parse(localStorage.getItem('trucklook.settings.v2'))); } catch { /* defaults */ }
  for (const key of ['headGain', 'eyeGain', 'smoothing', 'deadzone']) els[key].value = settings[key];
  for (const key of ['invertYaw', 'invertPitch', 'invertRoll']) els[key].checked = settings[key];
  readSettings();
}

async function listCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const selected = els.cameraSelect.value;
  els.cameraSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = t('defaultCamera');
  els.cameraSelect.append(defaultOption);
  devices.filter((device) => device.kind === 'videoinput').forEach((device, index) => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.textContent = device.label || t('cameraNumber', { value: index + 1 });
    els.cameraSelect.append(option);
  });
  if ([...els.cameraSelect.options].some((option) => option.value === selected)) els.cameraSelect.value = selected;
}

async function initializeTracker() {
  if (faceLandmarker) return;
  setStatus(t('modelLoading'));
  const wasmRoot = new URL('./wasm', window.location.href).href;
  const vision = await FilesetResolver.forVisionTasks(wasmRoot);
  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
    runningMode: 'VIDEO',
    numFaces: 1,
    minFaceDetectionConfidence: 0.55,
    minFacePresenceConfidence: 0.55,
    minTrackingConfidence: 0.55,
    outputFacialTransformationMatrixes: true,
  });
}

function beginCalibration() {
  clearTimeout(calibrationTimer);
  calibration = null;
  calibrationSamples = [];
  calibrationStartedAt = performance.now();
  smoother.reset();
  els.performanceState.classList.add('hidden');
  els.previewWrap.classList.remove('hidden');
  els.calibrationMessage.classList.remove('hidden');
  els.calibrationMessage.textContent = t('calibrating', { value: '5.0' });
  setStatus(t('calibrating', { value: '5.0' }));
  calibrationTimer = setTimeout(finishCalibration, CALIBRATION_MS);
}

function finishCalibration() {
  clearTimeout(calibrationTimer);
  calibrationTimer = null;
  if (calibrationSamples.length) {
    const sum = calibrationSamples.reduce((acc, sample) => {
      for (const key of ['yaw', 'pitch', 'roll', 'gazeX', 'gazeY']) acc[key] += sample[key];
      return acc;
    }, { yaw: 0, pitch: 0, roll: 0, gazeX: 0, gazeY: 0 });
    const count = calibrationSamples.length;
    calibration = { headYaw: sum.yaw / count, headPitch: sum.pitch / count, headRoll: sum.roll / count, gazeX: sum.gazeX / count, gazeY: sum.gazeY / count };
  }
  els.calibrationMessage.classList.add('hidden');
  drawOverlay(null);
  els.previewWrap.classList.add('hidden');
  els.performanceState.classList.remove('hidden');
  setStatus(t(calibration ? (systemStatus.openTrack ? 'sending' : 'openTrackMissing') : 'faceMissing'), calibration && !systemStatus.openTrack ? 'error' : calibration ? 'active' : '');
}

function collectCalibration(head, gaze, now) {
  calibrationSamples.push({ ...head, gazeX: gaze.x, gazeY: gaze.y });
  const remaining = Math.max(0, (CALIBRATION_MS - (now - calibrationStartedAt)) / 1000);
  if (remaining > 0) {
    const countdown = remaining.toFixed(1);
    els.calibrationMessage.textContent = t('calibrating', { value: countdown });
    setStatus(t('calibrating', { value: countdown }));
    return false;
  }
  finishCalibration();
  return true;
}

function sendPose(pose) {
  window.truckLook?.sendPose([0, 0, 0, pose.yaw, pose.pitch, pose.roll]);
}

function updateMeters(pose) {
  const limits = { yaw: 110, pitch: 65, roll: 35 };
  for (const axis of ['yaw', 'pitch', 'roll']) {
    els[`${axis}Value`].textContent = `${pose[axis].toFixed(1)}°`;
    els[`${axis}Bar`].style.width = `${50 + Math.max(-50, Math.min(50, pose[axis] / limits[axis] * 50))}%`;
  }
}

function drawOverlay(landmarks) {
  const canvas = els.overlay;
  if (canvas.width !== els.video.videoWidth) canvas.width = els.video.videoWidth;
  if (canvas.height !== els.video.videoHeight) canvas.height = els.video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!landmarks) return;
  ctx.fillStyle = '#60e5ba';
  for (const index of [1, 33, 133, 263, 362, 468, 473]) {
    const point = landmarks[index];
    ctx.beginPath(); ctx.arc(point.x * canvas.width, point.y * canvas.height, index >= 468 ? 4 : 2.5, 0, Math.PI * 2); ctx.fill();
  }
}

function scheduleNextFrame() {
  if (!running) return;
  if (typeof els.video.requestVideoFrameCallback === 'function') {
    videoFrameId = els.video.requestVideoFrameCallback((now) => detectFrame(now));
  } else {
    animationId = requestAnimationFrame(detectFrame);
  }
}

function detectFrame(now) {
  if (!running) return;
  scheduleNextFrame();
  if (els.video.readyState < 2 || els.video.currentTime === lastVideoTime) return;
  lastVideoTime = els.video.currentTime;

  try {
    const result = faceLandmarker.detectForVideo(els.video, now);
    const landmarks = result.faceLandmarks?.[0];
    const matrix = result.facialTransformationMatrixes?.[0];
    const head = matrixToEulerDegrees(matrix);
    if (!els.previewWrap.classList.contains('hidden')) drawOverlay(landmarks);

    if (!head || !landmarks) {
      if (calibrationTimer !== null) {
        const remaining = Math.max(0, (CALIBRATION_MS - (now - calibrationStartedAt)) / 1000).toFixed(1);
        els.calibrationMessage.textContent = t('calibrating', { value: remaining });
        setStatus(t('calibrating', { value: remaining }));
      } else {
        setStatus(t('faceMissing'));
      }
      const zero = smoother.update({ yaw: 0, pitch: 0, roll: 0 }, 0.86);
      sendPose(zero); updateMeters(zero); return;
    }

    const gaze = estimateGaze(landmarks);
    if (!calibration && !collectCalibration(head, gaze, now)) return;
    const fused = fusePose(head, gaze, calibration, settings);
    const pose = smoother.update(fused, settings.smoothing);
    sendPose(pose);
    updateMeters(pose);

    frameCounter += 1;
    if (now - lastFrameAt >= 1000) {
      fps = Math.round(frameCounter * 1000 / (now - lastFrameAt));
      els.fps.textContent = t('fps', { value: fps });
      frameCounter = 0; lastFrameAt = now;
    }
  } catch (error) {
    console.error(error);
    setStatus(t('trackingError'), 'error');
  }
}

async function start() {
  els.startButton.disabled = true;
  try {
    await initializeTracker();
    const video = els.cameraSelect.value ? { deviceId: { exact: els.cameraSelect.value } } : true;
    stream = await navigator.mediaDevices.getUserMedia({ video: { ...(video === true ? {} : video), width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 120, min: 24, max: 120 } }, audio: false });
    els.video.srcObject = stream;
    await els.video.play();
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) videoTrack.contentHint = 'motion';
    await listCameras();
    running = true;
    els.emptyState.classList.add('hidden');
    els.startButton.textContent = t('stop');
    els.startButton.classList.add('stop');
    els.startButton.disabled = false;
    els.centerButton.disabled = false;
    els.cameraSelect.disabled = true;
    beginCalibration();
    scheduleNextFrame();
  } catch (error) {
    console.error(error);
    setStatus(t(error.name === 'NotAllowedError' ? 'permissionDenied' : 'startFailed'), 'error');
    els.startButton.disabled = false;
  }
}

function stop() {
  running = false;
  clearTimeout(calibrationTimer);
  calibrationTimer = null;
  cancelAnimationFrame(animationId);
  if (videoFrameId !== null && typeof els.video.cancelVideoFrameCallback === 'function') els.video.cancelVideoFrameCallback(videoFrameId);
  animationId = null;
  videoFrameId = null;
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  els.video.srcObject = null;
  drawOverlay(null);
  sendPose({ yaw: 0, pitch: 0, roll: 0 });
  updateMeters({ yaw: 0, pitch: 0, roll: 0 });
  els.fps.textContent = '0 FPS';
  els.emptyState.classList.remove('hidden');
  els.previewWrap.classList.remove('hidden');
  els.performanceState.classList.add('hidden');
  els.calibrationMessage.classList.add('hidden');
  els.startButton.textContent = t('start');
  els.startButton.classList.remove('stop');
  els.centerButton.disabled = true;
  els.cameraSelect.disabled = false;
  setStatus(t('ready'));
}

for (const key of ['headGain', 'eyeGain', 'smoothing', 'deadzone', 'invertYaw', 'invertPitch', 'invertRoll']) els[key].addEventListener('input', readSettings);
els.startButton.addEventListener('click', () => running ? stop() : start());
els.centerButton.addEventListener('click', beginCalibration);
window.addEventListener('beforeunload', stop);

initializeLanguages();
applyLanguage();
restoreSettings();
listCameras().catch(() => {});
window.truckLook?.getVersion().then((version) => { els.version.textContent = version; });
refreshSystemStatus().catch(() => {});
setInterval(() => refreshSystemStatus().catch(() => {}), 2000);
