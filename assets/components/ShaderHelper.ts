// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, executeInEditMode, requireComponent } = cc._decorator;
const ShaderEnum = cc.Enum({});

import { ShaderPropertyTexture, ShaderPropertyVec2, ShaderProperty, ShaderPropertyFloat } from './ShaderProperty'
import ShaderTimer from "./ShaderTimer"

@ccclass
@executeInEditMode
@requireComponent(cc.Sprite)
export default class ShaderHelper extends cc.Component {
    //不在编辑器状态显示的属性
    private static _not_show_prop = ["u_time", "texture", "texSize", "u_resolution", "u_mouse"]

    //枚举Shader程序
    @property
    _program = 0;
    @property({ type: ShaderEnum })
    get program() {
        return this._program;
    }
    set program(value) {
        if (this._program === value) {
            return;
        }
        if (CC_EDITOR) {
            this._floatProps = []
            this._vec2Props = []
            this._textureProps = []
            for (let k in ShaderHelper.effectAssets[value].properties) {
                if (ShaderHelper._not_show_prop.indexOf(k) != -1) {
                    continue
                }
                switch (ShaderHelper.effectAssets[value].properties[k]["type"]) {
                    case 4: //float
                        let pf = new ShaderPropertyFloat()
                        pf.key = k
                        pf.value = ShaderHelper.effectAssets[value].properties[k]["value"]
                        pf.Remark = ShaderHelper.effectAssets[value].properties[k]["displayName"]
                        this._floatProps.push(pf)
                        break
                    case 5: //vec2
                        let pv2 = new ShaderPropertyVec2()
                        pv2.key = k
                        pv2.value = ShaderHelper.effectAssets[value].properties[k]["value"]
                        pv2.Remark = ShaderHelper.effectAssets[value].properties[k]["displayName"]
                        this._vec2Props.push(pv2)
                        break
                    case 13: //sample
                        let ptex = new ShaderPropertyTexture()
                        ptex.key = k
                        ptex.value = ShaderHelper.effectAssets[value].properties[k]["value"]
                        ptex.Remark = ShaderHelper.effectAssets[value].properties[k]["displayName"]
                        this._textureProps.push(ptex)
                        break
                }
            }
        }
        this._program = value;
        this.applyEffect();
    }

    //shader参数
    @property({ type: [ShaderPropertyFloat] })
    _floatProps: ShaderPropertyFloat[] = [];
    @property({ type: [ShaderPropertyFloat] })
    get floatProps(): ShaderPropertyFloat[] {
        return this._floatProps;
    }
    set floatProps(value) {
        this._floatProps = value;
        this.applyEffect();
    }

    @property({ type: [ShaderPropertyVec2] })
    _vec2Props: ShaderPropertyVec2[] = [];
    @property({ type: [ShaderPropertyVec2] })
    get vec2Props(): ShaderPropertyVec2[] {
        return this._vec2Props;
    }
    set vec2Props(value) {
        this._vec2Props = value;
        this.applyEffect();
    }

    @property({ type: [ShaderPropertyTexture] })
    _textureProps: ShaderPropertyTexture[] = [];
    @property({ type: [ShaderPropertyTexture] })
    get textureProps(): ShaderPropertyTexture[] {
        return this._textureProps;
    }
    set textureProps(value) {
        this._textureProps = value;
        this.applyEffect();
    }

    @property({ type: cc.Boolean })
    enableTimer: boolean = false
    _startTime: number = 0

    //材质对象
    material: cc.Material = null;

    //effect的数组
    static effectAssets: any[] = null;

    protected start() {
        if (CC_EDITOR) {
            setTimeout(() => {
                this.applyEffect();
            }, 1000);

        } else {
            this.applyEffect();
        }
    }
    protected update(dt) {
        this._setShaderTimer()
    }

    applyEffect() {
        //获取精灵组件
        let sprite = this.node.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }

        let effectAsset = ShaderHelper.effectAssets[this.program];
        //实例化一个材质对象
        let material = new cc.Material();

        //在材质对象上开启USE_TEXTURE定义s
        material.define('USE_TEXTURE', true);
        material.define('COCOS_SHADER', true);

        //为材质设置effect，也是就绑定Shader了
        material.effectAsset = effectAsset
        material.name = effectAsset.name;

        //将材质绑定到精灵组件上，精灵可以绑定多个材质
        //这里我们替换0号默认材质
        sprite.setMaterial(0, material);

        //从精灵组件上获取材质，这步很重要，不然没效果
        this.material = sprite.getMaterial(0);

        sprite.spriteFrame.getTexture().width
        this.material.setProperty("u_resolution", new cc.Vec2(sprite.node.width, sprite.node.height))
        this.material.setProperty("texSize", new cc.Vec2(sprite.spriteFrame.getTexture().width, sprite.spriteFrame.getTexture().height))
        //this.props.forEach(item => item.key && this.material.setProperty(item.key, item.value || 0))
        this.floatProps.forEach(item => item.key && item.SetProperty(this.material))
        this.vec2Props.forEach(item => item.key && item.SetProperty(this.material))
        this.textureProps.forEach(item => item.key && item.SetProperty(this.material))

        this._startTime = new Date().getTime() / 1000.0

        cc.log("applyEffect")
    }

    private _setShaderTimer() {
        if (this.enableTimer && this.material) {
            let u_time = new Date().getTime() / 1000.0 - this._startTime
            this.material.setProperty('u_time', u_time)
        }
    }
}

cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    cc.dynamicAtlasManager.enabled = false;
    cc.loader.loadResDir('effects', cc.EffectAsset, (error, res) => {
        ShaderHelper.effectAssets = res;
        let array = ShaderHelper.effectAssets.map((item, i) => {
            return { name: item._name, value: i };
        });

        //@ts-ignore
        cc.Class.Attr.setClassAttr(ShaderHelper, 'program', 'enumList', array);
    });
})
