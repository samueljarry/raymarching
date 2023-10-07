#define MAX_DIST 100.0
#define MAX_STEPS 100
#define SURFACE_DIST 0.01

uniform float uTime;
uniform vec2 uResolution;

float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float scene(vec3 p) {
  float distance = sdSphere(p, 1.0);
  return distance;
}

float raymarch(vec3 ro, vec3 rd) {
  float dO = 0.0;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = scene(p);

    dO += dS;

    if(dO > MAX_DIST || dS < SURFACE_DIST) {
      break;
    }
  }

  return dO;
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.01, 0.0);

  vec3 n = scene(p) - vec3(
    scene(p-e.xyy),
    scene(p-e.yxy),
    scene(p-e.yyx)
  );

  return normalize(n);
}

void main() {
  vec3 color = vec3(0.0);

  // Light position
  vec3 lightPosition = vec3(-10.0 * cos(uTime), 10.0, 10.0 * sin(uTime));

  // Normalize coords
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv -= 0.5;
  uv.x *= uResolution.x / uResolution.y;

  // Ray Origin | Camera
  vec3 ro = vec3(0.0, 0.0, 5.0);
  // Ray Direction
  vec3 rd = normalize(vec3(uv, -1.0));
  // Raymarch
  float d = raymarch(ro, rd);
  vec3 p = ro + rd * d;

  if(d < MAX_DIST) {
    vec3 normal = getNormal(p);
    vec3 lightDirection = normalize(lightPosition - p);

    float diffuse = max(dot(normal, lightDirection), 0.0);
    color = vec3(1.0) * diffuse;
  }

  gl_FragColor = vec4(color, 1.0);
}