export const noiseGLSL = /* glsl */ `
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    total += amplitude * valueNoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    amplitude *= 0.5;
  }
  return total;
}

vec2 curlNoise(vec2 p) {
  float e = 0.08;
  float up = fbm(p + vec2(0.0, e));
  float down = fbm(p - vec2(0.0, e));
  float right = fbm(p + vec2(e, 0.0));
  float left = fbm(p - vec2(e, 0.0));
  return vec2(up - down, left - right) / (2.0 * e);
}

float ripple(vec2 p, vec2 center, float radius, float width) {
  float d = length(p - center);
  return 1.0 - smoothstep(0.0, width, abs(d - radius));
}
`;
