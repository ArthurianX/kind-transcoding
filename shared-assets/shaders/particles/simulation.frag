#define GLSLIFY 1
// simulation
varying vec2 vUv;
uniform sampler2D textureA;
uniform sampler2D textureB;
uniform float timer;
uniform float transition;
uniform float frequency;
uniform float amplitude;
uniform float maxDistance;

uniform float scale;
uniform vec2 resolution;
uniform float mouseStrength;
uniform vec2 cursorPos;
uniform mat4 pm;
uniform mat4 vm;

float when_eq(float x, float y) {
  return 1.0 - abs(sign(x - y));
}

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float noise(vec2 v)
{
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
  0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
  -0.577350269189626,  // -1.0 + 2.0 * C.x
  0.024390243902439); // 1.0 / 41.0
  // First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  // Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  // Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  // Gradients: 41 points uniformly over a line, mapped onto a diamond.
  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  // Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 curl(float	x,	float	y,	float	z)
{

  float	eps	= 1., eps2 = 2. * eps;
  float	n1,	n2,	a,	b;

  x += timer * .05;
  y += timer * .05;
  z += timer * .05;

  vec3	curl = vec3(0.);

  n1	=	noise(vec2( x,	y	+	eps ));
  n2	=	noise(vec2( x,	y	-	eps ));
  a	=	(n1	-	n2)/eps2;

  n1	=	noise(vec2( x,	z	+	eps));
  n2	=	noise(vec2( x,	z	-	eps));
  b	=	(n1	-	n2)/eps2;

  curl.x	=	a	-	b;

  n1	=	noise(vec2( y,	z	+	eps));
  n2	=	noise(vec2( y,	z	-	eps));
  a	=	(n1	-	n2)/eps2;

  n1	=	noise(vec2( x	+	eps,	z));
  n2	=	noise(vec2( x	+	eps,	z));
  b	=	(n1	-	n2)/eps2;

  curl.y	=	a	-	b;

  n1	=	noise(vec2( x	+	eps,	y));
  n2	=	noise(vec2( x	-	eps,	y));
  a	=	(n1	-	n2)/eps2;

  n1	=	noise(vec2(  y	+	eps,	z));
  n2	=	noise(vec2(  y	-	eps,	z));
  b	=	(n1	-	n2)/eps2;

  curl.z	=	a	-	b;

  return	curl;
}

void main() {

  vec4 positionA  = texture2D( textureA, vUv );
  vec4 positionB  = texture2D( textureB, vUv );
  positionA.xyz *= 1.;
  positionB.xyz *= 1.;

  vec4 targetPosition = mix( positionA, positionB, transition );

  float noiseIntensity = 0.5 - abs(transition - 0.5) + targetPosition.w * 0.1 + transition;
  float noiseScale = 0.01 + targetPosition.w * 0.025;

  mat4 vivewProjectionMatrix = pm * vm;

  vec4 screenCoord = vivewProjectionMatrix * vec4( targetPosition.xyz, 1.0 );
  screenCoord.xyz /= screenCoord.w;
  screenCoord.w    = 1.0 / screenCoord.w;

  screenCoord.xyz *= vec3 (0.5);
  screenCoord.xyz += vec3 (0.5);

  float maxCurl = 20.0;
  float brushStrength = 20.0;
  float brushSize = 0.15 * resolution.x;

  float mouseVelIntensity = (1.0 - when_eq(targetPosition.w, 7.0)) * brushStrength * (1.0 - smoothstep(0., brushSize, distance(screenCoord.xy * resolution, vec2(cursorPos.x, resolution.y - cursorPos.y))));
  noiseIntensity += mouseStrength * mouseVelIntensity;
  noiseIntensity += 0.1 * 1.;

  targetPosition.xyz += maxDistance * noiseIntensity * curl(targetPosition.x * noiseScale, targetPosition.y * noiseScale, targetPosition.z * noiseScale);

  gl_FragColor = vec4(targetPosition.xyz, targetPosition.w);
}
