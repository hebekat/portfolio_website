import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.autoClearColor = false;
document.body.appendChild( renderer.domElement );
document.body.style.overflow = 'hidden';

const light = new THREE.DirectionalLight(0xffffed);
const axesHelper = new THREE.AxesHelper( 5 );
const controls = new OrbitControls( camera, renderer.domElement );

scene.add( axesHelper );

scene.add(light);
light.position.x = 1
light.position.y = 1;
scene.background = new THREE.Color(0xFFFFFF);
camera.position.z = 5;
camera.position.y = 5;

const size = 1000;
const divisions = 100;
const gridHelper = new THREE.GridHelper( size, divisions );
//scene.add( gridHelper );

const loader = new GLTFLoader();

const copies = [];
var model;


loader.load( 'dist/jupiter.glb', function ( gltf )
{
    model = gltf.scene;  // model 3D object is loaded
    model.position.y = 0;
    model.position.z = 0;
    model.position.x = 0;
    model.name = "jupiter";
    scene.add(model);
}
);

console.log(scene);
var parent = scene.getObjectByName("jupiter", true);
console.log(parent);

for(let i = 0; i < 10; i++)
{
  copies[i] = parent.clone();
  scene.add(copies[i]);
}
   
const sloader = new THREE.CubeTextureLoader();

const stexture = sloader.load([
  "dist/Nebula aklion/skybox_px.jpg",
  "dist/Nebula aklion/skybox_nx.jpg",
  "dist/Nebula aklion/skybox_py.jpg",
  "dist/Nebula aklion/skybox_ny.jpg",
  "dist/Nebula aklion/skybox_pz.jpg",
  "dist/Nebula aklion/skybox_nz.jpg"
]);

scene.background = stexture;
animate();


function create_copies(number, parent)
{
  let copies = new Array();

  for(let i = 0; i < number; i++)
  {
    copies[i] = parent.clone();
    scene.add(copies[i]);
  }
  return (copies);
}


let turnFraction = 0.5;
let numPoints = 10;


for (let i = 0; i < numPoints; i++)
{
  let dst = i / (numPoints - 1);
  let angle = 2 * Math.PI * turnFraction * i;
  
  copies[i].position.x = dst * Math.cos(angle);
  copies[i].position.y = dst * Math.sin(angle);
}


function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    // model.position.x = Math.sin(xpos += 0.01) * 15;
    // model.position.z = Math.cos(xpos) * 15;
    //model.position.y = Math.sin(xpos * 4);
};


animate();