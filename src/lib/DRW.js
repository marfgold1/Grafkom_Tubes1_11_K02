import Drawer from "./Drawer.js";
import Drawables from "./drawables/Drawables.js";
import Core from "./core/Core.js";
import { getClipPosition } from "./core/Utils.js";

globalThis.DRW = {
    Drawer,
    ...Drawables,
    ...Core,
    getClipPosition,
}
