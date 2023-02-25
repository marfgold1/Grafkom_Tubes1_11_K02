import Color from "./Color.js";
import Vector2 from "./Vector2.js";

/**
 * Point Class for WebGL rendering
 */
export default class Point extends Vector2 {
    /** @type {Color} Color of the point. */
    #color
    /** @type {Function} Callback on point change. */
    onChange

    /**
     * Object constructor for Point
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y, color=new Color(0,0,0,1)) {
        super(x, y);
        this.#color = color;
    }

    /**
     * @param {number} x
     */
    set x(x) {
        super.x = x;
        this.onChange && this.onChange();
    }

    /**
     * @param {number} y
     */
    set y(y) {
        super.y = y;
        this.onChange && this.onChange();
    }

    set(x, y) {
        super.set(x, y);
        this.onChange && this.onChange();
    }

    get x() {
        return super.x;
    }

    get y() {
        return super.y;
    }

    get color() {
        return this.#color;
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

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            color: this.color.toJSON()
        }
    }

    static fromJSON(obj) {
        return new Point(obj.x, obj.y, Color.fromJSON(obj.color));
    }
}
