import DrawEvent from "./lib/core/DrawEvent.js";
import Vector2 from "./lib/core/Vector2.js";
import VectorTransform from "./lib/core/VectorTransform.js";
import SaveLoadFile from "./lib/SaveLoadFile.js";

const el = (v) => document.getElementById(v);
const createModel = (model, pos) => {
    toolbar.isUsing = true;
    const point = new DRW.Point(pos.x, pos.y);
    point.color.setHex(inspd.drawOpt.state.col);
    return new DRW[model](point, point.clone());
}
const end = () => { curState.selected = undefined; toolbar.isUsing = false; }
const onToggle = () => { insp.toggle("drawOpt"); }
const updatePoint = (point, e) => { point.copyPos(e.position); }
const curState = new Proxy({
    /** @type {DrawEvent} */
    selected: undefined,
    lastPos: new Vector2(),
    dragged: false,
}, {
    /** @param {DrawEvent} val */
    set(obj, prop, val) {
        obj[prop] = val;
        if (prop === "selected") {
            if (val && !toolbar.selected) {
                const model = val.drawable;
                inspd.model.setState({
                    pos: {x: model.position.x, y: model.position.y},
                    dilate: model.dilatation,
                })
                inspector.show("model");

                if (!val.point && val.drawable.type === "square") {
                    inspd.drawSquare.setState({
                        side: val.drawable.side
                    });
                    inspector.show("drawSquare");
                } else {
                    inspector.hide("drawSquare");
                }

                if (!val.point && val.drawable.type === "rectangle") {
                    inspd.drawRectangle.setState({
                        width: val.drawable.width,
                        height: val.drawable.height
                    });
                    inspector.show("drawRectangle");
                } else {
                    inspector.hide("drawRectangle");
                }

                if (val.point) {
                    const op = val.point.originalPoint;
                    inspd.point.setState({
                        pos: {x: op.x, y: op.y},
                        col: val.point.color.hex,
                    });
                    inspector.show("point");
                } else {
                    inspector.hide("point");
                }
                hitboxHover.visible = false;
                hitboxSelect.visible = true;
                hitboxSelect.point.copyPos(val.position);
            } else {
                inspector.hide("model");
                inspector.hide("point");
                inspector.hide("drawSquare");
                inspector.hide("drawRectangle");

                hitboxSelect.visible = false;
            }
        }
        return true;
    }
});


const insp = new DRWI.Inspector(el("insp"));
globalThis.inspector = insp;
const inspd = {
    drawOpt: new DRWI.InspectorSection("drawOpt", "Drawing Options", {
        col: "#000000",
    }, {col: ["Color", "color"]}),

    drawSquare: new DRWI.InspectorSection("drawSquare", "Square", {
        side: 0
    }, {side: ["Side length", "", (val) => {
        curState.selected.drawable.side = val;
    }]}),

    drawRectangle: new DRWI.InspectorSection("drawRectangle", "Rectangle", {
        width: 0, height: 0
    }, {
        width: ["Width", "", (val) => {
            curState.selected.drawable.width = val;
        }],
        height: ["Height", "", (val) => {
            curState.selected.drawable.height = val;
        }],
    }),

    drawPoly: new DRWI.InspectorSection("drawPoly", "Draw Polygon", {
        maxVertex: 3, count: 0
    }, {maxVertex: ["Max Vertex"], count: ["Count"]}),

    bucket: new DRWI.InspectorSection("bucket", "Bucket", {
        col: "#000000"
    }, {col: ["Color", "color"]}),

    model: new DRWI.InspectorSection("model", "Model", {
        pos: {x: 0, y: 0}, dilate: 1
    }, {pos: {
        x: ["X", "", (x) => {
            curState.selected.drawable.position.x = +x;
        }], y: ["Y", "", (y) => {
            curState.selected.drawable.position.y = +y;
        }], _title: "Position"
    }, dilate: ["Dilatation", "", (val) => {
        curState.selected.drawable.dilatation = val;
    }]}),

    point: new DRWI.InspectorSection("point", "Point", {
        pos: {x: 0, y: 0}, col: "#000000"
    }, {pos: {
        x: ["X", "", (x) => {
            curState.selected.point.originalPoint.x = x;
        }], y: ["Y", "", (y) => {
            curState.selected.point.originalPoint.y = y;
        }], _title: "Position"
    }, col: ["Color", "color", (v) => {
        curState.selected.point.color.setHex(v)
    }]}),

    save: new DRWI.InspectorSection("save", "Save", {
        name: "drawing", buttonSave: () => {
            SaveLoadFile.save(draw, draw.gl);
        },
    }, {
        name: ["Name", "text"], buttonSave: ["Save", "submit", null]
    })
}
Object.keys(inspd).forEach((v) => { insp.register(inspd[v]); });

const toolbar = new DRWT.Toolbar(el("toolbar"), () => {
    if (toolbar.selected)
        curState.selected = undefined;
});
globalThis.tb = toolbar;
const toolitem = {
    line: new DRWT.ToolItem("line", { onToggle,
        begin(v) { return createModel("Line", v.position); },
        end, update(v, m) {updatePoint(m.p2, v)}
    }),
    square: new DRWT.ToolItem("square", { 
        onToggle,
        begin(v) { return createModel("Square", v.position); },
        end, 
        update(v, m) {updatePoint(m.br, v)}
    }),
    rect: new DRWT.ToolItem("rect", { onToggle,
        begin(v) { return createModel("Rectangle", v.position); },
        end, update(v, m) {updatePoint(m.br, v)}
    }),
    polygon: new DRWT.ToolItem("polygon", {
        onToggle(v) { onToggle(v); insp.toggle("drawPoly"); },
        begin(v) {
            inspd.drawPoly.setState({count: 1});
            return createModel("Polygon", v.position);
        },
        /** @param {DrawEvent} e */
        end(e) {
            const poly = e.drawable;
            const count = inspd.drawPoly.state.count + 1;
            inspd.drawPoly.setState({count})
            if (count >= inspd.drawPoly.state.maxVertex) {
                curState.selected = undefined; // finally end
                toolbar.isUsing = false;
            } else
                poly.add(poly.points[count-1].clone()); // keep adding
        },
        update(v, m) {updatePoint(m.points[m.points.length-1], v)}
    }),
    bucket: new DRWT.ToolItem("bucket", {
        onToggle(v) { insp.toggle("bucket"); },
        begin(ev) {
            const p = ev.point;
            ev.center;          // magic
            const d = ev.drawable;
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
    save: new DRWT.ToolItem("save", {
        onToggle(v) { insp.toggle("save"); },
    }),
}
Object.keys(toolitem).forEach((v) => { toolbar.add(toolitem[v]); });

const draw = new DRW.Drawer("#glcanvas");
globalThis.draw = draw;
draw.clearColor = new DRW.Color(1,1,1,1);

const hitboxHover = new DRW.Hitbox(new DRW.Point(0, 0, DRW.Color.red()), 10);
const hitboxSelect = new DRW.Hitbox(new DRW.Point(0, 0, DRW.Color.green()), 20);
hitboxHover.visible = false;
hitboxSelect.visible = false;
draw.add(hitboxSelect);
draw.add(hitboxHover);


draw.addEventListener("mousemove",
/** @param {DrawEvent} e */
(e) => {
    if (toolbar.selected) {
        if (curState.selected)
            toolbar.currentTool.actions.update?.(e, curState.selected);
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
                inspd.model.setState({pos: {x: d.position.x, y: d.position.y}});
                hitboxSelect.point.add(delta);
            } else {
                const m = curState.selected.drawable;
                const tfPos = VectorTransform.reverse(
                    e.position, m.center, m.position, m.rotAngle, m.dilatation,
                );
                const op = p.originalPoint;
                op.copyPos(tfPos);
                inspd.point.setState({pos: {x: op.x, y: op.y}});
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
    if (toolbar.selected) {
        const model = toolbar.run(e, curState.selected);
        if (model) {
            curState.selected = model;
            draw.add(model);
        }
    } else {
        if (e.drawable) {
            curState.lastPos.copy(e.position);
            curState.selected = e;
            curState.dragged = true;
        } else {
            curState.selected = undefined;
        }
    }
});

draw.addEventListener("mouseup", (e) => {
    if (!curState.tool) {
        curState.dragged = false;
    }
});

function render() {
    draw.render();
    requestAnimationFrame(render);
}
requestAnimationFrame(render);