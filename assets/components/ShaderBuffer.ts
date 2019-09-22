const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
export default class ShaderBuffer extends cc.Component {
    @property
    _bufferName: string = ""
    @property({ type: cc.String, tooltip: "注册到shader中的名字" })
    get bufferName(): string {
        return this._bufferName
    }
    set bufferName(value) {
        this._bufferName = value
        this._setShaderBuffer()
    }

    _texture: cc.RenderTexture = null
    _material: any

    @property
    _spriteFrame: cc.SpriteFrame = null
    @property({ type: cc.SpriteFrame })
    get spriteFrame(): cc.SpriteFrame {
        return this._spriteFrame
    }
    set spriteFrame(value) {
        this._spriteFrame = value
        this._setShaderBuffer()
    }

    _setShaderBuffer() {
        if (this._bufferName.length > 0 && this._material && this._spriteFrame) {
            this._material.setProperty(this._bufferName, this._spriteFrame.getTexture())
            this._material.setProperty(this._bufferName + "Size", new cc.Vec2(this._spriteFrame.getTexture().width, this._spriteFrame.getTexture().height))
        }
    }

    start() {
        this._material = this.node.getComponent(cc.Sprite).sharedMaterials[0]
        this._setShaderBuffer()
    }
    update() { }

}