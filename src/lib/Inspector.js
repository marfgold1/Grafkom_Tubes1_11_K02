/**
 * @typedef {(value: object) => void} StateCb
 * @typedef {{[k: string]: {[k: string]: HTMLElement} | HTMLElement}} InspectorStateEl
 * @typedef {{[k: string]: {[k: string]: StateCb } | StateCb }} InspectorStateCb
 */

import { createEl } from "./core/Utils.js";

export class InspectorSection {
    /** @type {HTMLElement} Body section element */
    #bodyEl
    /** @type {HTMLElement} Items section element */
    #itemsEl
    /** @type {string} Inspector name */
    #name
    /** @type {object} Inspector state object */
    #state
    /** @type {InspectorStateEl} Inspector state elements */
    #stateEl
    /** @type {InspectorStateCb} Inspector state callback */
    #stateCb

    constructor(name, title, state, stateOptions) {
        this.#name = name;
        this.#state = state;
        this.#stateCb = {};
        this.#stateEl = {};
        this.#itemsEl = document.createElement("tbody");
        this.#bodyEl = createEl(`
        <div class="insp-sect" id="insp-${name}">
            <table class="insp-items">
                <thead>
                    <tr>
                        <th colspan="4">${title}</th>
                    </tr>
                </thead>
            </table>
        </div>
        `).item(0);
        this.#bodyEl.children.item(0).appendChild(this.#itemsEl);
        this.#createStateEl(state, stateOptions);
        this.toggle(false);
        // Prevent refresh on submit form
        // this.#bodyEl.submit((e) => e.preventDefault());
    }

    get bodyEl() {
        return this.#bodyEl;
    }

    get itemsEl() {
        return this.#itemsEl;
    }

    get state() {
        return this.#state;
    }

    get name() {
        return this.#name;
    }

    setState(state) {
        const curSt = this.#state;
        Object.keys(state).forEach(v => {
            if (!(v in curSt)) {
                console.error(
                    `setting new key ${v} in state ${this.#name} not allowed!`,
                    "Current state is", curSt, "and new state is", state
                );
                return; // drop if key not in state
            }
            const s = state[v];
            if (typeof s === "object") {
                Object.keys(s).forEach(vv => {
                    if (!(vv in curSt[v])) {
                        console.error(
                            `setting new key ${v}:${vv} in state ${this.#name} not allowed!`,
                            "Current state is", curSt, "and new state is", state
                        );
                        return; // drop if key not in state
                    }
                    this.#state[v][vv] = s[vv];
                    try { this.#stateEl[v][vv].value = s[vv]; } catch (e) {}
                    this.#stateCb[v][vv] && this.#stateCb[v][vv](s[vv]);
                });
            } else {
                this.#state[v] = s;
                try { this.#stateEl[v].value = s; } catch (e) {}
                this.#stateCb[v] && this.#stateCb[v](s);
            }
        });
    }

    setStateCallback(state, cb) {
        const curSt = this.#state;
    }
    
    toggle(visible) {
        if (visible) this.#bodyEl.style.display = "flex";
        else this.#bodyEl.style.display = "none";
    }

    #createStateEl(state, stateOpt) {
        const prefix = "insp-" + this.#name;
        Object.keys(state).forEach(v => {
            const s = state[v];
            if (typeof s === "object") {
                const body = createEl(`<tr><td colspan="4">${stateOpt[v]._title}</td></tr><tr></tr>`);
                const tr = body.item(1);
                this.#stateEl[v] = {};
                this.#stateCb[v] = {};
                Object.keys(s).forEach(vv => {
                    const [it, inp] = this.#createStateInputEl(`${prefix}-${v}-${vv}`, stateOpt[v][vv], s[vv], v, vv);
                    this.#stateEl[v][vv] = inp;
                    tr.append(it);
                });
                this.#itemsEl.append(body.item(0), body.item(1));
            } else {
                const body = document.createElement("tr");
                const [it, inp] = this.#createStateInputEl(`${prefix}-${v}`, stateOpt[v], s, null, v);
                body.append(it);
                this.#stateEl[v] = inp;
                this.#itemsEl.append(body);
            }
        })
    }

    #createStateInputEl(id, stateOpt, value, parent, child) {
        const buttonCb = value;
        if (stateOpt?.[1] === "submit")
            value = stateOpt[0];
        const it = createEl(`
        <td colspan="${parent?1:4}">
            <div class="insp-item-sect">
                ${stateOpt?.[1] === "submit" ? "":`<label for="${id}">${stateOpt?.[0]}</label>`}
                <input type="${stateOpt?.[1] || "number"}" id="${id}" value="${value}" />
            </div>
        </td>
        `).item(0);
        const getValue = (e) => {
            const value = e.target.value;
            if ((stateOpt[1] || "number") === "number") {
                return parseFloat(value) || 0;
            } else {
                return value;
            }
        }
        const inp = it.children.item(0).children.item(1);
        if (stateOpt[1] === "submit") {
            it.children.item(0).children.item(0).addEventListener("click", (e) => {
                buttonCb?.(e);
            })
        } else if (stateOpt[1] === "file") {
            inp.addEventListener("change", (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    let data = { [child]: e.target.result };
                    if (parent) data = { [parent]: data };
                    this.setState(data);
                }
                reader.readAsText(file);
            })
            this.#stateCb[child] = stateOpt?.[2];
        } else if (parent) {
            inp.addEventListener("input", (e) => {
                this.setState({ [parent]: { [child]: getValue(e) } });
            })
            this.#stateCb[parent][child] = stateOpt?.[2];
        } else {
            inp.addEventListener("input", (e) => {
                this.setState({ [child]: getValue(e) });
            })
            this.#stateCb[child] = stateOpt?.[2];
        }
        return [it, inp];
    }
}

export class Inspector {
    /** @type {HTMLElement} Main element */
    #mainEl
    /** @type {Object<string, InspectorSection>} Inspector sections */
    #sections
    /** @type {Set<string>} Current sections */
    #currentSect

    constructor(mainEl) {
        this.#mainEl = mainEl;
        this.#sections = {};
        this.#currentSect = new Set();
    }

    register(inspector) {
        this.#sections[inspector.name] = inspector;
        this.#mainEl.appendChild(inspector.bodyEl);
    }

    toggle(inspName) {
        if (this.#currentSect.has(inspName)) this.hide(inspName);
        else this.show(inspName);
    }

    show(...inspName) {
        if (inspName.length > 1) {
            inspName.forEach(v => this.show(v));
            return;
        }
        if (inspName.length === 0) return;
        inspName = inspName[0];
        if (this.#currentSect.has(inspName)) return;
        this.#currentSect.add(inspName);
        this.#sections[inspName].toggle(true);
    }

    hide(...inspName) {
        if (inspName.length > 1) {
            inspName.forEach(v => this.hide(v));
            return;
        }
        if (inspName.length === 0) return;
        inspName = inspName[0]
        if (!this.#currentSect.has(inspName)) return;
        this.#currentSect.delete(inspName);
        this.#sections[inspName].toggle(false);
    }
}
