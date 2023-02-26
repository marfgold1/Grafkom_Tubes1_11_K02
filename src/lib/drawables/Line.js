/**
 * Line class for WebGL rendering
 */

import Drawable from "../core/Drawable.js";
import Point from "../core/Point.js";

export default class Line extends Drawable {
    /** @type {Point} First point of the line */
    #p1
    /** @type {Point} Second point of the line */
    #p2

    /**
     * Object constructor for Line
     * @param {Point} p1 
     * @param {Point} p2 
     */
    constructor(p1, p2) {
        super([p1, p2], "line");
        this.#p1 = p1;
        this.#p2 = p2;
    }

    /**
     * Getter for Line
     * @return {Point}
     */
    get p1() {
        return this.#p1;
    }
    get p2() {
        return this.#p2;
    }

    onDraw(gl) {
        gl.drawArrays(gl.LINES, 0, 2);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            p1: this.#p1.toJSON(),
            p2: this.#p2.toJSON(),
        }
    }

    static fromJSON(json) {
        const l = new Line(Point.fromJSON(json.p1), Point.fromJSON(json.p2));
        return super.fromJSON(l, json);
    }
}
