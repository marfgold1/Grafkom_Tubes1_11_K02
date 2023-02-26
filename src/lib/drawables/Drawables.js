import Line from "./Line.js";
import Square from "./Square.js";
import Hitbox from "./Hitbox.js";
import Polygon from "./Polygon.js";
import Rectangle from "./Rectangle.js";

export const drawableFromJSON = (json) => {
    const {type, ...rest} = json;
    switch (type) {
        case "line":
            return Line.fromJSON(json);
        case "square":
            return Square.fromJSON(json);
        case "hitbox":
            return Hitbox.fromJSON(json);
        case "polygon":
            return Polygon.fromJSON(json);
        case "rectangle":
            return Rectangle.fromJSON(json);
        default:
            throw new Error("Unknown drawable type: " + type);
    }
};

export default {
    Line,
    Square,
    Hitbox,
    Polygon,
    Rectangle,
}
