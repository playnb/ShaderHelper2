## index.json 说明

- techniques
  > 定义 pass 和作色器名
- properties
  > 定义着色器属性默认值
  ```
  "属性名": {
              "type": "类型",
              "displayName": "显示名字",
              "value": "默认值"
          }
  ```

---

## 从 www.shadertoy.com 复制 Shader

### **片元着色器修改**

- 文件起始位置添加定义

```
/////////////////////////////////////////////////////////
#if COCOS_SHADER
precision highp float;

//#define fragColor gl_FragColor
//#define fragCoord v_texCoord
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
#endif
#if USE_TEXTURE
#endif
/////////////////////////////////////////////////////////
```

- 文件结尾添加函数

```
/////////////////////////////////////////////////////////
#if COCOS_SHADER
void main(){
    mainImage(gl_FragColor, v_texCoord);
}
#endif
/////////////////////////////////////////////////////////
```

- 函数替换
  > texture()->texture2D()

---

## 顶点着色器修改

**使用代码替换**

```
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
```

---

## 运行脚本BuilderEffect.py
将index.json和*.glsl合并成effect文件

---


