var objectList = [];
var maxNumVertices = 200;
var positionBuffer;
var colorBuffer;

var objectSelectElement = document.getElementById('object-select');

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

    gl.useProgram(programInfo.program);

    // Make buffers to hold everything
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    // For testing purpose
    initObject();
    initObject2();

    function render() {
        // Reset canvas
        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        drawObject(gl);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);      // Buat animation nanti
}

/* --- Draw Object --- */
function drawObject(gl) {
    var vc = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    for (var i = 0; i < objectList.length; i++) {
        const object = objectList[i];

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*vc, new Float32Array(object.positions));
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*vc, new Float32Array(object.colors));

        if (object.type === "square") {
            gl.drawArrays(gl.TRIANGLE_FAN, vc, 4);
        }

        vc += object.positions.length;
    }
}

// For testing purpose
function initObject() {
    var positions = [
        -0.5, -0.5, 
        0.5, -0.5, 
        0.5, 0.5, 
        -0.5, 0.5
    ];

    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0
    ];

    var object = {
        type: "square",
        positions: positions,
        colors: colors
    };

    objectList.push(object);
}

function initObject2() {
    var positions = [
        0.7, 0.7, 
        0.7, 0.8, 
        0.8, 0.8,
        0.8, 0.7 
    ];

    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0
    ];

    var object = {
        type: "square",
        positions: positions,
        colors: colors
    };

    objectList.push(object);
}

/* --- Transformations --- */
function translate(obj, x, y) {
    positions = [];
    for (let i = 0; i < obj.positions.length; i+=2) {
        obj.positions[i] += +x;
        obj.positions[i+1] += +y;
    }
}

function dilate(obj) {
    
}

function rotate(obj) {
    
}