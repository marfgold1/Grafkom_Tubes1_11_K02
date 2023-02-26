import DrawEvent from "../lib/core/DrawEvent.js";
import { Toolbar, ToolItem } from "../lib/Toolbar.js";

import { drawDefault } from "./utils.js";
import { inspector as insp, inspectorItems as inspd } from "./inspector.js";
import { curState } from "./state.js";

export const tools = new Toolbar(document.getElementById("toolbar"), () => {
    if (tools.selected)
        curState.selected = undefined;
});

export const toolitem = {
    line: new ToolItem("line", {
        ...drawDefault("Line", (m) => m.p2),
    }),
    square: new ToolItem("square", { 
        ...drawDefault("Square", (m) => m.br),
    }),
    rect: new ToolItem("rect", {
        ...drawDefault("Rectangle", (m) => m.br),
    }),
    polygon: new ToolItem("polygon", {
        ...drawDefault("Polygon", (m) => m.points[m.points.length-1]),
        onToggle(v) { insp.toggle("drawOpt"); insp.toggle("drawPoly"); },
        begin(v) {
            const model = drawDefault("Polygon").begin(v);
            inspd.drawPoly.setState({count: 1});
            return model;
        },
        /** @param {DrawEvent} e */
        end(e) {
            const poly = e.drawable;
            const count = inspd.drawPoly.state.count + 1;
            inspd.drawPoly.setState({count})
            if (count >= inspd.drawPoly.state.maxVertex) {
                curState.selected = undefined; // finally end
                tools.isUsing = false;
            } else
                poly.add(poly.points[count-1].clone()); // keep adding
        },
    }),
    bucket: new ToolItem("bucket", {
        onToggle() { insp.toggle("bucket"); },
        /** @param {DrawEvent} ev */
        begin(ev) {
            const d = ev.drawable;
            const p = ev.point;
            if (p) {
                console.log("yo");
                p.color.setHex(inspd.bucket.state.col);
            }
            else if (d) {
                console.log("sup");
                d.points.map(p => p.color.setHex(inspd.bucket.state.col));
            }
        },
    }),
    save: new ToolItem("save", {
        onToggle() { insp.toggle("save"); },
    }),
}
Object.keys(toolitem).forEach((v) => { tools.add(toolitem[v]); });

globalThis.app = {
    ...globalThis.app,
    toolbar: {
        instance: tools,
        tools: toolitem,
    }
};
