import Drawable from "../core/Drawable.js";
import Point from "../core/Point.js";

export default class Hitbox extends Drawable {
    /** @type {Point} Point for hitbox. */
    #p;
    /** @type {number} Size of the hitbox. */
    size;

    constructor(p, size=10) {
        super([p], "hitbox");
        this.#p = p;
        this.size = size;
    }

    get point () {
        return this.#p;
    }

    get color() {
        return this.#p.color;
    }

    onSetVariables(drawer) {
        super.onSetVariables(drawer);
        drawer.setUniform("pointSize", this.size);
    }

    /**
     * Draw function for hitbox.
     * @param {WebGLRenderingContext} gl WebGL instance.
     */
    onDraw(gl) {
        gl.drawArrays(gl.POINTS, 0, 1);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            p: this.#p.toJSON(),
            size: this.size,
        }
    }

    static fromJSON(json) {
        const h = new Hitbox(Point.fromJSON(json.p), json.size);
        super.fromJSON(h, json);
    }
}