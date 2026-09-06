const RAD_TO_DEG = 180 / Math.PI;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function matrixToEulerDegrees(matrix) {
  const d = matrix?.data ?? matrix;
  if (!d || d.length < 16) return null;

  // MediaPipe 4x4 matrisleri column-major duzende gelir. Uniform olcegi
  // cikarmak, yalnizca rotasyon bolumunu Euler acilarina donusturur.
  const sx = Math.hypot(d[0], d[1], d[2]) || 1;
  const sy = Math.hypot(d[4], d[5], d[6]) || 1;
  const sz = Math.hypot(d[8], d[9], d[10]) || 1;
  const m11 = d[0] / sx;
  const m12 = d[4] / sy;
  const m13 = d[8] / sz;
  const m22 = d[5] / sy;
  const m23 = d[9] / sz;
  const m32 = d[6] / sy;
  const m33 = d[10] / sz;

  const yaw = Math.asin(clamp(m13, -1, 1));
  let pitch;
  let roll;
  if (Math.abs(m13) < 0.9999999) {
    pitch = Math.atan2(-m23, m33);
    roll = Math.atan2(-m12, m11);
  } else {
    pitch = Math.atan2(m32, m22);
    roll = 0;
  }

  return { yaw: yaw * RAD_TO_DEG, pitch: pitch * RAD_TO_DEG, roll: roll * RAD_TO_DEG };
}

function midpoint(points, indices) {
  const result = indices.reduce((sum, index) => ({
    x: sum.x + points[index].x,
    y: sum.y + points[index].y,
  }), { x: 0, y: 0 });
  return { x: result.x / indices.length, y: result.y / indices.length };
}

function eyeGaze(points, irisIndices, cornerA, cornerB, upper, lower) {
  const iris = midpoint(points, irisIndices);
  const left = points[cornerA];
  const right = points[cornerB];
  const top = midpoint(points, upper);
  const bottom = midpoint(points, lower);
  const minX = Math.min(left.x, right.x);
  const width = Math.max(0.0001, Math.abs(right.x - left.x));
  const minY = Math.min(top.y, bottom.y);
  const height = Math.max(0.0001, Math.abs(bottom.y - top.y));

  return {
    x: clamp(((iris.x - minX) / width - 0.5) * 2, -1.5, 1.5),
    y: clamp(((iris.y - minY) / height - 0.5) * 2, -1.5, 1.5),
  };
}

export function estimateGaze(landmarks) {
  if (!landmarks || landmarks.length < 478) return { x: 0, y: 0, available: false };

  const left = eyeGaze(landmarks, [468, 469, 470, 471, 472], 33, 133, [159, 160], [144, 145]);
  const right = eyeGaze(landmarks, [473, 474, 475, 476, 477], 362, 263, [385, 386], [374, 380]);
  return {
    x: (left.x + right.x) / 2,
    y: (left.y + right.y) / 2,
    available: true,
  };
}

export function applyDeadzone(value, deadzone) {
  const magnitude = Math.abs(value);
  if (magnitude <= deadzone) return 0;
  return Math.sign(value) * (magnitude - deadzone);
}

export function fusePose(head, gaze, center, settings) {
  const headYaw = (head.yaw - center.headYaw) * settings.headGain;
  const headPitch = (head.pitch - center.headPitch) * settings.headGain;
  const headRoll = (head.roll - center.headRoll) * settings.rollGain;
  const gazeYaw = (gaze.x - center.gazeX) * 35 * settings.eyeGain;
  const gazePitch = (gaze.y - center.gazeY) * 24 * settings.eyeGain;

  const yawSign = settings.invertYaw ? -1 : 1;
  const pitchSign = settings.invertPitch ? -1 : 1;
  const rollSign = settings.invertRoll ? -1 : 1;

  return {
    yaw: clamp(applyDeadzone((headYaw + gazeYaw) * yawSign, settings.deadzone), -110, 110),
    pitch: clamp(applyDeadzone((headPitch + gazePitch) * pitchSign, settings.deadzone), -65, 65),
    roll: clamp(applyDeadzone(headRoll * rollSign, settings.deadzone * 0.5), -35, 35),
  };
}
