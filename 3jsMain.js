import * as THREE from './node_modules/three/build/three.module.js';

let scene, camera, renderer, spotLight;
let cameraMoveMouse = true;
let textSubmitted = false;

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

const main = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight, 1, 1000);

  const cameraPerspectiveHelper = new THREE.CameraHelper(camera);
  scene.add(cameraPerspectiveHelper);

  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Add all of the API objects to the scene
  // This is an empty array for now because it will break the scene
  let objects = getInputObjects(testInput);
  objects.forEach(object => scene.add(object))

  // let material = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );
  //
  // let geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
  //
  // let mesh = new THREE.Mesh( geometry, material );
  // mesh.position.set( 0, 0, -30 );
  // mesh.rotation.x = - Math.PI * 0.5;
  // mesh.receiveShadow = true;
  // scene.add( mesh );
  //
  // //
  //
  // material = new THREE.MeshPhongMaterial( { color: 0x4080ff, dithering: true } );
  //
  // geometry = new THREE.CylinderBufferGeometry( 5, 5, 2, 32, 1, false );
  //
  // mesh = new THREE.Mesh( geometry, material );
  // mesh.position.set( 0, 5, 0 );
  // mesh.castShadow = true;
  // scene.add( mesh );

  let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  let material = new THREE.MeshPhongMaterial({color: 0x00ff00});
  material.emissive.set(0xff00ff);
  const cube = new THREE.Mesh(geometry, material);
  // cube.translateOnAxis([-1, -1, 0], 10);
  cube.position.set(0, 10, -20);
  cube.rotation.set(0, 1, 10);
  cube.castShadow = true;
  cube.receiveShadow = true;
  // cube.visible = false;
  scene.add(cube);
  material = new THREE.MeshPhongMaterial({color: 0xff00ff})

  const cube2 = new THREE.Mesh(geometry, material);
  cube2.position.set(0, 11, -21);
  cube2.castShadow = true;
  cube2.receiveShadow = true;
  scene.add(cube2);

  camera.position.set(0, 0, 0);
  // camera.setPosition(10, 10, 10);

  const ambient = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 0, 0);
  spotLight.angle = Math.PI / 10;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.focus = 1;
  scene.add(spotLight);

  const lightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(lightHelper);

  const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(shadowCameraHelper);

  spotLight.target.position.set(0, 0, -10);
  scene.add(spotLight.target);
  // THREE.FlyControls(camera, canvas);

  window.addEventListener('keypress', e => {
    // If the user has pressed enter within the textarea for the first time
    if (e.target.id === "textArea" && e.key === "Enter" && !textSubmitted) {
      onFormSubmit();
    }
  })

  // animate();
  render();
}

async function onFormSubmit() {
  textSubmitted = true;
  let canvas = document.getElementById("canvas");
  let input = document.getElementById("input");
  let inputTitle = document.getElementById("inputTitle");
  let textarea = document.getElementById("textArea");
  canvas.style["opacity"] = 1;
  inputTitle.style["opacity"] = 0;
  input.style["opacity"] = 0.25;
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
        cameraMoveMouse = !cameraMoveMouse;
      },
      false
  )

  const jsonResponse = await apiCall(inputText);
  console.log(jsonResponse);

}

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
      'Content-Type': 'text/plain;charset=utf-8',
      // btoa base64 encodes a string, what IBM expects
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
  let objects = []
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

    // Assign the color and make it
    // Will add texturing here as necessary
    const material = new THREE.MeshPhongMaterial({color: inputObject.color})
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;

    // Initialize rotation, and position
    object.rotateX(inputObject.rotation.x)
    object.rotateY(inputObject.rotation.y)
    object.rotateZ(inputObject.rotation.z)
    object.position.set(inputObject.translation.x, inputObject.translation.y,
        inputObject.translation.z)
    objects.push(object)
  });

  return objects
}

const animate = () => {
  // requestAnimationFrame( animate );

  // render();
  // stats.update();
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
  const step = 0.08;
  switch (event.key) {
    case ("d"):
      camera.rotation.y -= step;
      break;
    case ("w"):
      camera.rotation.x += step;
      break;
    case ("a"):
      camera.rotation.y += step;
      break;
    case ("s"):
      camera.rotation.x -= step;
      break;

    case ("q"):
      camera.rotation.z -= step;
      break;
    case ("e"):
      camera.rotation.z += step;
      break;
    case (" "):
      camera.rotation.x = defaultCamera.rotation.x;
      camera.rotation.y = defaultCamera.rotation.y;
      camera.rotation.z = defaultCamera.rotation.z;
      break;
  }
  const vector = new THREE.Vector3( 0, 0, - 1 );
  vector.applyQuaternion( camera.quaternion );
  spotLight.target.position.set(vector.x, vector.y, vector.z);
  render();
}

const moveCameraMouse = (event) => {
  if (cameraMoveMouse) {
    camera.rotation.y -= event.movementX / 200;
    camera.rotation.x -= event.movementY / 200;
    camera.rotation.y = camera.rotation.y % (2 * Math.PI);
    camera.rotation.x = camera.rotation.x % (2 * Math.PI);
  }
  // Elegant solution to calculating position from angle
  // https://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking

  const vector = new THREE.Vector3( 0, 0, - 1 );
  vector.applyQuaternion( camera.quaternion );
  spotLight.target.position.set(vector.x, vector.y, vector.z);

  render();
}
main();
