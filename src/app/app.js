import Drawer from "../lib/Drawer.js";
import Color from "../lib/core/Color.js";
import DrawEvent from "../lib/core/DrawEvent.js";
import VectorTransform from "../lib/core/VectorTransform.js";
import Hitbox from "../lib/drawables/Hitbox.js";
import Point from "../lib/core/Point.js";

import { tools } from "./toolbar.js";
import { curState } from "./state.js";
import { inspectorItems } from "./inspector.js";

const draw = new Drawer("#glcanvas");
draw.clearColor = new Color(1,1,1,1);

export const hitboxHover = new Hitbox(new Point(0, 0, Color.red()), 10);
export const hitboxSelect = new Hitbox(new Point(0, 0, Color.green()), 20);
hitboxHover.visible = false;
hitboxHover.allowSave = false;
hitboxSelect.visible = false;
hitboxSelect.allowSave = false;
draw.add(hitboxSelect);
draw.add(hitboxHover);

draw.addEventListener("mousemove",
/** @param {DrawEvent} e */
(e) => {
    if (tools.selected) {
        if (curState.selected)
            tools.currentTool.actions.update?.(e, curState.selected);
    } else {
        if (curState.dragged) { // move selected item
            const p = curState.selected.point;
            if (!p) {
                const d = curState.selected.drawable;
                const delta = {
                    x: e.position.x - curState.lastPos.x,
                    y: e.position.y - curState.lastPos.y
                };
                curState.lastPos.copy(e.position);
                d.position.add(delta);
                inspectorItems.model.setState({pos: {x: d.position.x, y: d.position.y}});
                hitboxSelect.point.add(delta);
            } else {
                const m = curState.selected.drawable;
                const tfPos = VectorTransform.reverse(
                    e.position, m.center, m.position, m.rotAngle, m.dilatation,
                );
                const op = p.originalPoint;
                op.copyPos(tfPos);
                inspectorItems.point.setState({pos: {x: op.x, y: op.y}});
                hitboxSelect.point.copyPos(e.position);
            }
        } else {
            if (e.point || e.center) {
                const p = e.point || e.center;
                hitboxHover.visible = true;
                hitboxHover.point.copyPos(p);
            } else {
                hitboxHover.visible = false;
            }
        }
    }
});

draw.addEventListener("mousedown",
/** @param {DrawEvent} e */
(e) => {
    if (tools.selected) {
        const model = tools.run(e, curState.selected);
        if (model) {
            curState.selected = model;
            draw.add(model);
        }
    } else {
        if (e.drawable) {
            curState.lastPos.copy(e.position);
            curState.selected = e;
            curState.dragged = true;
            hitboxHover.visible = false;
            hitboxSelect.point.copyPos(hitboxHover.center);
            hitboxSelect.visible = true;
        } else {
            curState.selected = undefined;
            hitboxSelect.visible = false;
        }
    }
});

draw.addEventListener("mouseup", (e) => {
    if (!curState.tool) {
        curState.dragged = false;
    }
});

let time = 0;
function render() {
    draw.render();
    if (curState.isAnimate) {
        time += 0.01 * inspectorItems.animation.state.speed;
        draw.drawables.forEach((d) => {
            d.dilatation = 0.2 * Math.cos(time) + 1;
        });
    }
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

globalThis.app = {
    drawer: draw,
};
