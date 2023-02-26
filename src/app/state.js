import DrawEvent from "../lib/core/DrawEvent.js";
import Vector2 from "../lib/core/Vector2.js";

import { hitboxSelect } from "./app.js";
import { inspector, inspectorItems as inspd } from "./inspector.js";
import { tools } from "./toolbar.js";

export const curState = new Proxy({
    /** @type {DrawEvent} */
    selected: undefined,
    lastPos: new Vector2(),
    dragged: false,
}, {
    /** @param {DrawEvent} val */
    set(obj, prop, val) {
        obj[prop] = val;
        if (prop === "selected") {
            if (val && !tools.selected) {
                const model = val.drawable;
                inspd.model.setState({
                    pos: {x: model.position.x, y: model.position.y},
                    rot: model.rotAngle,
                    dilate: model.dilatation,
                })
                inspector.show("model");
                inspector.hide("drawSquare", "drawRectangle", "point");

                if (val.point) {
                    const op = val.point.originalPoint;
                    inspd.point.setState({
                        pos: {x: op.x, y: op.y},
                        col: val.point.color.hex,
                    });
                    inspector.show("point");
                } else {
                    switch(val.drawable.type) {
                        case "square":
                            inspd.drawSquare.setState({
                                side: val.drawable.side
                            });
                            inspector.show("drawSquare");
                            break;
                        case "rectangle":
                            inspd.drawRectangle.setState({
                                width: val.drawable.width,
                                height: val.drawable.height
                            });
                            inspector.show("drawRectangle");
                            break;
                    }
                }
            } else {
                inspector.hide("model", "point", "drawSquare", "drawRectangle");
                hitboxSelect.visible = false;
            }
        }
        return true;
    }
});

globalThis.app = {
    ...globalThis.app,
    state: curState,
}