/**
 * Color class for WebGL rendering
 * Color is coded in rgba with values between 0 and 1.
 * r: red, g: green, b: blue, a: alpha
 */

export default class Color {
    /**
     * Color is coded in rgba with values between 0 and 1
     * r: red, g: green, b: blue, a: alpha
     */
    /** @type {number} */
    r
    /** @type {number} */
    g
    /** @type {number} */
    b
    /** @type {number} */
    a

    /**
     * Create new instance of color.
     * @param {number} r The red value
     * @param {number} g The green value
     * @param {number} b The blue value
     * @param {number} a The alpha value
     */
    constructor(r, g, b, a) {
        this.set(r,g,b,a);
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    toArray() {
        return [this.r, this.g, this.b, this.a];
    }

    /**
     * Color setter
     * @param {number} r The red value
     * @param {number} g The green value
     * @param {number} b The blue value
     * @param {number} a The alpha value
     */
    set(r, g, b, a=1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * Color setter using hex string
     * @param {string} hex Hex string
     * @param {number} a Alpha value
     */
    setHex(hex, a = this.a) {
        this.r = parseInt(hex.substring(1, 3), 16);
        this.g = parseInt(hex.substring(3, 5), 16);
        this.b = parseInt(hex.substring(5, 7), 16);
        this.a = a;
    }

    copy(c) {
        this.set(c.r, c.g, c.b, c.a);
        return this;
    }

    /**
     * Create new instance of color from this instance.
     */
    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    /**
     * Convert color to 32 bit value
     */
    to32bit() {
        return `rgba(${this.r*255}, ${this.g*255}, ${this.b*255}, ${this.a*255})`;
    }

    /**
     * Get red value in 8-bit integer representation
     */
    get rInt() {
        return this.r*255;
    }
    
    /**
     * Get green value in 8-bit integer representation
     */
    get gInt() {
        return this.g*255;
    }

    /**
     * Get blue value in 8-bit integer representation
     */
    get bInt() {
        return this.b*255;
    }

    /**
     * Get alpha value in 8-bit integer representation
     */
    get aInt() {
        return this.a*255;
    }

    /**
     * Convert RGB to Hexadecimal representation
     */
    get hex() {
        return `#\
        ${(this.r*255).toString(16).padStart(2, '0')}\
        ${(this.g*255).toString(16).padStart(2, '0')}\
        ${(this.b*255).toString(16).padStart(2, '0')}\
        `;
    }

    static red() {
        return new Color(1, 0, 0, 1);
    }

    static green() {
        return new Color(0, 1, 0, 1);
    }

    static blue() {
        return new Color(0, 0, 1, 1);
    }

    static white() {
        return new Color(1, 1, 1, 1);
    }

    static black() {
        return new Color(0, 0, 0, 1);
    }
}
