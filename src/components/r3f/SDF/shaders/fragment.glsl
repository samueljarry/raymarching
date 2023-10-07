#define MAX_DIST 100.0
#define MAX_STEPS 100
#define SURFACE_DIST 0.01

uniform float uTime;
uniform vec2 uResolution;

float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float scene(vec3 p) {
  float plane = p.z + 10.0;
  float plane2 = p.y + 1.0;
  float sphere = sdSphere(vec3(p.x, p.y + cos(uTime * 1.5) * 0.25 , p.z), 0.5);
  float sphere2 = sdSphere(p, 0.5);
  float sphere3 = sdSphere(vec3(p.x, p.y + cos(uTime * 1.5) * 0.25, p.z), 0.25);
  
  float distance1 = smoothstep(max(sphere, cos(sphere2)), min(cos(sphere), sphere2), 0.0);
  float distance2 = min(distance1, plane);
  float distance3 = min(distance2, plane2);
  float distance4 = min(distance3, sphere3);

  return distance4;
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

float softShadows(vec3 ro, vec3 rd, float mint, float maxt, float k ) {
  float resultingShadowColor = 1.0;
  float t = mint;
  for(int i = 0; i < 50 && t < maxt; i++) {
      float h = scene(ro + rd*t);
      if( h < 0.001 )
          return 0.0;
      resultingShadowColor = min(resultingShadowColor, k*h/t );
      t += h;
  }
  return resultingShadowColor ;
}

void main() {
  vec3 color = vec3(0.0);
  // Light position
  vec3 lightPosition = vec3(-10.0 * cos(uTime) * 0.5, 10.0 + sin(uTime) * 2., 10.0);

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
    float shadows = softShadows(p, lightDirection, 0.1, 5.0, 64.0);

    color = vec3(1.0) * diffuse * shadows;
    color = mix(vec3(0.92, 0.38, 0.26), vec3(0.94, 0.61, 0.47), diffuse * shadows);
  }

  gl_FragColor = vec4(color, 1.0);
}