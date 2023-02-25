/**
 * Get clip position from mouse event.
 * @param {Event} ev Event to get position from.
 * @returns {{x: number, y: number}}
 */
export function getClipPosition(ev) {
    /** @type {HTMLCanvasElement} */
    let canvas = ev.target;
    let rect = canvas.getBoundingClientRect();
    return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
    }
}
