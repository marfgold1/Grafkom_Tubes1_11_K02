/**
 * Point Class for WebGL rendering
 */

import Color from './Color';

class Point {

    /**
     * Private variables
     * x: Abscissa of the point
     * y: Ordinate of the point
     * type: Object type
     * color: Color of the point
     */
    #x
    #y
    #type
    #color

    /**
     * Object constructor for Point
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y, color=Color(0,0,0,1)) {
        this.#x = x;
        this.#y = y;
        this.#type = "point";
        this.#color = color;
    }

    /**
     * Getter for Point
     * @returns number 
     */
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getType() {
        return this.#type;
    }
    getColor() {
        return this.#color;
    }

    /**
     * Setter for point's abscissa
     * @param {number} x 
     */
    setX(x) {
        this.#x = x;
    }

    /**
     * Setter for point's ordinate
     * @param {number} y
     */
    setY(y) {
        this.#y = y;
    }

    /**
     * Setter for [point's color
     * @param {Color} color
     */
    setColor(color) {
        this.#color = color;
    }

    /**
     * Convert point coordinates to array
     * @returns number[]
     */
    toArray() {
        return [this.#x, this.#y];
    }

}

export default Point;