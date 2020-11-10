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
const RECTANGLE = "RECTANGLE"
const TRIANGLE = "TRIANGLE"
const LETTER_F = "LETTER_F"
const STAR = "STAR"
const CIRCLE = "CIRCLE"
const CUBE = "CUBE"
const PYRAMID = "PYRAMID"
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
//
// let camera = {
//   translation: {x: 0, y: 0, z: 5},
//   rotation: {x: 0, y: 0, z: 0}
// }


// In order to have light source look right, must change
// let lightSource = [0.4, 0.3, 0.5]
let lightSource = [0.4, -0.3, 0.2]

let shapes = [
  // {
  //   type: RECTANGLE,
  //   color: BLUE_RGB,
  //   position: origin,
  //   dimensions: sizeOne,
  //   translation: {x: -15, y: 0, z: -20},
  //   scale: {x: 10, y: 10, z: 10},
  //   rotation: {x: 0, y: 0, z: 0}
  // },
  // {
  //   type: TRIANGLE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   translation: {x: 15, y: 0, z: -20},
  //   scale: {x: 10, y: 10, z: 10},
  //   rotation: {x: 0, y: 0, z: 180},
  //   color: RED_RGB,
  // },
  //
  // {
  //   type: CIRCLE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   translation: {x: 30, y: 0, z: -20},
  //   rotation: {x: 0, y: 0, z: 0},
  //   scale: {x: 10, y: 10, z: 10},
  //   color: ORANGE_RGB,
  // },
  // {
  //   type: STAR,
  //   position: origin,
  //   dimensions: sizeOne,
  //   translation: {x: -30, y: 0, z: -20},
  //   rotation: {x: 0, y: 0, z: 180},
  //   scale: {x: 10, y: 10, z: 10},
  //   color: PURPLE_RGB,
  // },
  // {
  //   type: CUBE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: GREEN_RGB,
  //   translation: {x: -15, y: -15, z: -75},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: 0, y: 45, z: 0},
  // },

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
    translation: {x: -40, y: 0, z: 50},
    scale: {x: 0.5, y: 0.5, z: 0.5},
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
  // {
  //   type: LETTER_F,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: RED_RGB,
  //   translation: {x: -100, y: 0, z: -400},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: m4.degToRad(190), y: m4.degToRad(40), z: m4.degToRad(320)},
  // },
  // {
  //   type: RECTANGLE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: BLUE_RGB,
  //   translation: {x: -15, y: 0, z: -20},
  //   scale: {x: 10, y: 10, z: 10},
  //   rotation: {x: 0, y: 0, z: 0}
  // },
  // {
  //   type: TRIANGLE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: RED_RGB,
  //   translation: {x: 15, y: 0, z: -20},
  //   scale: {x: 10, y: 10, z: 10},
  //   rotation: {x: 0, y: 0, z: 180}
  // },
  // {
  //   type: CUBE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: RED_RGB,
  //   translation: {x:   -20, y: 0, z: 0},
  //   scale:       {x:   0.5, y:   0.5, z:   0.5},
  //   rotation:    {x:   0, y:  0, z:   0},
  // },

  // {
  //   type: CUBE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: BLUE_RGB,
  //   translation: {x: -50, y: 0, z: -100},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: 45, y: 45, z: 45},
  // },
  // {
  //   type: CUBE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: GREEN_RGB,
  //   translation: {x: 0, y: 0, z: -100},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: 45, y: 45, z: 45},
  // }
]
