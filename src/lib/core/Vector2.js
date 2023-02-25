export default class Vector2 {
    /** @type {number} Abscissa of the point */
    #x
    /** @type {number} Ordinate of the point */
    #y

    /**
     * Object constructor for Point
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x=0, y=0) {
        this.#x = x;
        this.#y = y;
    }

    /**
     * Getter for Point
     * @returns number 
     */
    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    toArray() {
        return [this.#x, this.#y];
    }

    /**
     * Setter for point's abscissa
     * @param {number} x 
     */
    set x(x) {
        this.#x = x;
    }

    /**
     * Setter for point's ordinate
     * @param {number} y
     */
    set y(y) {
        this.#y = y;
    }

    set(x, y) {
        this.#x = x;
        this.#y = y;
        return this;
    }

    copy(v) {
        this.set(v.x, v.y);
        return this;
    }

    dist(v) {
        return Math.sqrt(this.distSq(v));
    }

    distSq(v) {
        const dx = this.#x - v.x;
        const dy = this.#y - v.y;
        return dx * dx + dy * dy;
    }

    almostEq(v) {
        const eps = Number.EPSILON;
        return (
            Math.abs(this.#x - v.x) < eps &&
            Math.abs(this.#y - v.y) < eps
        );
    }

    toJSON() {
        return { x: this.#x, y: this.#y };
    }

    static fromJSON(obj) {
        return new Vector2(obj.x, obj.y);
    }
}