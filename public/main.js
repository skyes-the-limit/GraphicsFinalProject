const up = [0, 1, 0]
let target = [0, 0, 0]
let lookAt = false
let cameraMoveMouse = true;
let fieldOfViewRadians = m4.degToRad(60)

let gl;
let attributeCoords;
let uniformMatrix;
let uniformColor;
let bufferCoords;
let attributeNormals;
let uniformWorldViewProjection;
let uniformWorldInverseTranspose;
let uniformReverseLightDirectionLocation;
let normalBuffer;

let textSubmitted = false;

const updateTranslation = (event, axis) => {
    const value = event.target.value
    shapes[selectedShapeIndex].translation[axis] = value
    render()
}

const updateScale = (event, axis) => {
    const value = event.target.value
    shapes[selectedShapeIndex].scale[axis] = value
    render()
}

const updateRotation = (event, axis) => {
    shapes[selectedShapeIndex].rotation[axis] = event.target.value
    render();
}

const updateColor = (event, axis) => {
    const value = event.target.value
    shapes[selectedShapeIndex].color = webglUtils.hexToRgb(value);
    render()
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function onTextChange() {
    var key = window.event.keyCode;

    // If the user has pressed enter for the first time
    if (key === 13 & !textSubmitted) {
        textSubmitted = true;

        let canvas = document.getElementById("canvas");
        let input = document.getElementById("input");
        let textarea = document.getElementById("textArea");

        canvas.style["opacity"] = 1;
        input.style["opacity"] = 0.25;
        input.style["user-select"] = "none";
        input.style["-moz-user-select"] = "none";
        input.style["-khtml-user-select"] = "none";
        input.style["-webkit-user-select"] = "none";
        input.style["-o-user-select"] = "none";
        textarea.setAttribute("disabled", "true");


        // Bind motion when text is entered
        document.addEventListener(
            'keydown',
            webglUtils.moveCameraKeyboard,
            false
        )

        document.addEventListener(
            'mousemove',
            webglUtils.moveCameraMouse,
            false
        )

        document.addEventListener(
            'click',
            (event) => {cameraMoveMouse = !cameraMoveMouse;
            },
            false
        )


    }
}

const init = () => {
    // get a reference to the canvas and WebGL context
    const canvas = document.querySelector("#canvas");

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();




    gl = canvas.getContext("webgl");

    // create and use a GLSL program
    const program = webglUtils.createProgramFromScripts(gl, "#vertex-shader-3d",
        "#fragment-shader-3d");
    gl.useProgram(program);

    // get reference to GLSL attributes and uniforms
    attributeCoords = gl.getAttribLocation(program, "a_coords");
    uniformMatrix = gl.getUniformLocation(program, "u_matrix");
    const uniformResolution = gl.getUniformLocation(program, "u_resolution");
    uniformColor = gl.getUniformLocation(program, "u_color");

    // Lighting from GLSL
    attributeNormals = gl.getAttribLocation(program, "a_normals");
    gl.enableVertexAttribArray(attributeNormals);
    normalBuffer = gl.createBuffer();

    uniformWorldViewProjection
        = gl.getUniformLocation(program, "u_worldViewProjection");
    uniformWorldInverseTranspose
        = gl.getUniformLocation(program, "u_worldInverseTranspose");
    uniformReverseLightDirectionLocation
        = gl.getUniformLocation(program, "u_reverseLightDirection");

    // initialize coordinate attribute to send each vertex to GLSL program
    gl.enableVertexAttribArray(attributeCoords);

    // initialize coordinate buffer to send array of vertices to GPU
    bufferCoords = gl.createBuffer();

    // configure canvas resolution and clear the canvas
    gl.uniform2f(uniformResolution, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const updateFieldOfView = (event) => {
    fieldOfViewRadians = m4.degToRad(event.target.value);
    render();
}

const computeModelViewMatrix = (shape, viewProjectionMatrix) => {
    M = m4.translate(viewProjectionMatrix,
        shape.translation.x,
        shape.translation.y,
        shape.translation.z)
    M = m4.xRotate(M, m4.degToRad(shape.rotation.x))
    M = m4.yRotate(M, m4.degToRad(shape.rotation.y))
    M = m4.zRotate(M, m4.degToRad(shape.rotation.z))
    M = m4.scale(M, shape.scale.x, shape.scale.y, shape.scale.z)
    return M
}

const render = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    gl.vertexAttribPointer(
        attributeCoords,
        3,
        gl.FLOAT,
        false,
        0,
        0);

    // Normals
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(attributeNormals, 3, gl.FLOAT, false, 0, 0);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    let cameraMatrix = m4.identity()

    if (lookAt) {
        cameraMatrix = m4.translate(
            cameraMatrix,
            camera.translation.x,
            camera.translation.y,
            camera.translation.z)
        const cameraPosition = [
            cameraMatrix[12],
            cameraMatrix[13],
            cameraMatrix[14]]
        cameraMatrix = m4.lookAt(
            cameraPosition,
            target,
            up)

    } else {
        cameraMatrix = m4.zRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.z));
        cameraMatrix = m4.xRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.x));
        cameraMatrix = m4.yRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.y));
        cameraMatrix = m4.translate(
            cameraMatrix,
            camera.translation.x,
            camera.translation.y,
            camera.translation.z);
    }
    cameraMatrix = m4.inverse(cameraMatrix)
    const projectionMatrix = m4.perspective(
        fieldOfViewRadians, aspect, zNear, zFar);
    const viewProjectionMatrix = m4.multiply(
        projectionMatrix, cameraMatrix);


    let worldMatrix = m4.identity()
    const worldViewProjectionMatrix
        = m4.multiply(viewProjectionMatrix, worldMatrix);
    const worldInverseMatrix
        = m4.inverse(worldMatrix);
    const worldInverseTransposeMatrix
        = m4.transpose(worldInverseMatrix);

    gl.uniformMatrix4fv(uniformWorldViewProjection, false,
        worldViewProjectionMatrix);
    gl.uniformMatrix4fv(uniformWorldInverseTranspose, false,
        worldInverseTransposeMatrix);

    gl.uniform3fv(uniformReverseLightDirectionLocation,
        m4.normalize(lightSource));

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);

    shapes.forEach((shape, index) => {
        gl.uniform4f(uniformColor,
            shape.color.red,
            shape.color.green,
            shape.color.blue, 1);

        // compute transformation matrix
        let matrix = computeModelViewMatrix(shape, worldViewProjectionMatrix)

        // apply transformation matrix.
        gl.uniformMatrix4fv(uniformWorldViewProjection, false, matrix);

        const $shapeList = $("#object-list")
        $shapeList.empty()
        shapes.forEach((shape, index) => {

            if (shape.type === RECTANGLE) {
                webglUtils.renderRectangle(shape)
            } else if (shape.type === TRIANGLE) {
                webglUtils.renderTriangle(shape)
            } else if (shape.type === CIRCLE) {
                webglUtils.renderCircle(shape);
            } else if (shape.type == STAR) {
                webglUtils.renderStar(shape);
            } else if (shape.type == CUBE) {
                webglUtils.renderCubeLighting(shape);
            }
        })
    })
}



