import * as THREE from './node_modules/three/build/three.module.js';
import {OBJLoader2Parallel} from "./node_modules/three/examples/jsm/loaders/OBJLoader2Parallel.js";
import {Euler} from "./node_modules/three/src/math/Euler.js";

let scene, camera, renderer, spotLight;
let cameraMoveMouse = true;
let textSubmitted = false;
let shapes = [];
let tone_ids = ["anger", "fear", "joy", "sadness", "analytical", "confident",
  "tentative"]
let animating = true;

// Sample API object for testing purposes.
const testInput = [
  {
    type: "CUBE",
    dimensions: {x: 1, y: 1, z: 1},
    color: 0x00ff00,
    translation: {x: 0, y: 0, z: -10},
    scale: {x: 1, y: 1, z: 1},
    rotation: {x: 0, y: 0, z: 0},
  },
  {
    type: "CONE",
    dimensions: {x: 1, y: 1, z: 1},
    color: 0x00ff00,
    translation: {x: 10, y: 0, z: -20},
    scale: {x: 1, y: 1, z: 1},
    rotation: {x: 0, y: 0, z: 0},
  },
  {
    type: "CYLINDER",
    dimensions: {x: 1, y: 1, z: 1},
    color: 0x00ff00,
    translation: {x: -10, y: 0, z: -20},
    scale: {x: 1, y: 1, z: 1},
    rotation: {x: 0, y: 0, z: 0},
  },
  {
    type: "SPHERE",
    dimensions: {x: 1, y: 1, z: 1},
    color: 0x00ff00,
    translation: {x: 20, y: 0, z: -20},
    scale: {x: 1, y: 1, z: 1},
    rotation: {x: 0, y: 0, z: 0},
  },
  {
    type: "DIAMOND",
    dimensions: {x: 1, y: 1, z: 1},
    color: 0x00ff00,
    translation: {x: -20, y: 0, z: -20},
    scale: {x: 1, y: 1, z: 1},
    rotation: {x: 0, y: 0, z: 0},
  },
  {
    type: "TORUS",
    dimensions: {x: 1, y: 1, z: 1},
    color: 0x00ff00,
    translation: {x: -10, y: 10, z: -20},
    scale: {x: 1, y: 1, z: 1},
    rotation: {x: 90, y: 0, z: 0},
  },
]

const moveCamera = (xChange, yChange) => {
  const minPolarAngle = 0;
  const maxPolarAngle = Math.PI;
  let euler = new Euler(0, 0, 0, 'YXZ');

  const PI_2 = Math.PI / 2;
  euler.setFromQuaternion(camera.quaternion);

  euler.y -= xChange * 0.002;
  euler.x -= yChange * 0.002;

  euler.x = Math.max(PI_2 - maxPolarAngle,
      Math.min(PI_2 - minPolarAngle, euler.x));

  camera.quaternion.setFromEuler(euler);

  // Elegant solution to calculating position from angle
  // https://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking

  const vector = new THREE.Vector3(0, 0, -1);
  vector.applyQuaternion(camera.quaternion);
  spotLight.target.position.set(vector.x, vector.y, vector.z);

  render();

}

const main = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight, 1, 1000);

  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Add all of the API objects to the scene
  // This is an empty array for now because it will break the scene
  shapes = getInputObjects(testInput);
  shapes.forEach(object => scene.add(object))

  // define textures for reuse
  const bmap1 = new THREE.TextureLoader().load(
      './public/bumpMaps/cobbleBump.jpg');
  const bmap2 = new THREE.TextureLoader().load(
      './public/bumpMaps/gritBump.jpg');

  const texture1 = new THREE.TextureLoader().load(
      './public/textures/abstract1.png')
  const texture2 = new THREE.TextureLoader().load(
      './public/textures/abstract2.jpg')

  let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  let material1 = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    bumpMap: bmap1
  });
  material1.emissive.set(0xff00ff);

  let material2 = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    bumpMap: bmap2
  });
  material2.emissive.set(0x555555);

  let material3 = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    map: texture1
  });
  material3.emissive.set(0x555555);

  let material4 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: texture2
  });
  material4.emissive.set(0x555555);

  const cube = new THREE.Mesh(geometry, material1);
  cube.position.set(-6, 5, -10);
  cube.rotation.set(0, 1, 10);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);

  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.set(-2, 5, -10);
  cube2.castShadow = true;
  cube2.receiveShadow = true;
  scene.add(cube2);

  const cube3 = new THREE.Mesh(geometry, material3);
  cube3.position.set(2, 5, -10);
  cube3.castShadow = true;
  cube3.receiveShadow = true;
  scene.add(cube3);

  const cube4 = new THREE.Mesh(geometry, material4);
  cube4.position.set(6, 5, -10);
  cube4.castShadow = true;
  cube4.receiveShadow = true;
  scene.add(cube4);

  camera.position.set(0, 0, 0);

  // const ambient = new THREE.AmbientLight(0xffffff, 0.1);
  // scene.add(ambient);
  const point = new THREE.PointLight(0xfffff, 0.05); // white right now orange is 0xea9d0d
  point.castShadow = true;
  point.position.set(0, 20, 0); // Have shining down from above
  scene.add(point);

  spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(0, 0, 0);
  spotLight.angle = Math.PI / 30;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  scene.add(spotLight);

  spotLight.target.position.set(0, 0, -10);
  scene.add(spotLight.target);

  // Background
  {
    const loader = new THREE.TextureLoader();
    Promise.all(
        [loader.load('./public/seamlessSpaceMap/left.png'),
          loader.load('./public/seamlessSpaceMap/right.png'),
          loader.load('./public/seamlessSpaceMap/front.png'),
          loader.load('./public/seamlessSpaceMap/back.png'),
          loader.load('./public/seamlessSpaceMap/top.png'),
          loader.load('./public/seamlessSpaceMap/bottom.png')], (resolve, reject) => {
      resolve(texture);
    }).then(result => {


      // Solid Background
      const maxDistance = 35;
      const floorSize = 70;
      const floorGeo = new THREE.PlaneBufferGeometry
      (floorSize, floorSize);
      const floorMat = new THREE.MeshPhongMaterial({
        // map: texture[0],
        // side: THREE.FrontSide,
      });
      // const surroundingGeo = new THREE.BoxGeometry(70, 70);
      // const surroundMat = new THREE.MeshPhongMaterial({
      // map: texture,
      // side: THREE.DoubleSide,
      // });
      // const surroundMesh = new THREE.Mesh(surroundingGeo, surroundMat);
      floorMat.emissive = 0x00000;
      floorMat.emissiveIntensity = 3;
      floorMat.map = result[5];
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMat.map = result[4];
      const topMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMat.map = result[1];
      const wallMeshRight = new THREE.Mesh(floorGeo, floorMat);
      floorMat.map = result[0];
      const wallMeshLeft = new THREE.Mesh(floorGeo, floorMat);
      floorMat.map = result[2];
      const wallMeshFront = new THREE.Mesh(floorGeo, floorMat);
      floorMat.map = result[3];
      const wallMeshBack = new THREE.Mesh(floorGeo, floorMat);
      wallMeshRight.position.x = maxDistance;
      wallMeshRight.rotation.y = Math.PI * -.5;
      wallMeshRight.receiveShadow = true;
      wallMeshLeft.position.x = -maxDistance;
      wallMeshLeft.rotation.y = Math.PI * .5;
      wallMeshLeft.receiveShadow = true;
      wallMeshFront.position.z = -30;
      wallMeshFront.rotation.y = 0;
      wallMeshFront.receiveShadow = true;
      wallMeshBack.position.z = maxDistance;
      wallMeshBack.rotation.y = -Math.PI;
      wallMeshBack.receiveShadow = true;
      floorMesh.receiveShadow = true;
      floorMesh.rotation.x = Math.PI * -.5;
      floorMesh.position.y = -maxDistance;
      topMesh.rotation.x = Math.PI * .5;
      topMesh.position.y = maxDistance;
      scene.add(floorMesh);
      scene.add(topMesh);
      // scene.add(wallMeshFront); // Look out into space from trapped in a cube
      scene.add(wallMeshBack);
      console.log(wallMeshFront);
      scene.add(wallMeshRight);
      scene.add(wallMeshLeft);
      // scene.add(surroundMesh);

    });
    // const textureFloor = loader.load('./public/seamlessSpaceMap/bottom.png');
    const cubeLoader = new THREE.CubeTextureLoader();
    const texture = cubeLoader.load([
      './public/seamlessSpaceMap/left.png',
      './public/seamlessSpaceMap/right.png',
      './public/seamlessSpaceMap/front.png',
      './public/seamlessSpaceMap/back.png',
      './public/seamlessSpaceMap/top.png',
      './public/seamlessSpaceMap/bottom.png'
    ]);


    scene.background = texture;
  }

  // Load objs
  const spiralTwistLoader = new OBJLoader2Parallel();
  spiralTwistLoader.load('./public/obj/15736_Spiral_Twist_v1_NEW.obj',
      (root) => {
        root.scale.set(0.05, 0.05, 0.05);
        root.position.set(0, -10, -10);
        scene.add(root);
      });
  const curvesLoader = new OBJLoader2Parallel();
  curvesLoader.load('./public/obj/Compressed_curves.obj', (root) => {
    root.scale.set(0.02, 0.02, 0.02);
    root.position.set(20, -10, -20);
    scene.add(root);
  });
  const voronoiSphereLoader = new OBJLoader2Parallel();
  voronoiSphereLoader.load('./public/obj/Compressed_voronoi_sphere.obj',
      (root) => {
        root.scale.set(0.05, 0.05, 0.05);
        root.position.set(-20, -10, -20);
        scene.add(root);
      });

  window.addEventListener('keypress', e => {
    // If the user has pressed enter within the textarea for the first time
    if (e.target.id === "textArea" && e.key === "Enter" && !textSubmitted) {
      onFormSubmit();
    }
  })

  window.addEventListener('resize', onWindowResize, false);

  animate();
  render();
}

async function onFormSubmit() {
  textSubmitted = true;
  let canvas = document.getElementById("canvas");
  let input = document.getElementById("input");
  let inputTitle = document.getElementById("inputTitle");
  let textarea = document.getElementById("textArea");
  let controls = document.getElementById("controls");
  canvas.style["opacity"] = 1;
  controls.style["opacity"] = 0.5;
  inputTitle.style["opacity"] = 0;
  input.style["opacity"] = 0.1;
  input.style["user-select"] = "none";
  input.style["-moz-user-select"] = "none";
  input.style["-khtml-user-select"] = "none";
  input.style["-webkit-user-select"] = "none";
  input.style["-o-user-select"] = "none";
  let inputText = textarea.value;
  textarea.setAttribute("disabled", "true");

  // Bind motion when text is entered
  document.addEventListener(
      'keydown',
      moveCameraKeyboard,
      false
  )

  document.addEventListener(
      'mousemove',
      moveCameraMouse,
      false
  )

  document.addEventListener(
      'click',
      (event) => {
        const mouse3D = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse3D, camera);
        const intersects = raycaster.intersectObjects(shapes);
        if (intersects.length > 0) {
          // intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
          let emotionBox = document.getElementById("emotion");
          emotionBox.innerHTML = `<h4>${intersects[0].object.emotion}</h4>`;
        }
      },
      false
  );

  const jsonResponse = await apiCall(inputText);
  console.log(jsonResponse);
  apiToShape(jsonResponse);
  //console.log(jsonResponse.document_tone["tones"]);

}

function apiToShape(jsonResponse) {
  let shapesDict = {};
  let shapeJSON = []
  let toneArr = jsonResponse.document_tone["tones"];
  let shapeNames = ["CUBE", "SPHERE", "CYLINDER", "DIAMOND", "CONE", "TORUS"];
  let scale_vals = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const RED = "0xCC0000";
  const BLUE = "0x3D85C6";
  const PURPLE = "0x674EA7";
  const PINK = "0xC27BA0";
  const GREEN = "0x6AA84F";
  const ORANGE = "0xE69138";
  const YELLOW = "0xFFD966";

  for (let i = 0; i < toneArr.length; i++) {
    switch (toneArr[i].tone_id) {
      case tone_ids[0]:
        shapesDict.type = shapeNames[0];
        shapesDict.color = RED;
        break;
      case tone_ids[1]:
        shapesDict.type = shapeNames[1];
        shapesDict.color = BLUE;
        break;
      case tone_ids[2]:
        shapesDict.type = shapeNames[2];
        shapesDict.color = PURPLE;
        break;
      case tone_ids[3]:
        shapesDict.type = shapeNames[3];
        shapesDict.color = PINK;
        break;
      case tone_ids[4]:
        shapesDict.type = shapeNames[4];
        shapesDict.color = GREEN;
        break;
      case tone_ids[5]:
        shapesDict.type = shapeNames[0];
        shapesDict.color = ORANGE;
        break;
      case tone_ids[6]:
        shapesDict.type = shapeNames[5];
        shapesDict.color = YELLOW;
        break;
      default:
        break;
    }
    if (toneArr[i].score <= 0.1) {
      shapesDict.scale = {x: scale_vals[0], y: scale_vals[0], z: scale_vals[0]};
    } else if (toneArr[i].score <= 0.2) {
      shapesDict.scale = {x: scale_vals[1], y: scale_vals[1], z: scale_vals[1]};
    } else if (toneArr[i].score <= 0.3) {
      shapesDict.scale = {x: scale_vals[2], y: scale_vals[2], z: scale_vals[2]};
    } else if (toneArr[i].score <= 0.4) {
      shapesDict.scale = {x: scale_vals[3], y: scale_vals[3], z: scale_vals[3]};
    } else if (toneArr[i].score <= 0.5) {
      shapesDict.scale = {x: scale_vals[4], y: scale_vals[4], z: scale_vals[4]};
    } else if (toneArr[i].score <= 0.6) {
      shapesDict.scale = {x: scale_vals[5], y: scale_vals[5], z: scale_vals[5]};
    } else if (toneArr[i].score <= 0.7) {
      shapesDict.scale = {x: scale_vals[6], y: scale_vals[6], z: scale_vals[6]};
    } else if (toneArr[i].score <= 0.8) {
      shapesDict.scale = {x: scale_vals[7], y: scale_vals[7], z: scale_vals[7]};
    } else if (toneArr[i].score <= 0.9) {
      shapesDict.scale = {x: scale_vals[8], y: scale_vals[8], z: scale_vals[8]};
    } else if (toneArr[i].score <= 1.0) {
      shapesDict.scale = {x: scale_vals[9], y: scale_vals[9], z: scale_vals[9]};
    }
    shapesDict.texture = "none";
    shapesDict.bumpMap = "none";

    //console.log(JSON.parse(JSON.stringify(shapesDict)));
    shapeJSON.push(JSON.parse(JSON.stringify(shapesDict)))
  }
  console.log(shapeJSON)
}

// Possible response emotions are Anger, Fear, Joy, Sadness, Confident, Tentative, Analytical
// https://tone-analyzer-demo.ng.bluemix.net
// https://cloud.ibm.com/docs/tone-analyzer?topic=tone-analyzer-overviewDevelopers
// TODO: Right now things can trigger no emotions, need to have default case, handle this
async function apiCall(inputText) {
  let credentials = "apikey:qB92x6pn98MGaei5j9TLmUhdCjmmU5eITHzJMbS2gKFM"
  let url = "https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/5942acc2-d420-4bfc-96b0-5684b5ae65d1/v3/tone?version=2017-09-21&text="
      + inputText;

  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      // IBM requests this content-type
      'Content-Type': 'text/plain;charset=utf-8',
      // btoa base64 encodes a string, what IBM expects
      // https://stackoverflow.com/questions/30203044/using-an-authorization-header-with-fetch-in-react-native
      'Authorization': 'Basic ' + btoa(credentials),
      // 'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects

}

// Get input from API call
// I have no clue how this is supposed to work for now, so I'm going to assume
// it returns an array of an object which has a type, color, size, position, and rotation
function getInputObjects(input) {
  let shapes = []
  input.forEach(inputObject => {
    // Get the object type and size
    let geometry = new THREE.Geometry() // Default will be an empty object
    switch (inputObject.type) {
      case "CUBE":
        geometry = new THREE.BoxGeometry(inputObject.scale.x,
            inputObject.scale.y, inputObject.scale.z, 4, 4, 4);
        break;
      case "CONE":
        geometry = new THREE.ConeGeometry(inputObject.scale.x / 2,
            inputObject.scale.y, 16, 4);
        break;
      case "CYLINDER":
        geometry = new THREE.CylinderGeometry(inputObject.scale.x / 2,
            inputObject.scale.x / 2, inputObject.scale.y, 16, 4);
        break;
      case "SPHERE":
        geometry = new THREE.SphereGeometry(inputObject.scale.x / 2, 32, 32);
        break;
      case "DIAMOND":
        geometry = new THREE.SphereGeometry(inputObject.scale.x / 2, 4, 2);
        break;
      case "TORUS":
        geometry = new THREE.TorusGeometry(inputObject.scale.x / 2,
            inputObject.scale.y / 2, 8, 50);
        break;
    }

    const bmap3 = new THREE.TextureLoader().load(
        './public/bumpMaps/weaveBump.jpg');

    // Assign the color and make it
    // Will add texturing here as necessary
    const material = new THREE.MeshPhongMaterial({
      color: inputObject.color,
      bumpMap: bmap3
    })
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;

    // Initialize rotation, and position
    object.rotateX(inputObject.rotation.x)
    object.rotateY(inputObject.rotation.y)
    object.rotateZ(inputObject.rotation.z)
    object.position.set(inputObject.translation.x,
        ((1000 * Math.random()) % 26) - 13, // Y between -13 and 13
        inputObject.translation.z)
    object.emotion = "neutral";
    object.orbitDistance = ((1000 * Math.random()) % 20) + 10; // At least 10 but no more than 30 away
    shapes.push(object)
  });

  return shapes;
}

let last = Date.now();
const fpsInterval = 1000 / 30; // 30 fps

const animate = () => {

  let time = Date.now();

  const elapsed = time - last;

  // console.log(elapsed);

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {
    last = time;
    // console.log("test")

    time *= 0.0002;
    shapes.forEach(shape => {
      shape.position.x = shape.orbitDistance * Math.sin(
          time + shape.orbitDistance); // space orbits based on distance
      shape.position.z = shape.orbitDistance * Math.cos(
          time + shape.orbitDistance);
    });
    render();
    // stats.update();

  }
  if (animating) {
    requestAnimationFrame(animate);
  }

}

const render = () => {
  // camera.rotation.y += 1;
  renderer.render(scene, camera);
}

const moveCameraKeyboard = (event, direction) => {
  let defaultCamera = {
    translation: {x: 0, y: 0, z: 0},
    rotation: {x: 0, y: 0, z: 0}
  }
  const step = 50;
  switch (event.key) {
    case ("w"):
      moveCamera(0, -step);
      break;
    case ("d"):
      moveCamera(step, 0);
      // camera.rotation.x += step;
      break;
    case ("s"):
      moveCamera(0, step);
      // camera.rotation.y += step;
      break;
    case ("a"):
      moveCamera(-step, 0);
      // camera.rotation.x -= step;
      break;

    case ("q"):
      camera.rotation.z -= step / 500;
      break;
    case ("e"):
      camera.rotation.z += step / 500;
      break;
    case (" "):
      camera.rotation.x = defaultCamera.rotation.x;
      camera.rotation.y = defaultCamera.rotation.y;
      camera.rotation.z = defaultCamera.rotation.z;
      break;
    case ("p"):
      animating = !animating;
      animate();
      cameraMoveMouse = !cameraMoveMouse;
    case("Escape"):
      cameraMoveMouse = !cameraMoveMouse;
      break;
  }
  // const vector = new THREE.Vector3(0, 0, -1);
  // vector.applyQuaternion(camera.quaternion);
  // spotLight.target.position.set(vector.x, vector.y, vector.z);
  render();
}

const moveCameraMouse = (event) => {
  if (cameraMoveMouse) {
    moveCamera(event.movementX, event.movementY);
  }
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

main();
