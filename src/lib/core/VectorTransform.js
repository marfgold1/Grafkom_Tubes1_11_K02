import Point from "./Point.js";
import Vector2 from "./Vector2.js";

/**
 * Point Class for WebGL rendering
 */
export default class VectorTransform extends Vector2 {
    /** @type {Point} Original point. */
    #originalPoint

    constructor(originalPoint, center, position, rotAngle, dilatation) {
        const p = originalPoint;
        const relX = p.x - center.x;
        const relY = p.y - center.y;
        rotAngle = rotAngle / 180.0 * Math.PI;
        const s = Math.sin(rotAngle);
        const c = Math.cos(rotAngle);
        const x = dilatation * (relX * c - relY * s) + position.x + center.x;
        const y = dilatation * (relX * s + relY * c) + position.y + center.y;
        super(x, y);
        this.#originalPoint = originalPoint;
    }

    static reverse(currentPoint, center, position, rotAngle, dilatation) {
        const p = currentPoint;
        const relX = p.x - position.x - center.x;
        const relY = p.y - position.y - center.y;
        rotAngle = rotAngle / 180.0 * Math.PI;
        const s = Math.sin(rotAngle);
        const c = Math.cos(rotAngle);
        const x = (relX * c + relY * s) / dilatation + center.x;
        const y = (-relX * s + relY * c) / dilatation + center.y;
        return new Vector2(
            x, y
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