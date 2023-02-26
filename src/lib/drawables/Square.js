import Drawable from "../core/Drawable.js";
import Point from "../core/Point.js";

export default class Square extends Drawable {
    #tl
    #tr
    #br
    #bl

    /**
     * Create new square in a quadrant.
     * @param {Point} p1 Starting point of the square.
     * @param {Point} p2 Ending point of the square.
     */
    constructor(p1, p2) {
        const bl = new Point(p1.x, p2.y, p1.color.clone());
        const tr = new Point(p2.x, p1.y, p1.color.clone());
        super([p1, tr, p2, bl], "square");
        this.#tl = p1; p1.onChange = () => this.#update("tl");
        this.#tr = tr; tr.onChange = () => this.#update("tr");
        this.#br = p2; p2.onChange = () => this.#update("br");
        this.#bl = bl; bl.onChange = () => this.#update("bl");
    }

    get br() {
        return this.#br;
    }

    get side() {
        return Math.abs(this.#br.x - this.#tl.x);
    }

    set side(val) {
        this.#br.set(this.#tl.x + Math.abs(val), this.#tl.y + Math.abs(val));
    }

    #update(type) {
        if (type === "br") {
            const dx = this.#br.x - this.#tl.x;
            const dy = this.#br.y - this.#tl.y;
            const s = Math.min(Math.abs(dx), Math.abs(dy));
            this.#br.forceSet(this.#tl.x + s * (dx>0?1:-1), this.#tl.y + s * (dy>0?1:-1));
            this.#tr.forceSet(this.#tl.x + s * (dx>0?1:-1), this.#tl.y);
            this.#bl.forceSet(this.#tl.x, this.#tl.y + s * (dy>0?1:-1));
        }
        else if (type === "tl") {
            const dx = this.#br.x - this.#tl.x;
            const dy = this.#br.y - this.#tl.y;
            const s = Math.min(Math.abs(dx), Math.abs(dy));
            this.#tl.forceSet(this.#br.x - s * (dx>0?1:-1), this.#br.y - s * (dy>0?1:-1));
            this.#bl.forceSet(this.#br.x - s * (dx>0?1:-1), this.#br.y);
            this.#tr.forceSet(this.#br.x, this.#br.y - s * (dy>0?1:-1));
        }
        else if (type === "tr") {
            const dx = this.#tr.x - this.#bl.x;
            const dy = this.#bl.y - this.#tr.y;
            const s = Math.min(Math.abs(dx), Math.abs(dy));
            this.#tr.forceSet(this.#bl.x + s * (dx>0?1:-1), this.#bl.y - s * (dy>0?1:-1));
            this.#br.forceSet(this.#bl.x + s * (dx>0?1:-1), this.#bl.y);
            this.#tl.forceSet(this.#bl.x, this.#bl.y - s * (dy>0?1:-1));
        }
        else if (type === "bl") {
            const dx = this.#tr.x - this.#bl.x;
            const dy = this.#bl.y - this.#tr.y;
            const s = Math.min(Math.abs(dx), Math.abs(dy));
            this.#bl.forceSet(this.#tr.x - s * (dx>0?1:-1), this.#tr.y + s * (dy>0?1:-1));
            this.#tl.forceSet(this.#tr.x - s * (dx>0?1:-1), this.#tr.y);
            this.#br.forceSet(this.#tr.x, this.#tr.y + s * (dy>0?1:-1));
        }
    }

    getCenterIfIn(position, tolerance=5) {
        const trCenter = this.trCenter;
        const halfSide = 0.5 * this.side;

        if (position.x <= trCenter.x + halfSide && 
            position.x >= trCenter.x - halfSide &&
            position.y <= trCenter.y + halfSide &&
            position.y >= trCenter.y - halfSide) {
            return this.trCenter;
        }
        return null;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            points: this.points.map(p => p.toJSON()),
        }
    }

    static fromJSON(json) {
        const r = new Square(Point.fromJSON(json.points[0]), Point.fromJSON(json.points[2]));
        r.points.forEach((p, i) => {
            p.color.copy(json.points[i].color)
        });
        return super.fromJSON(r, json);
    }
}