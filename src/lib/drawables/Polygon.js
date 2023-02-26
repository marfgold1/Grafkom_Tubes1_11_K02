import Drawable from "../core/Drawable.js";

export default class Polygon extends Drawable {
    constructor(...points) {
        super(points, "polygon");
    }

    add(p) {
        this.points.push(p);
    }

    remove(p) {
        this.points.splice(this.points.indexOf(p), 1);
    }

    removeAt(idx) {
        if (idx > -1 && idx < this.points.length)
            this.points.splice(idx, 1);
    }

    onSetVariables(drawer) {
        super.onSetVariables(drawer);
        drawer.setUniform("pointSize", this.size);
    }

    onDraw(gl) {
        switch(this.points.length) {
            case 1:
                gl.drawArrays(gl.POINTS, 0, 1);
                break;
            case 2:
                gl.drawArrays(gl.LINES, 0, 2);
                break;
            default:
                gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
                break;
        }
    }

    toJSON() {
        return {
            ...super.toJSON(),
            points: this.points.map(p => p.toJSON()),
        }
    }

    static fromJSON(json) {
        const p = new Polygon(...json.points.map(p => Point.fromJSON(p)));
        super.fromJSON(p, json);
    }
}