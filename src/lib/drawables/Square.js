import Drawable from "../core/Drawable.js";
import Point from "../core/Point.js";

export default class Square extends Drawable {
    #tl
    #tr
    #br
    #bl

    /**
     * Create new square in a quadrant.
     * @param {Point} p Starting point of the square (top left).
     * @param {number} side Length of the square.
     * @param {number} quadrant Quadrant to draw the square in.
     */
    constructor(p, side, quadrant=4) {
        const bl = new Point(p1.x, p2.y);
        const tr = new Point(p2.x, p1.y);
        super([p1, tr, p2, bl], "square");
        this.#tl = p1;
        this.#tr = tr;
        this.#br = p2;
        this.#bl = bl;
        this.update();
    }

    get br() {
        return this.#br;
    }

    get side() {
        return this.#br.x - this.#tl.x;
    }

    set side(val) {
        this.#br.set(this.#tl.x + val, this.#tl.y + val);
    }

    #update(type) {
        const s = Math.min(this.#br.x - this.#tl.x, this.#br.y - this.#tl.y);
        this.#br.set(this.#tl.x + s, this.#tl.y + s);
        this.#tr.set(this.#tl.x + s, this.#tl.y);
        this.#bl.set(this.#tl.x, this.#tl.y + s);
    }
}