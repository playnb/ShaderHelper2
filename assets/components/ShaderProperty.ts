// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass('ShaderProperty')
export class ShaderProperty {
    @property(cc.String)
    key = '';
    @property({ readonly: true })
    Remark = "";
}


@ccclass('ShaderPropertyFloat')
export class ShaderPropertyFloat extends ShaderProperty {
    @property(cc.Float)
    value = 0.0;

    public SetProperty(m: cc.Material) {
        m.setProperty(this.key, this.value)
    }
}

@ccclass('ShaderPropertyVec2')
export class ShaderPropertyVec2 extends ShaderProperty {
    @property(cc.Vec2)
    value: cc.Vec2 = null
    public SetProperty(m: cc.Material) {
        if (this.value) {
            m.setProperty(this.key, this.value)
        }
    }
}

@ccclass('ShaderPropertyTexture')
export class ShaderPropertyTexture extends ShaderProperty {
    @property({ type: cc.Texture2D })
    value: cc.Texture2D = null
    public SetProperty(m: cc.Material) {
        if (this.value) {
            m.setProperty(this.key, this.value)
            m.setProperty(this.key + "Size", new cc.Vec2(this.value.width, this.value.height))
        }
    }
}

