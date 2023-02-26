import Drawer from "../Drawer.js";
import Point from "./Point.js";
import Vector2 from "./Vector2.js";
import VectorTransform from "./VectorTransform.js";

export default class Drawable {
    /** @type {string} Type of drawable */
    #type
    /** @type {Point[]} Points of drawable. */
    #points
    /** @type {number} Rotation of drawable. */
    rotAngle = 0;
    /** @type {Vector2} Position of drawable. */
    #position = new Vector2(0, 0);
    /** @type {number} Dilatation of drawable. */
    dilatation = 1;
    /** @type {boolean} Is drawable visible? */
    visible = true;
    /** @type {boolean} Allow saving drawable */
    allowSave = true;
    /** @type {boolean} Need update transform? */
    needsUpdate = true;
    /** @type {VectorTransform[]} Transformed point. */
    #trPoints

    /**
     * Create new instance of drawable.
     * 
     * @param {Point[]} points Points of drawable.
     * @param {string} type Type of drawable
     */
    constructor(points, type="drawable") {
        this.#type = type;
        this.#points = points;
    }

    get points() {
        return this.#points;
    }
    
    get trPoints() {
        // kalkulasi
        if (this.needsUpdate) {
            const center = this.center;
            this.#trPoints = this.#points.map(p => {
                return new VectorTransform(
                    p, center, this.#position, this.rotAngle, this.dilatation
                );
            });
            this.needsUpdate = false;
        }
        return this.#trPoints;
    }

    get type() {
        return this.#type;
    }

    get vertices() {
        return this.trPoints.map(p => p.toArray()).flat();
    }

    get vertexColors() {
        return this.#points.map(p => p.color.toArray()).flat();
    }

    get position() {
        return this.#position;
    }

    get center() {
        const len = this.#points.length;
        let avg_x = 0, avg_y = 0;
        this.#points.forEach((p) => {
            avg_x += p.x;
            avg_y += p.y;
        }, 0);
        avg_x /= len;
        avg_y /= len;
        return new Vector2(avg_x, avg_y);
    }

    get trCenter() {
        const center = this.center;
        return new Vector2(center.x + this.position.x, center.y + this.position.y);
    }

    /**
     * Get point on position.
     * 
     * @param {{x: number, y: number}} position Position to check.
     * @param {number} tolerance Tolerance in pixel.
     * @returns {VectorTransform?}
     */
    getPointOnPosition(position, tolerance=5) {
        const points = this.trPoints;
        let result = null;
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (p.dist(position) < tolerance) {
                result = p;
                break;
            }
        }
        return result;
    }

    /**
     * Check if position in drawable.
     * Normally check in center of the drawable.
     * 
     * @param {{x: number, y: number}} position Position to check.
     * @param {number} tolerance Tolerance in pixel.
     * @returns {VectorTransform?}
     */
    getCenterIfIn(position, tolerance=5) {
        if (this.trCenter.dist(position) < tolerance) {
            return this.trCenter;
        }
        return null;
    }

    /**
     * Set attribute or uniform for drawable.
     * @param {Drawer} drawer Drawer instance.
     */
    onSetVariables(drawer) {
        drawer.setAttribute("position", this.vertices, 2);
        drawer.setAttribute("color", this.vertexColors, 4);
    }

    /**
     * Draw function for drawable.
     * @param {WebGLRenderingContext} gl WebGL instance.
     */
    onDraw(gl) {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.#points.length);
    }

    toJSON() {
        return {
            type: this.#type,
            rotAngle: this.rotAngle,
            position: this.#position.toJSON(),
            dilate: this.dilatation,
            visible: this.visible
        }
    }

    static fromJSON(obj, json) {
        obj.position.set(json.position.x, json.position.y);
        obj.dilatation = json.dilate;
        obj.visible = json.visible;
        obj.rotAngle = json.rotAngle;
        return obj;
    }
}
