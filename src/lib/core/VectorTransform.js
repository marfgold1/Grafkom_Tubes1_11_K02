import Point from "./Point.js";
import Vector2 from "./Vector2.js";

/**
 * Point Class for WebGL rendering
 */
export default class VectorTransform extends Vector2 {
    /** @type {Point} Original point. */
    #originalPoint

    constructor(originalPoint, position, rotAngle, dilatation) {
        let x = originalPoint.x;
        let y = originalPoint.y;
        const d = rotAngle/180.0*Math.PI;
        const s = Math.sin(d);
        const c = Math.cos(d);
        super(
            dilatation*(x*c+y*s)+position.x,
            dilatation*(-x*s+y*c)+position.y,
        );
        this.#originalPoint = originalPoint;
    }

    static reverse(currentPoint, position, rotAngle, dilatation) {
        const d = rotAngle/180.0*Math.PI;
        const s = Math.sin(d);
        const c = Math.cos(d);
        const x = (currentPoint.x-position.x)/dilatation;
        const y = (currentPoint.y-position.y)/dilatation;
        return new Vector2(
            x*c-y*s,
            x*s+y*c,
        );
    }

    get x() {
        return super.x;
    }

    get y() {
        return super.y;
    }

    get originalPoint() {
        return this.#originalPoint;
    }

    get color() {
        return this.#originalPoint.color;
    }
}