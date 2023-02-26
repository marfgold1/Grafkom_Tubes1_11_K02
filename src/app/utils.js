import Point from "../lib/core/Point.js";
import Drawables from "../lib/drawables/Drawables.js";

import { inspector, inspectorItems } from "./inspector.js";
import { curState } from "./state.js";
import { tools } from "./toolbar.js";

const createModel = (model, pos) => {
    tools.isUsing = true;
    const point = new Point(pos.x, pos.y);
    point.color.setHex(inspectorItems.drawOpt.state.col);
    return new Drawables[model](point, point.clone());
}

export const drawDefault = (model=null, getPoint=null) => { return {
    begin(ev) {
        return createModel(model, ev.position);
    },
    end() {
        curState.selected = undefined;
        tools.isUsing = false;
    },
    onToggle() {
        inspector.toggle("drawOpt");
    },
    update(ev, m) {
        getPoint?.(m).copyPos(ev.position);
    }
};};
