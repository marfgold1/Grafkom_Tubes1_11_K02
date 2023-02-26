import { Inspector, InspectorSection } from "../lib/Inspector.js";
import SaveLoadFile from "../lib/SaveLoadFile.js";

import { curState } from "./state.js";

export const inspector = new Inspector(document.getElementById("insp"));
export const inspectorItems = {
    drawOpt: new InspectorSection("drawOpt", "Drawing Options", {
        col: "#000000",
    }, {
        col: ["Color", "color"]
    }),

    drawSquare: new InspectorSection("drawSquare", "Square", {
        side: 0
    }, {
        side: ["Side length", "", (val) => {
            curState.selected.drawable.side = val;
        }]
    }),

    drawRectangle: new InspectorSection("drawRectangle", "Rectangle", {
        width: 0,
        height: 0,
    }, {
        width: ["Width", "", (val) => {
            curState.selected.drawable.width = val;
        }],
        height: ["Height", "", (val) => {
            curState.selected.drawable.height = val;
        }],
    }),

    drawPoly: new InspectorSection("drawPoly", "Draw Polygon", {
        maxVertex: 3,
        count: 0,
    }, {
        maxVertex: ["Max Vertex"],
        count: ["Count"],
    }),

    bucket: new InspectorSection("bucket", "Bucket", {
        col: "#000000",
    }, {
        col: ["Color", "color"],
    }),

    model: new InspectorSection("model", "Model", {
        pos: {x: 0, y: 0},
        rot: 0,
        dilate: 1,
    }, {
        pos: {
            x: ["X", "", (x) => {
                curState.selected.drawable.position.x = +x;
            }],
            y: ["Y", "", (y) => {
                curState.selected.drawable.position.y = +y;
            }],
            _title: "Position"
        },
        rot: ["Rotation", "", (val) => {
            curState.selected.drawable.rotAngle = val;
        }],
        dilate: ["Dilatation", "", (val) => {
            curState.selected.drawable.dilatation = val;
        }]
    }),

    point: new InspectorSection("point", "Point", {
        pos: {x: 0, y: 0},
        col: "#000000"
    }, {
        pos: {
            x: ["X", "", (x) => {
                curState.selected.point.originalPoint.x = x;
            }], y: ["Y", "", (y) => {
                curState.selected.point.originalPoint.y = y;
            }], _title: "Position"
        },
        col: ["Color", "color", (v) => {
            curState.selected.point.color.setHex(v)
        }]
    }),

    save: new InspectorSection("save", "Save", {
        name: "drawing",
        buttonSave: () => {
            SaveLoadFile.save(app.drawer, app.drawer.gl);
        },
    }, {
        name: ["Name", "text"],
        buttonSave: ["Save", "submit", null],
    }, true)
}
Object.keys(inspectorItems).forEach((v) => { inspector.register(inspectorItems[v]); });

globalThis.app = {
    ...globalThis.app,
    inspector: {
        instance: inspector,
        sections: inspectorItems,
    },
};