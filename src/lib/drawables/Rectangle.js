import Drawable from "../core/Drawable.js";
import Point from "../core/Point.js";

export default class Rectangle extends Drawable {
    /** @type {Point} Top left point of the line */
    #tl
    /** @type {Point} Top right point of the line */
    #tr
    /** @type {Point} Bottom right point of the line */
    #br
    /** @type {Point} Bottom left point of the line */
    #bl

    /**
     * 
     * @param {Point} p1 Top left point of the rectangle
     * @param {Point} p2 Bottom right point of the rectangle
     */
    constructor(p1, p2) {
        const bl = new Point(p1.x, p2.y, p1.color.clone());
        const tr = new Point(p2.x, p1.y, p1.color.clone());
        super([p1, tr, p2, bl], "rectangle");
        this.#tl = p1; p1.onChange = () => this.#update("tl");
        this.#tr = tr; tr.onChange = () => this.#update("tr");
        this.#br = p2; p2.onChange = () => this.#update("br");
        this.#bl = bl; bl.onChange = () => this.#update("bl");
    }

    get bl() {
        return this.#bl;
    }

    get tr() {
        return this.#tr;
    }

    get tl() {
        return this.#tl;
    }

    get br() {
        return this.#br;
    }

    get width() {
        return Math.abs(this.#br.x - this.#tl.x);
    }

    set width(val) {
        this.#br.x = this.#tl.x + Math.abs(val);
    }

    get height() {
        return Math.abs(this.#br.y - this.#tl.y);
    }

    set height(val) {
        this.#br.y = this.#tl.y + Math.abs(val);
    }

    #update(type) {
        if (type === "br" || type === "tl") {
            const h = this.#br.y - this.#tl.y;
            const w = this.#br.x - this.#tl.x;
            this.#tr.forceSet(this.#tl.x + w, this.#tl.y);
            this.#bl.forceSet(this.#tl.x, this.#tl.y + h);
        }
        else if (type === "tr" || type === "bl") {
            const h = this.#bl.y - this.#tr.y;
            const w = this.#tr.x - this.#bl.x;
            this.#tl.forceSet(this.#bl.x, this.#bl.y - h);
            this.#br.forceSet(this.#bl.x + w, this.#bl.y);
        }
    }

    getCenterIfIn(position, tolerance=5) {
        const trCenter = this.trCenter;
        const halfWidth = 0.5 * this.width;
        const halfHeight = 0.5 * this.height;
        if (position.x <= trCenter.x + halfWidth && 
            position.x >= trCenter.x - halfWidth &&
            position.y <= trCenter.y + halfHeight &&
            position.y >= trCenter.y - halfHeight) {
            return this.trCenter;
        }
        return null;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            p1: this.#tl.toJSON(),
            p2: this.#br.toJSON(),
        }
    }

    static fromJSON(json) {
        const r = new Rectangle(Point.fromJSON(json.p1), Point.fromJSON(json.p2));
        super.fromJSON(r, json);
    }
}