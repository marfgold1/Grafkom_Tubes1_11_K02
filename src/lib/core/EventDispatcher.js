export default class EventDispatcher {
    /** @type {Object<string, Array<(target: object, ...any)=>void>>} Listener */
    #listeners = {}

    addEventListener(type, listener) {
        const listeners = this.#listeners;
        if (!(type in listeners))
            listeners[type] = [];
        const listenersType = listeners[type];
        if (listenersType.indexOf(listener) === -1)
            listenersType.push(listener);
    }

    hasEventListenerType(type) {
        return type in this.#listeners;
    }

    hasEventListener(type, listener) {
        const listenersType = this.#listeners[type];
        return (
            listenersType !== undefined &&
            listenersType.indexOf(listener) !== -1
        );
    }

    removeEventListener(type, listener) {
        if (!(type in this.#listeners)) return;
        const listenersType = this.#listeners[type];
        const index = listenersType.indexOf(listener);
        if (index === -1)
            return;
        listenersType.splice(index, 1);
    }

    dispatchEvent(event) {
        if (!(event.type in this.#listeners)) return;
        const listenersType = this.#listeners[event.type];
        const listeners = listenersType.slice(0);
        for (let i = 0; i < listeners.length; i++) {
            listeners[i].call(this, event);
        }
    }
}