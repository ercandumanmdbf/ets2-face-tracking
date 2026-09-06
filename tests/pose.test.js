import { describe, expect, it } from 'vitest';
import { applyDeadzone, fusePose, matrixToEulerDegrees } from '../src/tracking/pose.js';

function rotationY(degrees) {
  const r = degrees * Math.PI / 180;
  const c = Math.cos(r); const s = Math.sin(r);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
}

function rotationX(degrees) {
  const r = degrees * Math.PI / 180;
  const c = Math.cos(r); const s = Math.sin(r);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
}

function rotationZ(degrees) {
  const r = degrees * Math.PI / 180;
  const c = Math.cos(r); const s = Math.sin(r);
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

describe('pose math', () => {
  it('identity matrix returns zero rotation', () => {
    expect(matrixToEulerDegrees([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])).toEqual({ yaw: 0, pitch: -0, roll: -0 });
  });

  it('extracts yaw from a column-major matrix', () => {
    expect(matrixToEulerDegrees(rotationY(30)).yaw).toBeCloseTo(30, 4);
  });

  it('extracts pitch and roll from column-major matrices', () => {
    expect(matrixToEulerDegrees(rotationX(20)).pitch).toBeCloseTo(20, 4);
    expect(matrixToEulerDegrees(rotationZ(-15)).roll).toBeCloseTo(-15, 4);
  });

  it('removes the deadzone continuously', () => {
    expect(applyDeadzone(1, 1.2)).toBe(0);
    expect(applyDeadzone(-2, 1.2)).toBeCloseTo(-0.8);
  });

  it('fuses centered head and gaze into zero', () => {
    const result = fusePose(
      { yaw: 10, pitch: 5, roll: 1 },
      { x: 0.2, y: -0.1 },
      { headYaw: 10, headPitch: 5, headRoll: 1, gazeX: 0.2, gazeY: -0.1 },
      { headGain: 2, eyeGain: 0.2, rollGain: 1, deadzone: 1, invertYaw: false, invertPitch: false, invertRoll: false },
    );
    expect(result).toEqual({ yaw: 0, pitch: 0, roll: 0 });
  });
});
