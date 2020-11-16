
import * as THREE from './node_modules/three/build/three.module.js';

let scene, camera, renderer, spotLight;
let cameraMoveMouse = true;

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

  const cameraPerspectiveHelper = new THREE.CameraHelper( camera );
  scene.add( cameraPerspectiveHelper );

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
  const cube = new THREE.Mesh(geometry, material);
  // cube.translateOnAxis([-1, -1, 0], 10);
  cube.position.set(0, 10, -20);
  cube.rotation.set(0, 1, 10);
  cube.castShadow = true;
  cube.receiveShadow = true;
  // cube.visible = false;
  scene.add(cube);

  const cube2 = new THREE.Mesh(geometry, material);
  cube2.position.set(0, 11, -21);
  cube2.castShadow = true;
  cube2.receiveShadow = true;
  scene.add(cube2);



  camera.position.set(0, 0, 0);
  // camera.setPosition(10, 10, 10);

  const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
  scene.add( ambient );

  spotLight = new THREE.SpotLight( 0xffffff, 1 );
  spotLight.position.set( 0, 0, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.focus = 1;
  scene.add( spotLight );

  const lightHelper = new THREE.SpotLightHelper( spotLight );
  scene.add( lightHelper );

  const shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
  scene.add( shadowCameraHelper );


  spotLight.target.position.set(0, 10, -20);
  scene.add( spotLight.target );
  // THREE.FlyControls(camera, canvas);


  // animate();
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
      (event) => {cameraMoveMouse = !cameraMoveMouse;
      },
      false
  )
  render();

}

// Get input from API call
// I have no clue how this is supposed to work for now, so I'm going to assume
// it returns an array of an object which has a type, color, size, position, and rotation
function getInputObjects (input) {
  let objects = []
  input.forEach(inputObject => {
    // Get the object type and size
    let geometry = new THREE.Geometry() // Default will be an empty object
    if (inputObject.type == "CUBE") {
      geometry = new THREE.BoxGeometry(inputObject.scale.x, inputObject.scale.y, inputObject.scale.z, 4, 4, 4);
    } else if (inputObject.type == "CONE") {
      geometry = new THREE.ConeGeometry(inputObject.scale.x / 2, inputObject.scale.y, 16, 4);
    } else if (inputObject.type == "CYLINDER") {
      geometry = new THREE.CylinderGeometry(inputObject.scale.x / 2, inputObject.scale.x / 2, inputObject.scale.y, 16, 4);
    } else if (inputObject.type == "SPHERE") {
      geometry = new THREE.SphereGeometry(inputObject.scale.x / 2, 32, 32);
    } else if (inputObject.type == "DIAMOND") {
      geometry = new THREE.SphereGeometry(inputObject.scale.x / 2, 4, 2);
    } else if (inputObject.type == "TORUS") {
      geometry = new THREE.TorusGeometry(inputObject.scale.x / 2, inputObject.scale.y / 2, 8, 50);
    }

    // Assign the color and make it
    // Will add texturing here as necessary
    const material = new THREE.MeshPhongMaterial({color: inputObject.color})
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;

    // Initialize rotation, and position
    object.rotateX (inputObject.rotation.x)
    object.rotateY (inputObject.rotation.y)
    object.rotateZ (inputObject.rotation.z)
    object.position.set (inputObject.translation.x, inputObject.translation.y, inputObject.translation.z)
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
  const step = 0.5;
  // const s = step * Math.sin(m4.degToRad(camera.rotation.y));
  // const c = step * Math.cos(m4.degToRad(camera.rotation.y));

  switch (event.key) {
    case ("w"):
      camera.rotation.x += step;
      break;
    case ("a"):
      camera.rotation.y += step;
      break;
    case ("s"):
      camera.rotation.x -= step;
      break;
    case ("d"): // TODO: broken?
      console.log('e')
      camera.rotation.y -= step;
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
  const xStrength = Math.sin(webglUtils.degToRad(camera.rotation.y));
  const yStrength = Math.sin(webglUtils.degToRad(-camera.rotation.x));
  const zStrength = -Math.cos(webglUtils.degToRad(camera.rotation.y + -camera.rotation.x));
  spotLight.target.position.set(xStrength, yStrength, zStrength); // Not working, doesn't update.
  // scene.add(spotLight.target)
  render();
}
const moveCameraMouse = (event) => {

  if (cameraMoveMouse) {
    camera.rotation.y -= event.movementX / 50;
    camera.rotation.x -= event.movementY / 50;
  }
  const xStrength = Math.sin(webglUtils.degToRad(camera.rotation.y));
  const yStrength = Math.sin(webglUtils.degToRad(-camera.rotation.x));
  const zStrength = -Math.cos(webglUtils.degToRad(camera.rotation.y + -camera.rotation.x));
  spotLight.target.position.set(xStrength, yStrength, zStrength);
  // lightSource = [xStrength, yStrength, zStrength];
  render();
}
main();
