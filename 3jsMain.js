import * as THREE from './node_modules/three/build/three.module.js';

const main = () => {


  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight, 1, 1000);

  const renderer = new THREE.WebGLRenderer( { canvas: canvas } );
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  // cube.translateOnAxis([-1, -1, 0], 10);
  cube.position.z = -10
  cube.rotation.y = 10
  cube.rotation.z = 10
  cube.position.y = 10;
  // cube.position.x = 300;
  scene.add( cube )

  camera.position.z = 10;
  // camera.setPosition(10, 10, 10);

  renderer.render( scene, camera );

  // var geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  // var material1 = new THREE.MeshBasicMaterial();
  // var material2 = new THREE.MeshBasicMaterial();
  // var sphere = [new THREE.Mesh(geometry, material1), new THREE.Mesh(geometry, material1), new THREE.Mesh(geometry, material2)];
  //
  // sphere[0].position.set(1, 1, 1);
  // sphere[1].position.set(-1, -1, -1);
  //
  // scene.add(sphere[0]);
  // scene.add(sphere[1]);
  // scene.add(sphere[2]);


  //
  // var hex = "0x" + "000000".replace(/0/g, function() {
  //   return (~~(Math.random() * 16)).toString(16);
  // });
  // sphere[0].material.color.setHex(hex);
  //
  // hex = "0x" + "000000".replace(/0/g, function() {
  //   return (~~(Math.random() * 16)).toString(16);
  // });
  // sphere[2].material.color.setHex(hex);

  //
  // var render = function() {
  //   requestAnimationFrame(render);
  //   renderer.render(scene, camera);
  // };

  // render();


}
main();
