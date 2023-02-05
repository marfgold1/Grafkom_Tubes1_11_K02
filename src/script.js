main();

function main() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#glcanvas');
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl');

    // Error alert
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    var shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");

    // Collect all the info needed to use the shader program.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'vPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'vColor')
        }
    };

    // and so on
}