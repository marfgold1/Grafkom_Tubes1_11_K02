/**
 * Line class for WebGL rendering
 */

import Point from "./Point";

class Line {

    /**
     * Private members:
     * p1: First point of the line
     * p2: Second point of the line
     */
    #p1
    #p2

    /**
     * Object constructor for Line
     * @param {Point} p1 
     * @param {Point} p2 
     */
    constructor(p1, p2) {
        this.#p1 = p1;
        this.#p2 = p2;
    }

    /**
     * Getter for Line
     * @return {Point}
     */
    getPoint1() {
        return this.#p1;
    }
    getPoint2() {
        return this.#p2;
    }

    /**
     * Setter for Line
     */
    setPoint1(p1) {
        this.#p1 = p1;
    }
    setPoint2(p2) {
        this.#p2 = p2;
    }
}