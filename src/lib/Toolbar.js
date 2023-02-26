import { createEl } from "./core/Utils.js";

export class ToolItem {
    /** @type {string} Tool name */
    #name;
    /** @type {HTMLElement} Body element of tool */
    #bodyEl;
    /** @type {Object<string, Function>} Tool actions */
    #actions;

    /**
     * Create new tool item.
     * @param {string} name Tool name.
     * @param {Object<string, Function>} actions Tool actions.
     */
    constructor(name, actions={}) {
        this.#name = name;
        this.#actions = actions;
        this.#bodyEl = createEl(`
        <div class="tool" id="tool-${name}">
            <img src="./icons/${name}.png" width="24" height="24" alt="${name} tool" />
        </div>
        `).item(0);
    }

    get bodyEl() {
        return this.#bodyEl;
    }

    get name() {
        return this.#name;
    }

    get actions() {
        return this.#actions;
    }

    get isActive() {
        return this.#bodyEl.classList.contains("toggled");
    }

    toggle() {
        const isActive = this.isActive;
        this.#bodyEl.classList.toggle("toggled", !isActive);
        this.#actions.onToggle?.(!isActive);
    }
}

export class Toolbar {
    /** @type {string} Current tool name */
    selected;
    /** @type {HTMLElement} Toolbar body element */
    #mainEl;
    /** @type {Object<string, ToolItem>} Toolbar items */
    #items = [];
    /** @type {boolean} Check if toolbar is in use and can't changed. */
    isUsing = false;
    /** @type {(item: string) => void} Callback on toggle */
    #onToggle;

    constructor(mainEl, onToggle=undefined) {
        this.#mainEl = mainEl;
        this.#items = {};
        this.#onToggle = onToggle;
    }

    get currentTool() {
        return this.#items[this.selected];
    }

    /**
     * Add tool item to toolbar.
     * @param {ToolItem} item Item to add in toolbar.
     */
    add(item) {
        this.#items[item.name] = item;
        this.#mainEl.appendChild(item.bodyEl);
        item.bodyEl.addEventListener("click", () => this.toggle(item.name));
    }

    /**
     * Toggle item to use.
     * @param {string} item Item to toggle.
     */
    toggle(item) {
        if (this.isUsing) {
            alert("You can't change tool while using it!");
            return;
        }
        if (this.selected) this.currentTool.toggle();
        if (this.selected === item) this.selected = undefined;
        else {
            this.selected = item;
            this.currentTool.toggle();
        }
        this.#onToggle?.(item);
    }

    run(ev, isEnd) {
        if (isEnd) { // ongoing selected 
            this.currentTool.actions.end?.(ev);
        } else {
            const result = this.currentTool.actions.begin?.(ev);
            return result;
        }
    }
}

export default {
    Toolbar,
    ToolItem,
}

globalThis.DRWT = {
    Toolbar,
    ToolItem,
}