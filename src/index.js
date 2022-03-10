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

let numPoints = 100;
var copies = new Array(numPoints);
var model;

//const light = new THREE.DirectionalLight(0xffffed);
loader.load( 'dist/jupiter.glb', function ( gltf )
{
    const geometry = new THREE.SphereGeometry( 15, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const sphere = new THREE.Mesh( geometry, material );
    model = sphere; 
    //model = gltf.scene; // model 3D object is loaded
    model.position.y = 0;
    model.position.z = 0;
    model.position.x = 0;
    model.scale.x = 0.1;
    model.scale.y = 0.1;
    model.scale.z = 0.1;
    model.name = "star";
    //model.add(new THREE.DirectionalLight(0xFFFFFF));
    //scene.add(model);
    //copies = init(model);
    //boid(copies, 0.05);
    animate();
    //console.log(parent);
}
);
//console.log(parent);
//console.log(scene)


const sloader = new THREE.CubeTextureLoader();

const stexture = sloader.load([
  "dist/Nebula aklion/skybox_px.jpg",
  "dist/Nebula aklion/skybox_nx.jpg",
  "dist/Nebula aklion/skybox_py.jpg",
  "dist/Nebula aklion/skybox_ny.jpg",
  "dist/Nebula aklion/skybox_pz.jpg",
  "dist/Nebula aklion/skybox_nz.jpg"
]);


let sphere;
function initPoints() {

  const amount = 10000;

  // for ( let i = 0; i < amount; i ++ ) {

  //   vertex.x = ( Math.random() * 2 - 1 ) * radius;
  //   //vertex.y = ( Math.random() * 2 - 1 ) * radius;
  //   vertex.z = ( Math.random() * 2 - 1 ) * radius;
  //   vertex.toArray( positions, i * 3 );

  //   // if ( vertex.x < 0 ) {
  //   //color.setHSL( 0.5 + 0.1 * ( i / amount ), 0.7, 0.5 );
  //   // } else {
  //   //   color.setHSL( 0.0 + 0.1 * ( i / amount ), 0.9, 0.5 );
  //   // }
  //   color.toArray( colors, i * 3 );
  //   sizes[ i ] = 10;
  // }
  var geometry = new THREE.BufferGeometry();
  geometry = point_boid(geometry, amount, 0.005);
  //console.log(geometry);
  const material = new THREE.ShaderMaterial( {

    uniforms: {
      color: { value: new THREE.Color( 0xffffff ) },
      pointTexture: { value: new THREE.TextureLoader().load( "dist/starlight.png" ) }
    },
    vertexShader: document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true

  } );
  sphere = new THREE.Points( geometry,material );
  scene.add( sphere );
  return(geometry);
}

// const grid = new THREE.Points( new THREE.SphereGeometry( 15000, 15000, 64, 64 ), new THREE.PointsMaterial( { color: 0xffffff, size: 10 } ) );
// grid.position.y = - 400;
// grid.rotation.x = - Math.PI / 2;
// scene.add( grid );

scene.background = stexture;

// function create_copies(number, parent)
// {
//   let copies = new Array();

//   for(let i = 0; i < number; i++)
//   {
//     copies.push(parent.clone());
//     scene.add(copies[i]);
//   }
//   return (copies);
// }
//console.log(scene);


let turnFraction = 0.05;


function boid(copies, numPoints, turnFraction)
{
  for (let i = 0; i < numPoints; i++)
  {
    let dst = i / (numPoints - 1);
    let angle = 2 * Math.PI * turnFraction * i;
    
    copies[i].position.x = dst * Math.cos(angle) * 400;
    copies[i].position.z = dst * Math.sin(angle) * 400;
  }
  copies.position.needsUpdate = true;
}

function point_boid(geometry, amount, turnFraction)
{
  const radius = 30;

  const positions = new Float32Array( amount * 3 );
  const colors = new Float32Array( amount * 3 );
  const sizes = new Float32Array( amount );

  const vertex = new THREE.Vector3();
  const color = new THREE.Color( 0xffffff );

  for (let i = 0; i < amount; i++)
  {
    let dst = i / (amount - 1);
    let angle = 2 * Math.PI * turnFraction * i;
    
    vertex.x = dst * Math.cos(angle) * radius;
    vertex.z = dst * Math.sin(angle) * radius;
    vertex.toArray( positions, i * 3 );
    color.setHSL(Math.random()*255, Math.random()*255,Math.random()*255 );
    color.setRGB(Math.random()*255, Math.random()*255,Math.random()*255 );
    color.toArray( colors, i * 3 );
    sizes[ i ] =  Math.sin(i) * Math.random();
  }
  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
  geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  geometry.verticesNeedUpdate = true;
  return(geometry);

}
let stars = initPoints();

function init(parent)
{
  let x = 0;
  for(let i = 0; i < numPoints; i++)
  {
    copies[i] = parent.clone();
    if(i > numPoints/15)
      scene.add(copies[i]);
  }
  boid(copies, copies.length, 0);
  return (copies);
}

function animate() {
    //boid(stars, numPoints, turnFraction += 0.000001);
    //console.clear();
    //console.log(turnFraction);
    point_boid(stars, 10000, turnFraction += 0.0000001);
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    
    // model.position.x = Math.sin(xpos += 0.01) * 15;
    // model.position.z = Math.cos(xpos) * 15;
    //model.position.y = Math.sin(xpos * 4);
};


