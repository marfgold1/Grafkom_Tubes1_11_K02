import Color from "./Color.js";
import Vector2 from "./Vector2.js";

/**
 * Point Class for WebGL rendering
 */
export default class Point extends Vector2 {
    /** @type {Color} Color of the point. */
    #color

    /**
     * Object constructor for Point
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y, color=new Color(0,0,0,1)) {
        super(x, y);
        this.#color = color;
    }

    get color() {
        return this.#color;
    }

    /**
     * Setter for point's color
     * @param {Color} color
     */
    set color(color) {
        this.#color = color;
    }

    copyPos(p) {
        return super.copy(p);
    }

    copy(p) {
        super.copy(p);
        this.#color.copy(p.color);
        return this;
    }

    clone() {
        return new Point(this.x, this.y, this.color.clone());
    }
    
    /**
     * Create new instance of point from another point.
     * @param {Point} p Point to copy from.
     * @returns {Point}
     */
    static from(p) {
        return new Point(p.x, p.y, p.color.clone());
    }
}
