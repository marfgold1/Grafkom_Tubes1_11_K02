import Color from "./core/Color.js";
import DrawEvent from "./core/DrawEvent.js";
import Drawable from "./core/Drawable.js";
import EventDispatcher from "./core/EventDispatcher.js";
import Point from "./core/Point.js";
import Hitbox from "./drawables/Hitbox.js";
import DefaultVertShader from "./shaders/default.vert.js";
import DefaultFragShader from "./shaders/default.frag.js";
import VectorTransform from "./core/VectorTransform.js";

export default class Drawer extends EventDispatcher {
    /** @type {WebGLRenderingContext} WebGL instance */
    #gl
    /** @type {HTMLCanvasElement} Canvas for drawer */
    #canvas
    /** @type {Drawable[]} Object to render */
    #drawables = []
    /** @type {WebGLProgram} Program */
    #program
    /** @type {{[attrName: string]: {buffer: WebGLBuffer, location: number, shaderName: string}}} Attributes */
    #attributes = {}
    /** @type {{[uniformName: string]: {location: number, shaderName: string, setter: (data: number | number[]) => void}}} Uniforms */
    #uniforms = {}
    /** @type {Color} Clear color of the canvas */
    clearColor = new Color(0, 0, 0, 1);

    /**
     * Creates an instance of Drawer.
     * @param {(String|HTMLCanvasElement)} [canvas=null] Canvas element or its ID
     * @memberof WebGL
     */
    constructor(canvas=null, vertexShader=DefaultVertShader, fragmentShader=DefaultFragShader) {
        super();
        if (typeof canvas === 'string' || canvas instanceof String) {
            canvas = document.querySelector(canvas);
        }
        this.#canvas = canvas;
        this.#gl = this.#canvas.getContext('webgl');
        if (!this.#gl) {
            alert('Unable to initialize WebGL.');
        }
        this.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
        this.#program = this.#createProgram(
            this.#createShader(vertexShader, this.#gl.VERTEX_SHADER),
            this.#createShader(fragmentShader, this.#gl.FRAGMENT_SHADER),    
        );
        this.createAttribute('position');
        this.createAttribute('color');
        this.createUniform('pointSize', '1f');
        this.createUniform('resolution', '2fv');
        this.#adjustCanvas();
        this.#setEvent();
    }

    get gl() {
        return this.#gl;
    }
    
    get drawables() {
        return this.#drawables;
    }

    add(drawable) {
        if (drawable instanceof Drawable)
            this.#drawables.push(drawable);
        else
            console.error("Invalid drawable", drawable);
    }

    /**
     * Set the viewport of renderer.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @memberof WebGL
     */
    setViewport(x, y, width, height) {
        this.#gl.viewport(x, y, width, height);
    }

    /**
     * Get drawable point from position.
     * @param {{x: number, y: number}} position Position to check for.
     * @param {number} tolerance Tolerance in pixel.
     * @returns {{drawable?: Drawable, point?: VectorTransform}}
     */
    getObjectAt(position, tolerance=10) {
        const drawables = this.#drawables;
        let point = null, drawable = null;
        for (let i = 0; i < drawables.length; i++) {
            let d = drawables[i];
            if (!d.visible || d instanceof Hitbox) continue;
            point = d.getPointOnPosition(position, tolerance);
            if (point) { drawable = d; break; }
        }
        return {
            drawable,
            point,
        }
    }

    /**
     * Get drawable from position.
     * @param {{x: number, y: number}} position Position to check for.
     * @param {number} tolerance Tolerance in pixel.
     * @returns {{drawable?: Drawable, center?: VectorTransform}}
     */
    getDrawableAt(position, tolerance=10) {
        const drawables = this.#drawables;
        let center = null, drawable = null;
        for (let i = 0; i < drawables.length; i++) {
            let d = drawables[i];
            if (!d.visible || d instanceof Hitbox) continue;
            center = d.getCenterIfIn(position, tolerance);
            if (center) { drawable = d; break; }
        }
        return {
            drawable,
            center,
        }
    }

    render() {
        const gl = this.#gl;
        gl.clearColor(...this.clearColor.toArray());
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(this.#program);
        this.#draw();
    }

    createAttribute(attrName) {
        const gl = this.#gl;
        const buf = gl.createBuffer();
        const shaderName = "a_" + attrName;
        this.#attributes[attrName] = {
            buffer: buf,
            location: gl.getAttribLocation(this.#program, shaderName),
            shaderName,
        }
    }

    createUniform(uniformName, type) {
        const gl = this.#gl;
        const shaderName = "u_" + uniformName;
        const loc = gl.getUniformLocation(this.#program, shaderName);
        this.#uniforms[uniformName] = {
            setter: (v) => {
                gl["uniform" + type](loc, v);
            },
            shaderName,
        }
    }

    setAttribute(attrName, data, size, type=WebGLRenderingContext.FLOAT, normalized=false, stride=0, offset=0) {
        const gl = this.#gl;
        const attr = this.#attributes[attrName];
        gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attr.location, size, type, normalized, stride, offset);
        gl.enableVertexAttribArray(attr.location);
    }

    setUniform(uniformName, data) {
        const gl = this.#gl;
        const uniform = this.#uniforms[uniformName];
        uniform.setter(data);
    }

    #setEvent() {
        const canvas = this.#canvas;
        const events = ["mousemove", "mousedown", "mouseup"];
        for (let type of events) {
            canvas.addEventListener(type, (ev) => {
                if (!this.hasEventListenerType(type)) return;
                this.dispatchEvent(
                    new DrawEvent(type, ev, this, 10)
                );
            });
        }
        window.addEventListener("resize", (_) => {
            this.#adjustCanvas();
        });
    }

    #adjustCanvas() {
        const canvas = this.#canvas;
        const dw = canvas.clientWidth;
        const dh = canvas.clientHeight;
        if (canvas.width !== dw || canvas.height !== dh) {
            canvas.width = dw;
            canvas.height = dh;
            this.setViewport(0, 0, dw, dh);
        }
    }

    /**
     * Create a new shader from source.
     *
     * @param {string} source String code of the shader.
     * @param {number} type Type of the shader.
     * @return {WebGLShader?} 
     * @memberof WebGL
     */
    #createShader(source, type) {
        let gl = this.#gl;
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            return shader;
        
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    /**
     * Create a new program from two shaders.
     *
     * @param {WebGLShader} vertexShader The vertex shader.
     * @param {WebGLShader} fragmentShader The fragment shader.
     * @return {ProgramInfo?}
     * @memberof WebGL
     */
    #createProgram(vertexShader, fragmentShader) {
        let gl = this.#gl;
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS))
            return program;
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    #draw() {
        const gl = this.#gl;
        const drawables = this.#drawables;
        this.setUniform("resolution", [gl.canvas.clientWidth, gl.canvas.clientHeight]);
        for (var i = 0; i < drawables.length; i++) {
            const obj = drawables[i];
            if (!obj.visible) continue;
            obj.needsUpdate = true;
            obj.onSetVariables(this);
            obj.onDraw(gl);
        }
    }
}
