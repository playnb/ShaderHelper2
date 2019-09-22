/*
Copy from https://www.shadertoy.com/view/MdlXz8
*/

/////////////////////////////////////////////////////////
precision highp float;

#define iChannel0 texture
#define iTime u_time
#define iMouse u_mouse
#define iResolution u_resolution

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D texture;
uniform vec2 texSize;
varying vec2 uv0;
varying vec2 v_texCoord;
/////////////////////////////////////////////////////////

// Found this on GLSL sandbox. I really liked it, changed a few things and made
// it tileable.
// :)
// by David Hoskins.

// Water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07

// Redefine below to see the tiling...
//#define SHOW_TILING

#define TAU 6.28318530718
#define MAX_ITER 5

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float time = iTime * .5 + 23.0;
  // uv should be the 0-1 uv of texture...
  vec2 uv = fragCoord.xy / iResolution.xy;

  vec2 p = mod(uv * TAU, TAU) - 250.0;
  vec2 i = vec2(p);
  float c = 1.0;
  float inten = .005;

  for (int n = 0; n < MAX_ITER; n++) {
    float t = time * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten),
                           p.y / (cos(i.y + t) / inten)));
  }
  c /= float(MAX_ITER);
  c = 1.17 - pow(c, 1.4);
  vec3 colour = vec3(pow(abs(c), 8.0));
  colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);

  fragColor =
      vec4((colour + texture2D(texture, v_texCoord/texSize).rgb) / 2.0, 1.0);
}

/////////////////////////////////////////////////////////
void main() { mainImage(gl_FragColor, v_texCoord); }
/////////////////////////////////////////////////////////