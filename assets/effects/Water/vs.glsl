precision highp float;

uniform mat4 cc_matViewProj;
uniform vec2 texSize;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
varying vec2 v_texCoord;
void main() {
  vec4 pos = cc_matViewProj * vec4(a_position, 1);
  gl_Position = pos;
  uv0 = a_uv0;
  v_texCoord = a_uv0.xy * texSize;
}