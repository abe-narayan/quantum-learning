export type AmplitudePreset = {
  id: string;
  label: string;
  re: number;
  im: number;
};

export const AMPLITUDE_PRESETS: AmplitudePreset[] = [
  { id: "one", label: "1", re: 1, im: 0 },
  { id: "i", label: "i", re: 0, im: 1 },
  { id: "neg-one", label: "−1", re: -1, im: 0 },
  { id: "neg-i", label: "−i", re: 0, im: -1 },
  { id: "plus", label: "(1+i)/√2", re: Math.SQRT1_2, im: Math.SQRT1_2 },
  { id: "point6-point8i", label: "0.6 + 0.8i", re: 0.6, im: 0.8 },
];
