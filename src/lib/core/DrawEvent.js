import Drawer from "../Drawer.js"
import Drawable from "./Drawable.js"
import { getClipPosition } from "./Utils.js"

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
    /** @type {object} Other properties to add to the event. */
    #other
    /** @type {function} Callback to load model and point. */
    #cbLoadModel
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
        this.#cbLoadModel = () => {
            const res = drawer.getObjectAt(this.#position, this.tolerance);
            this.#drawable = res.drawable;
            this.#point = res.point;
        };
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
        this.#loadModelPoint();
        return this.#drawable;
    }

    get point() {
        this.#loadModelPoint();
        return this.#point;
    }
    
    get other() {
        return this.#other;
    }

    #loadModelPoint() {
        if (this.#drawable === undefined)
            this.#cbLoadModel();
    }
}