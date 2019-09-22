/*
Copy from https://www.shadertoy.com/view/4sXXRj
*/

/////////////////////////////////////////////////////////
#if COCOS_SHADER
precision highp float;

#define iChannel0 texture
#define iChannel1 u_sample1
#define iTime u_time
#define iMouse u_mouse
#define iResolution u_resolution

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_rippleSpeed;

uniform sampler2D texture;
uniform vec2 texSize;

uniform sampler2D u_sample1;
uniform vec2 u_sample1Size;

varying vec2 uv0;        //屏幕UV
varying vec2 v_texCoord; //纹理坐标
#endif
#if USE_TEXTURE
#endif
/////////////////////////////////////////////////////////

#define tile_factor 0.2
#define noise_factor 0.03

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 position = uv0; //纹理uv
  vec2 p = position;

  p.y = p.y;
  float t = iTime / u_rippleSpeed;

  vec2 waterCoord = vec2(p.x, 1.0 - p.y);
  vec2 texCoordNormal0 = waterCoord * tile_factor;
  texCoordNormal0 += t;

  vec2 texCoordNormal1 = waterCoord * tile_factor;
  texCoordNormal1.s -= t;
  texCoordNormal1.t += t;

  vec3 normal0 = texture2D(iChannel1, fract(texCoordNormal0)).rgb * 2.0 - 1.0;
  vec3 normal1 = texture2D(iChannel1, fract(texCoordNormal1)).rgb * 2.0 - 1.0;
  vec3 normal = normalize(normal0 + normal1);

  // the final texture cooridnate is disturbed using the normal texture with
  // some noise factor
  p += noise_factor * normal.xy;

  fragColor = texture2D(iChannel0, p);
}

/////////////////////////////////////////////////////////
#if COCOS_SHADER
void main() { mainImage(gl_FragColor, v_texCoord); }
#endif
/////////////////////////////////////////////////////////
