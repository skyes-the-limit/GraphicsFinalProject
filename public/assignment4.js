const webglUtils = {
  hexToRgb: (hex) => {
    let parseRgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let rgb = {
      red: parseInt(parseRgb[1], 16),
      green: parseInt(parseRgb[2], 16),
      blue: parseInt(parseRgb[3], 16)
    }
    rgb.red /= 256
    rgb.green /= 256
    rgb.blue /= 256
    return rgb
  },
  createProgramFromScripts: (gl, vertexShaderElementId,
      fragmentShaderElementId) => {
    // Get the strings for our GLSL shaders
    const vertexShaderSource = document.querySelector(
        vertexShaderElementId).text;
    const fragmentShaderSource = document.querySelector(
        fragmentShaderElementId).text;

    // Create GLSL shaders, upload the GLSL source, compile the shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Link the two shaders into a program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
  },
  componentToHex: (c) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  },
  rgbToHex: (rgb) => {
    const redHex = webglUtils.componentToHex(rgb.red * 256)
    const greenHex = webglUtils.componentToHex(rgb.green * 256)
    const blueHex = webglUtils.componentToHex(rgb.blue * 256)
    return `#${redHex}${greenHex}${blueHex}`
  }
}

const origin = {x: 0, y: 0}
const sizeOne = {width: 1, height: 1}
const RED_HEX = "#FF0000"
const RED_RGB = webglUtils.hexToRgb(RED_HEX)
const BLUE_HEX = "#0000FF"
const BLUE_RGB = webglUtils.hexToRgb(BLUE_HEX)
const GREEN_HEX = "#00FF00";
const GREEN_RGB = webglUtils.hexToRgb(GREEN_HEX);
const PURPLE_HEX = "#b000ff"
const PURPLE_RGB = webglUtils.hexToRgb(PURPLE_HEX);

const RECTANGLE = "RECTANGLE";
const TRIANGLE = "TRIANGLE";
const CIRCLE = "CIRCLE";
const STAR = "STAR";
let shapes = [
  {
    type: RECTANGLE,
    color: BLUE_RGB,
    position: origin,
    dimensions: sizeOne,
    translation: {x: 200, y: 100},
    rotation: {z: 0},
    scale: {x: 50, y: 50},
  },
  {
    type: TRIANGLE,
    position: origin,
    dimensions: sizeOne,
    translation: {x: 300, y: 100},
    rotation: {z: 0},
    scale: {x: 50, y: 50},
    color: RED_RGB,
  },
  {
    type: CIRCLE,
    position: origin,
    dimensions: sizeOne,
    translation: {x: 400, y: 100},
    rotation: {z: 0},
    scale: {x: 50, y: 50},
    color: GREEN_RGB,
  },
  {
    type: STAR,
    position: origin,
    dimensions: sizeOne,
    translation: {x: 100, y: 100},
    rotation: {z: 0},
    scale: {x: 50, y: 50},
    color: PURPLE_RGB,
  }

];

let gl;
let attributeCoords;
let uniformMatrix;
let uniformColor;
let bufferCoords;

const doMouseDown = (event) => {
  const boundingRectangle = canvas.getBoundingClientRect();
  const x = event.clientX - boundingRectangle.left;
  const y = event.clientY - boundingRectangle.top;
  const translation = {x, y}
  const shape = document.querySelector("input[name='shape']:checked").value

  addShape(translation, shape)
}

let selectedShapeIndex = 0

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
  const value = event.target.value
  const angleInDegrees = (360 - value) * Math.PI / 180;
  shapes[selectedShapeIndex].rotation[axis] = angleInDegrees
  render();
}

const updateColor = (event, axis) => {
  const value = event.target.value
  shapes[selectedShapeIndex].color = webglUtils.hexToRgb(value);
  render()
}

const init = () => {
  // get a reference to the canvas and WebGL context
  const canvas = document.querySelector("#canvas");

  document.getElementById("tx").onchange = event => updateTranslation(event,
      "x")
  document.getElementById("ty").onchange = event => updateTranslation(event,
      "y")

  document.getElementById("sx").onchange = event => updateScale(event, "x")
  document.getElementById("sy").onchange = event => updateScale(event, "y")

  document.getElementById("rz").onchange = event => updateRotation(event, "z")

  document.getElementById("color").onchange = event => updateColor(event)

  canvas.addEventListener(
      "mousedown",
      doMouseDown,
      false);

  gl = canvas.getContext("webgl");

  // create and use a GLSL program
  const program = webglUtils.createProgramFromScripts(gl,
      "#vertex-shader-2d", "#fragment-shader-2d");
  gl.useProgram(program);

  // get reference to GLSL attributes and uniforms
  attributeCoords = gl.getAttribLocation(program, "a_coords");
  uniformMatrix = gl.getUniformLocation(program, "u_matrix");
  const uniformResolution = gl.getUniformLocation(program, "u_resolution");
  uniformColor = gl.getUniformLocation(program, "u_color");

  // initialize coordinate attribute to send each vertex to GLSL program
  gl.enableVertexAttribArray(attributeCoords);

  // initialize coordinate buffer to send array of vertices to GPU
  bufferCoords = gl.createBuffer();

  // configure canvas resolution and clear the canvas
  gl.uniform2f(uniformResolution, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  selectShape(0);
}

const selectShape = (selectedIndex) => {
  selectedShapeIndex = selectedIndex
  document.getElementById("tx").value = shapes[selectedIndex].translation.x
  document.getElementById("ty").value = shapes[selectedIndex].translation.y
  document.getElementById("sx").value = shapes[selectedIndex].scale.x
  document.getElementById("sy").value = shapes[selectedIndex].scale.y
  const value = Math.round(
      ((2 * Math.PI - shapes[selectedIndex].rotation.z) / Math.PI) * 180)
  === 360 ? 0 : Math.round(
      ((2 * Math.PI - shapes[selectedIndex].rotation.z) / Math.PI) * 180);
  document.getElementById("rz").value = value;
  const hexColor = webglUtils.rgbToHex(shapes[selectedIndex].color)
  document.getElementById("color").value = hexColor
}

const deleteShape = (shapeIndex) => {
  shapes.splice(shapeIndex, 1)
  render()
}

const render = () => {
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
  gl.vertexAttribPointer(
      attributeCoords,
      2,
      gl.FLOAT,
      false,
      0,
      0);

  shapes.forEach((shape, index) => {
    gl.uniform4f(uniformColor,
        shape.color.red,
        shape.color.green,
        shape.color.blue, 1);

    // compute transformation matrix
    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = m3.translate(matrix, shape.translation.x, shape.translation.y);
    matrix = m3.rotate(matrix, shape.rotation.z);
    matrix = m3.scale(matrix, shape.scale.x, shape.scale.y);

    // apply transformation matrix.
    gl.uniformMatrix3fv(uniformMatrix, false, matrix);

    const $shapeList = $("#object-list")
    $shapeList.empty()
    shapes.forEach((shape, index) => {

      const $li = $(`
     <li>
             <button onclick="deleteShape(${index})">
          Delete
        </button>
       <label>
           <input
     type="radio"
     id="${shape.type}-${index}"
     name="shape-index"
     ${index === selectedShapeIndex ? "checked" : ""}
     onclick="selectShape(${index})"
     value="${index}"/>
         ${shape.type};
         X: ${shape.translation.x};
         Y: ${shape.translation.y}
       </label>
     </li>
   `)
      $shapeList.append($li);
    });

    if (shape.type === RECTANGLE) {
      renderRectangle(shape)
    } else if (shape.type === TRIANGLE) {
      renderTriangle(shape)
    } else if (shape.type === CIRCLE) {
      renderCircle(shape);
    } else if (shape.type == STAR) {
      renderStar(shape);
    }
  })
}

const renderRectangle = (rectangle) => {
  const x1 = rectangle.position.x
      - rectangle.dimensions.width / 2;
  const y1 = rectangle.position.y
      - rectangle.dimensions.height / 2;
  const x2 = rectangle.position.x
      + rectangle.dimensions.width / 2;
  const y2 = rectangle.position.y
      + rectangle.dimensions.height / 2;

  gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([
        x1, y1, x2, y1, x1, y2,
        x1, y2, x2, y1, x2, y2,
      ]), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
const renderTriangle = (triangle) => {
  const x1 = triangle.position.x
      - triangle.dimensions.width / 2
  const y1 = triangle.position.y
      + triangle.dimensions.height / 2
  const x2 = triangle.position.x
      + triangle.dimensions.width / 2
  const y2 = triangle.position.y
      + triangle.dimensions.height / 2
  const x3 = triangle.position.x
  const y3 = triangle.position.y
      - triangle.dimensions.height / 2

  const float32Array = new Float32Array([
    x1, y1, x2, y2, x3, y3
  ])

  gl.bufferData(gl.ARRAY_BUFFER,
      float32Array, gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

const renderCircle = (circle) => {
  const pointArray = [];
  for (let radians = 0; radians < 2 * Math.PI; radians += Math.PI / 20) {
    pointArray.push(circle.position.x);
    pointArray.push(circle.position.y);

    pointArray.push(
        Math.cos(radians - Math.PI / 20) * circle.dimensions.width / 2
        + circle.position.x);
    pointArray.push(
        (Math.sin(radians - Math.PI / 20) * circle.dimensions.height / 2)
        + circle.position.y);
    pointArray.push(Math.cos(radians) * circle.dimensions.width / 2
        + circle.position.x);
    pointArray.push((Math.sin(radians) * circle.dimensions.height / 2)
        + circle.position.y);
  }

  const float32Array = new Float32Array(pointArray);

  gl.bufferData(gl.ARRAY_BUFFER,
      float32Array, gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, pointArray.length);
}

const renderStar = (star) => {

  const topCenterX = star.position.x;
  const topCenterY = star.position.y + star.dimensions.height / 2;
  const bottomLeftX = star.position.x - star.dimensions.width / 2;
  const bottomLeftY = star.position.y - star.dimensions.height / 2;
  const bottomRightX = star.position.x + star.dimensions.width / 2;
  const bottomRightY = star.position.y - star.dimensions.height / 2;
  const middleRightX = star.position.x + star.dimensions.width / 2;
  const lineY = star.position.y + star.dimensions.height / 12;
  const middleLeftX = star.position.x - star.dimensions.width / 2;
  const centerRightX = star.position.x + star.dimensions.width / 8;
  const centerLeftX = star.position.x - star.dimensions.width / 8;

  const float32Array = new Float32Array([
    middleLeftX, lineY, centerRightX, lineY, bottomRightX,
    bottomRightY,
    middleRightX, lineY, centerLeftX, lineY, bottomLeftX,
    bottomLeftY,
    topCenterX, topCenterY, centerLeftX, lineY, centerRightX, lineY
  ])

  gl.bufferData(gl.ARRAY_BUFFER,
      float32Array, gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 9);
}

const addShape = (translation, type) => {
  const colorHex = document.getElementById("color").value
  const colorRgb = webglUtils.hexToRgb(colorHex)
  let tx = 0
  let ty = 0
  if (translation) {
    tx = translation.x
    ty = translation.y
  }
  const shape = {
    type: type,
    position: origin,
    dimensions: sizeOne,
    color: colorRgb,
    translation: {x: tx, y: ty, z: 0},
    rotation: {x: 0, y: 0, z: 0},
    scale: {x: 20, y: 20, z: 20}
  }
  shapes.push(shape)
  render()
}

