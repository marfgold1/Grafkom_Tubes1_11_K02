import { Inspector, InspectorSection } from "../lib/Inspector.js";
import SaveLoadFile from "../lib/SaveLoadFile.js";
import Point from "../lib/core/Point.js";
import { curState } from "./state.js";

export const inspector = new Inspector(document.getElementById("insp"));
export const inspectorItems = {
    animation: new InspectorSection("animation", "Animation", {
        speed: 1,
        buttonToggle: () => {
            curState.isAnimate = !curState.isAnimate;
        }
    }, {
        speed: ["Speed", ""],
        buttonToggle: ["Toggle Animation", "submit"]
    }),

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

    animation: new InspectorSection("animation", "Animation", {
        amplitude: 1,
        frequency: 1,
        scale_shift: 1,
        apply_animation: false,
    }, {
        amplitude: [
            "Amplitude", "", (val) => {
                // delete this then
                console.log("Amplitude: " + amplitude)
            }
        ],
        frequency: [
            "Frequency", "", (val) => {
                // delete this then
                console.log("Frequency (in times of PI): " + frequency)
            }
        ],
        scale_shift: [
            "Scale shift", "", (val) => {
                // delete this then
                console.log("Scale shift: " + scale_shift)
            }
        ],
        apply_animation: [
            "Apply Animation", "", (isApplied) => {
                // delete this then
                console.log("Applu Animation: " + apply_animation)
            }
        ]
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

    import: new InspectorSection("import", "Import", {
        file: "",
        buttonLoad: () => {
            SaveLoadFile.load(app.drawer, inspectorItems.import.state.file);
        },
    }, {
        file: ["File", "file"],
        buttonLoad: ["Load", "submit"],
    }, true),

    export: new InspectorSection("export", "Export", {
        name: "drawing",
        buttonSave: () => {
            SaveLoadFile.save(app.drawer, inspectorItems.export.state.name);
        },
    }, {
        name: ["File Name", "text"],
        buttonSave: ["Save", "submit"],
    }, true),

    addPoint: new InspectorSection("addPoint", "Add point", {
        pos: {x: 200, y: 80},
        buttonAdd: () => {
            curState.selected.drawable.add(new Point(inspectorItems.addPoint.state.pos.x, inspectorItems.addPoint.state.pos.y));
        }
    }, {
        pos: {
            x: ["X", ""],
            y: ["Y", ""],
            _title: "New Position"
        },
        buttonAdd: ["Add New Point", "submit"],
    }),

    deletePoint: new InspectorSection("deletePoint", "Delete point", {
        idx: 0,
        buttonDelete: () => {
            curState.selected.drawable.removeAt(inspectorItems.deletePoint.state.idx);
        }
    }, {
        idx: ["Index", ""],
        buttonDelete: ["Delete Point", "submit"]
    }),
}
Object.keys(inspectorItems).forEach((v) => { inspector.register(inspectorItems[v]); });
inspector.show("animation");

globalThis.app = {
    ...globalThis.app,
    inspector: {
        instance: inspector,
        sections: inspectorItems,
    },
};