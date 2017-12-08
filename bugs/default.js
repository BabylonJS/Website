var canvas = document.getElementById("renderCanvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// Init WebGL
var gl = canvas.getContext("webgl2");

// Function to extract shader code from DOM
function getShader(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

// Compile shaders into a program
var shaderProgram;
var fragmentShader = getShader("shader-fs");
var vertexShader = getShader("shader-vs");

shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
}

gl.useProgram(shaderProgram);

// Attributes
var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
gl.enableVertexAttribArray(vertexPositionAttribute);

// Shaders uniforms (variables)
var pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
var mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
var colorUniform = gl.getUniformLocation(shaderProgram, "uColor");

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Mesh's buffers
var triangleVertexPositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
var vertices = [
    0.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// UBOdefa
var bufferData0 = new Float32Array([1, 0, 0, 0]);
var ubo0 = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo0);
gl.bufferData(gl.UNIFORM_BUFFER, bufferData0, gl.STATIC_DRAW);
gl.bindBuffer(gl.UNIFORM_BUFFER, null);

var bufferData1 = new Float32Array([0, 1, 0, 0]);
var ubo1 = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo1);
gl.bufferData(gl.UNIFORM_BUFFER, bufferData1, gl.STATIC_DRAW);
gl.bindBuffer(gl.UNIFORM_BUFFER, null);

function renderTriangle(offset, ubo) {
    mat4.perspective(45, canvas.width / canvas.height, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [offset, 0.0, -7.0]);

    gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);

    // bind UBO
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Render
function renderLoop() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    renderTriangle(-2, ubo0);
    renderTriangle(2, ubo1);

    // Register for the next frame
    requestAnimationFrame(renderLoop);
}

// Let's go!
requestAnimationFrame(renderLoop);
