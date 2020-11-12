const RED_HEX = "#FF0000"
const RED_RGB = webglUtils.hexToRgb(RED_HEX)
const BLUE_HEX = "#0000FF"
const BLUE_RGB = webglUtils.hexToRgb(BLUE_HEX)
const GREEN_HEX = "#00FF00";
const GREEN_RGB = webglUtils.hexToRgb(GREEN_HEX);
const PURPLE_HEX = "#b000ff"
const PURPLE_RGB = webglUtils.hexToRgb(PURPLE_HEX);
const ORANGE_HEX = "#ff7700";
const ORANGE_RGB = webglUtils.hexToRgb(ORANGE_HEX);
const LETTER_F = "LETTER_F"
const CUBE = "CUBE"
const PYRAMID = "PYRAMID"
const DIAMOND = "DIAMOND"
const origin = {x: 0, y: 0, z: 0}
const sizeOne = {width: 1, height: 1, depth: 1}

// let camera = {
//   translation: {x: -45, y: -35, z: 21},
//   rotation: {x: 40, y: 235, z: 0}
// }
// In order to have appropriate view, flip each thing. We were given in uninverted coordinates
let camera = {
  translation: {x: 0, y: 0, z: 0},
  rotation: {x: 0, y: 180, z: 0}
}
let defaultCamera = {
  translation: {x: 0, y: 0, z: 0},
  rotation: {x: 0, y: 180, z: 0}
}
//
// let camera = {
//   translation: {x: 0, y: 0, z: 5},
//   rotation: {x: 0, y: 0, z: 0}
// }

// In order to have light source look right, must change
// let lightSource = [0.4, 0.3, 0.5]
// let lightSource = [0.4, -0.3, 0.2]
let lightSource = [0, 0, 1]

let shapes = [

  {
    type: CUBE,
    position: origin,
    dimensions: sizeOne,
    color: BLUE_RGB,
    translation: {x: 0, y: 0, z: 50},
    scale: {x: 0.5, y: 0.5, z: 0.5},
    rotation: {x: 0, y: 0, z: 0},
  },
  {
    type: CUBE,
    position: origin,
    dimensions: sizeOne,
    color: GREEN_RGB,
    translation: {x: 20, y: 0, z: 50},
    scale: {x: 0.5, y: 0.5, z: 0.5},
    rotation: {x: 0, y: 0, z: 0},
  },
  {
    type: CUBE,
    position: origin,
    dimensions: sizeOne,
    color: RED_RGB,
    translation: {x: -20, y: 0, z: 50},
    scale: {x: 0.5, y: 0.5, z: 0.5},
    rotation: {x: 0, y: 0, z: 0}
  },
  {
    type: PYRAMID,
    position: origin,
    dimensions: sizeOne,
    color: PURPLE_RGB,
    translation: {x: -30, y: 0, z: 50},
    scale: {x: 0.2, y: 0.4, z: 0.5},
    rotation: {x: 0, y: 0, z: 0}
  },
  {
    type: DIAMOND,
    position: origin,
    dimensions: sizeOne,
    color: ORANGE_RGB,
    translation: {x: -50, y: 0, z: 50},
    scale: {x: 0.2, y: 0.4, z: 0.4},
    rotation: {x: 0, y: 0, z: 0}
  },
  // {
  //   type: LETTER_F,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: BLUE_RGB,
  //   translation: {x: -150, y: 0, z: -360},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: m4.degToRad(190), y: m4.degToRad(40), z: m4.degToRad(320)},
  // },
]
