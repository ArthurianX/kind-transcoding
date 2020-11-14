#define GLSLIFY 1
uniform vec2 nearFar;
uniform vec3 color1;
uniform vec3 color2;
uniform float hardness;
uniform float opacity;

#ifdef USE_LOGDEPTHBUF
uniform float logDepthBufFC;
#ifdef USE_LOGDEPTHBUF_EXT
varying float vFragDepth;
#endif
#endif

void main() {

  #ifdef USE_LOGDEPTHBUF_EXT
  float depth = gl_FragDepthEXT / gl_FragCoord.w;
  #else
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  #endif

  float vColor = 1.0 - smoothstep(nearFar.x, nearFar.y, depth);
  float d = length(gl_PointCoord.xy - .5) * 0.05;
  float c = 1.0 - smoothstep(hardness, 1.0, d);
  c = 1.0 - d;
  gl_FragColor = vec4(mix(color1, color2, vColor) * c, 1.0) * opacity;
}
