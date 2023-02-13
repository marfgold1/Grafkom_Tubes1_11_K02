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

    objectList.push(new Square(new Point(-0.5, 0.5), new Point(0.5, -0.5)));

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
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*vc, new Float32Array(object.getPositionArray()));
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*vc, new Float32Array(object.getColorArray()));

        if (object.getType() === "square") {
            gl.drawArrays(gl.TRIANGLE_FAN, vc, 4);
        }

        vc += object.getPoints().length * 2;
    }
}

/* --- Transformations --- */
function translate(obj, x, y) {
    var points = obj.getPoints();
    for (let i = 0; i < points.length; i++) {
        points[i].setX(points[i].getX() + x);
        points[i].setY(points[i].getY() + y);
    }
}

function dilate(obj) {
    
}

function rotate(obj) {
    
}