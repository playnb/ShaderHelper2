precision highp float;
// 重复次数，值越大模糊质量越高，但性能越低
#define repeats 5.
// 贴图采样器，来自于v2f管线
uniform sampler2D texture;
// 模糊度，外界属性
uniform float strong;
// 亮度，外界属性
uniform float light;
// 当前点uv
varying vec2 uv0;

// 应用贴图UV
vec4 draw(vec2 uv) { return texture2D(texture, uv).rgba; }

float grid(float var, float size) { return floor(var * size) / size; }
// 降低亮度
vec4 dim(vec4 col, float factor) {
  return vec4(col.r * factor, col.g * factor, col.b * factor, col.a);
}

// 随机值
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
  // 模糊贴图
  vec4 blurred_image = vec4(0.);
  // 重复采样
  for (float i = 0.; i < repeats; i++) {
    // 第一采样点
    vec2 q = vec2(cos(degrees((i / repeats) * 360.)),
                  sin(degrees((i / repeats) * 360.))) *
             (rand(vec2(i, uv0.x + uv0.y)) + strong);
    vec2 uv2 = uv0 + (q * strong);
    blurred_image += draw(uv2) / 2.;

    // 第二采样点
    q = vec2(cos(degrees((i / repeats) * 360.)),
             sin(degrees((i / repeats) * 360.))) *
        (rand(vec2(i + 2., uv0.x + uv0.y + 24.)) + strong);
    uv2 = uv0 + (q * strong);
    blurred_image += draw(uv2) / 2.;
  }
  // 中和
  blurred_image /= repeats;
  // 降低亮度
  blurred_image = dim(blurred_image, light);
  // 导出颜色
  gl_FragColor = vec4(blurred_image);
}