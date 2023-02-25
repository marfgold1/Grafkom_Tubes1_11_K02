import Drawer from "../Drawer.js"
import Drawable from "./Drawable.js"
import Point from "./Point.js"
import { getClipPosition } from "./Utils.js"
import Vector2 from "./Vector2.js"

export default class DrawEvent {
    /** @type {string} Draw event type. */
    #type
    /** @type {Drawer} Drawer where this event created. */
    #target
    /** @type {{x: number, y: number}} Mouse position. */
    #position
    /** @type {Drawable} Drawable selected. */
    #drawable  // lazy load
    /** @type {Point} Point selected. */
    #point  // lazy load
    /** @type {Vector2} Point center. */
    #center // lazy load
    /** @type {object} Other properties to add to the event. */
    #other
    /** @type {number} Tolerance for draw event */
    tolerance

    /**
     * Generate new DrawEvent.
     * @param {string} type Draw event type.
     * @param {Event} ev Event to generate from.
     * @param {Drawer} drawer Drawer to get object from.
     * @param {number} tolerance Tolerance in pixel.
     * @param {object} other Other properties to add to the event.
     */
    constructor(type, ev, drawer, other={}) {
        this.#type = type;
        this.#target = drawer;
        this.#position = getClipPosition(ev);
        this.tolerance = 10;
        this.#other = other;
    }

    get type() {
        return this.#type;
    }

    get target() {
        return this.#target;
    }

    get position() {
        return this.#position;
    }

    get drawable() {
        if (this.#drawable === undefined) {
            const res = this.point;
            if (res === null)
                this.center;
        }
        return this.#drawable;
    }

    get point() {
        if (this.#point === undefined) {
            const res = this.#target.getObjectAt(this.#position, this.tolerance);
            this.#drawable = res.drawable;
            this.#point = res.point;
        }
        return this.#point;
    }

    get center() {
        if (this.#center === undefined){
            const res = this.#target.getDrawableAt(this.#position, this.tolerance);
            this.#drawable = res.drawable;
            this.#center = res.center;
        }
        return this.#center;
    }
    
    get other() {
        return this.#other;
    }
}