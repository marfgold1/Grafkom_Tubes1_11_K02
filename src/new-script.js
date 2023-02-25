const el = (v) => document.getElementById(v);
const uiElems = {
    tool: {
        line: el("tool-line"),
        square: el("tool-square"),
        rect: el("tool-rect"),
        polygon: el("tool-polygon"),
        bucket: el("tool-bucket"),
    },
    inspector: {
        helper: {
            body: el("insp-helper"),
        },
        drawPoly: {
            body: el("insp-draw-poly"),
            maxVertex: el("insp-draw-poly-max"),
            count: el("insp-draw-poly-count"),
        },
        bucket: {
            body: el("insp-bucket"),
            col: {
                r: el("insp-bucket-col-r"),
                g: el("insp-bucket-col-g"),
                b: el("insp-bucket-col-b"),
                a: el("insp-bucket-col-a"),
            },
        },
        model: {
            body: el("insp-model"),
            pos: {
                x: el("insp-model-pos-x"),
                y: el("insp-model-pos-y"),
            },
            rot: el("insp-model-rot"),
            dilate: el("insp-model-dilate"),
        },
        point: {
            body: el("insp-point"),
            pos: {
                x: el("insp-point-pos-x"),
                y: el("insp-point-pos-y"),
            },
            col: {
                r: el("insp-point-col-r"),
                g: el("insp-point-col-g"),
                b: el("insp-point-col-b"),
                a: el("insp-point-col-a"),
            }
        }
    }
};

const curState = {
    tool: "",
    selected: undefined,
    inspector: {},
}

const useState = {
    drawPoly: {
        maxVertex: 3, count: 0
    },
    bucket: {
        col: {r: 0, g: 0, b: 0, a: 1}
    },
    model: {
        pos: {x: 0, y: 0}, rot: 0, dilate: 1
    },
    point: {
        pos: {x: 0, y: 0}, col: {r: 0, g: 0, b: 0, a: 1}
    },
}

const stateCbTemp = {
    obj: (key, v) => {

    }
}

const stateCb = {
    drawPoly: {
        maxVertex: (v) => {},
        count: (v) => {},
    },
    bucket: {
        col: {
            r: (v) => {},
            g: (v) => {},
            b: (v) => {},
            a: (v) => {},
        },
    },
    model: {
        pos: {
            x: (v) => {},
            y: (v) => {},
        },
        rot: (v) => {},
        dilate: (v) => {},
    },
    point: {
        pos: {
            x: (v) => {},
            y: (v) => {},
        },
        col: {
            r: (v) => {},
            g: (v) => {},
            b: (v) => {},
            a: (v) => {},
        },
    },
}

// usage: setState(uiElemInsp, useState, {maxVertex: 0, count: 0}, "drawPoly")
function setState(uiObject, stateObject, stateCbObj, value, stateName) {
    const state = stateObject[stateName];
    const ui = uiObject[stateName];
    const stCb = stateCbObj[stateName];
    Object.keys(value).forEach((k) => {
        if (k in state) {
            const curVal = value[k];
            const val = state[k];
            if (val instanceof Object) setState(ui, state, stCb, curVal, k);
            else {
                state[k] = curVal;
                ui[k].value = curVal;
                stCb[k](curVal);
            }
        } else {
            console.error(`Key ${k} not found in state ${stateName}`);
        }
    });
}

const uiElemInsp = uiElems.inspector;

function hideEl(el) {
    el.style.display = "none";
}

function showEl(el) {
    el.style.display = "flex";
}

function setInspector(insp, toggle=true) {
    if (toggle) {
        hideEl(uiElemInsp.helper.body);
        curState.inspector[insp] = true;
        showEl(uiElemInsp[insp].body);
    } else {
        if (!(insp in curState.inspector)) return;
        delete curState.inspector[insp];
        hideEl(uiElemInsp[insp].body);
        if (Object.keys(curState.inspector).length == 0) {
            showEl(uiElemInsp.helper.body);
        }
    }
}
function setInspectorState(key, value) {
    setState(uiElemInsp, useState, stateCb, value, key);
}
function setUpdateInspector(uiObj) {
    function setUpdate(uiObj, parent) {
        Object.keys(uiObj).forEach((v) => {
            const ui = uiObj[v];
            if (!(ui instanceof HTMLElement)) setUpdate(ui, parent);
            else {
                if (v == "body") return;
                ui.addEventListener("input", (e) => {
                    setInspectorState(
                        parent,
                        {[v]: e.target.value},
                    );
                });
            }
        });
    }
    Object.keys(uiObj).forEach((v) => { setUpdate(uiObj[v], v); });
}
setUpdateInspector(uiElemInsp);


Object.keys(uiElemInsp).forEach((v) => {
    if (v == "helper") return;
    hideEl(uiElemInsp[v].body);
});
Object.keys(useState).forEach((v) => {
    setInspectorState(v, useState[v]);
});

const tool = {
    line: {
        create: (v) => {
            const point = new DRW.Point(v.position.x, v.position.y);
            return new DRW.Line(point, point.clone());
        },
        end: () => {curState.selected = undefined;},
        update: (v, m) => {m.p2.set(v.position.x, v.position.y)},
    },
    square: {
        create: (v) => {
            const point = new DRW.Point(v.position.x, v.position.y);
            return new DRW.Square(point, point.clone());
        },
        end: () => {curState.selected = undefined;},
        update: (v, m) => {
            m.br.set(v.position.x, v.position.y);
            m.update();
        }
    },
    rect: {
        create: (v) => {
            const point = new DRW.Point(v.position.x, v.position.y);
            return new DRW.Rectangle(point, point.clone());
        },
        end: () => {curState.selected = undefined;},
        update: (v, m) => {
            m.br.set(v.position.x, v.position.y);
            m.update();
        }
    },
    polygon: {
        create: (v) => {
            const point = new DRW.Point(v.position.x, v.position.y);
            const polygon = new DRW.Polygon(point, point.clone());
            setInspectorState("drawPoly", {count: 1});
            return polygon;
        },
        end: (e) => {
            const poly = e.drawable;
            const count = useState.drawPoly.count;
            setInspectorState("drawPoly", {count: count + 1});
            if (count+1 >= useState.drawPoly.maxVertex)
                curState.selected = undefined;
            else
                poly.points.push(poly.points[count].clone());
        },
        update: (v, m) => {
            m.points[useState.drawPoly.count].copyPos(v.position);
        }
    },
    bucket: {
        create: (ev) => {
            const p = ev.point;
            if (p) {
                p.color.set();
            }
        },
    }
}

const draw = new DRW.Drawer("#glcanvas");
draw.clearColor = DRW.Color.white();

const hitboxHover = new DRW.Hitbox(new DRW.Point(0, 0, DRW.Color.red()), 10);
const hitboxSelect = new DRW.Hitbox(new DRW.Point(0, 0, DRW.Color.green()), 20);
hitboxHover.visible = false;
hitboxSelect.visible = false;
draw.add(hitboxSelect);
draw.add(hitboxHover);

draw.addEventListener("mousemove", (e) => {
    if (curState.tool) {
        if (curState.selected) {
            tool[curState.tool].update(e, curState.selected);
        }
    } else {
        if (curState.selected) { // move selected item
            const p = curState.selected.point;
            p.copyPos(e.position);
            hitboxSelect.point.copyPos(p);
        }
        if (e.point) {
            const p = e.point;
            hitboxHover.visible = true;
            hitboxHover.point.copyPos(p);
        } else {
            hitboxHover.visible = false;
        }
    }
});

draw.addEventListener("mousedown", (e) => {
    if (curState.tool) {
        if (curState.selected) { // ongoing selected 
            tool[curState.tool].end(e);
        } else {
            const model = tool[curState.tool].create(e);
            curState.selected = model;
            draw.add(model);
        }
    } else {
        if (e.drawable) {
            curState.selected = e;
            hitboxHover.visible = false;
            hitboxSelect.visible = true;
            hitboxSelect.point.copyPos(e.point);
        } else {
            curState.selected = undefined;
            hitboxSelect.visible = false;
        }
    }
});

draw.addEventListener("mouseup", (e) => {
    if (!curState.tool) {
        curState.selected = undefined;
    }
});

function selectTool(t, ti) {
    setInspector("drawPoly", ti == "polygon");
    setInspector("bucket", ti == "bucket");
    t && t.classList.add("toggled");
    curState.tool = ti;
}

for (let ti in uiElems.tool) {
    const t = uiElems.tool[ti];
    t.addEventListener("click", () => {
        if (curState.tool) { // there is tool selected
            if (!curState.selected) { // prevent if still building model
                uiElems.tool[curState.tool].classList.remove("toggled");
                if (curState.tool != ti) { // toggle to another tool
                    selectTool(t, ti);
                } else { // same tool, toggle off it
                    selectTool(null, "");
                }
            } else {
                alert("Finish building model first!");
            }
        } else { // no tool selected
            selectTool(t, ti);
        }
    });
}

function render() {
    draw.render();
    requestAnimationFrame(render);
}
requestAnimationFrame(render);