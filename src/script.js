window.onload = function init() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#glcanvas');
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl');

    // Error alert
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    var shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");

    // Collect all the info needed to use the shader program.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'vPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'vColor')
        }
    };

    const objectInfo = initObject(gl);

    gl.useProgram(programInfo.program);

    // Bind buffers to send to GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, objectInfo.positions);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, objectInfo.colors);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    function render() {
        // Reset canvas
        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        drawObject(gl, programInfo, objectInfo);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);      // Buat animation nanti
}

/* --- Draw Object --- */
function drawObject(gl, programInfo, objectInfo) {
    if (objectInfo.type === "square") {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}

/* --- Save and Load --- */
function initObject(gl) {
    // var positions = [
    //     -0.5, -0.5, 
    //     0.5, -0.5, 
    //     0.5, 0.5, 
    //     -0.5, 0.5
    // ];

    // var colors = [
    //     1.0, 0.0, 0.0, 1.0,
    //     0.0, 1.0, 0.0, 1.0,
    //     0.0, 0.0, 1.0, 1.0,
    //     1.0, 0.0, 1.0, 1.0
    // ];
    
    var positions = [];
    var colors = [];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    return {
        type: "square",
        positions: positionBuffer,
        colors: colorBuffer,
    };
}


/* --- Transformations --- */
function translate(obj) {

}

function dilate(obj) {
    
}

function rotate(obj) {
    
}