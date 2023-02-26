import Drawer from "./Drawer.js";
import { drawableFromJSON } from "./drawables/Drawables.js";

/**
 * This class is used to save drawings to a file
 */
export default class SaveLoadFile {
    static download = document.createElement("a");
    /**
     * @param {Drawer} drawer Requires a canvas
     * @param {string} fileName Name of file to save
     */
    static save(drawer, fileName) {
        const drawables = drawer.drawables.reduce((res, d) => {
            if (d.allowSave) res.push(d.toJSON());
            return res;
        }, []);
        const data = JSON.stringify(drawables);
        const file = new Blob([data], { type: "application/json" });
        const a = this.download;
        a.href = URL.createObjectURL(file);
        a.download = fileName + ".json";
        a.click();
    }

    /**
     * @param {Drawer} drawer Requires a canvas
     */
    static load(drawer, json) {
        let data = JSON.parse(json);
        data = data.map(j => {
            return drawableFromJSON(j);
        })
        data.forEach((d) => drawer.add(d));
    }
}