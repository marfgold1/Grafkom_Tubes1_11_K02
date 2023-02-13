/**
 * Color class for WebGL rendering
 * Color is coded in rgba with values between 0 and 1.
 * r: red, g: green, b: blue, a: alpha
 */

class Color {
    /**
     * Color is coded in rgba with values between 0 and 1
     * r: red, g: green, b: blue, a: alpha
     */
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * Color getter
     */
    getR() {
        return this.r;
    }
    getG() {
        return this.g;
    }
    getB() {
        return this.b;
    }
    getA() {
        return this.a;
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
    set(r, g, b, a) {
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

    /**
     * Color clone
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
    getRInt() {
        return this.r*255;
    }
    
    /**
     * Get green value in 8-bit integer representation
     */
    getGInt() {
        return this.g*255;
    }

    /**
     * Get blue value in 8-bit integer representation
     */
    getBInt() {
        return this.b*255;
    }

    /**
     * Get alpha value in 8-bit integer representation
     */
    getAInt() {
        return this.a*255;
    }

    /**
     * Convert RGB to Hexadecimal representation
     */
    toHex() {
        return `#${(this.r*255).toString(16).padStart(2, '0')}${(this.g*255).toString(16).padStart(2, '0')}${(this.b*255).toString(16).padStart(2, '0')}`;
    }
}
