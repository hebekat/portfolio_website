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


//scene.add(light);
light.position.x = 1
light.position.y = 1;
scene.background;
camera.position.z = 5;
camera.position.y = 5;

const size = 800;
const divisions = 100;
const gridHelper = new THREE.GridHelper( size, divisions );
//scene.add( gridHelper );

const loader = new GLTFLoader();


//var copies = new Array(numPoints);
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


// const grid = new THREE.Points( new THREE.SphereGeometry( 15000, 15000, 64, 64 ), new THREE.PointsMaterial( { color: 0xffffff, size: 10 } ) );
// grid.position.y = - 400;
// grid.rotation.x = - Math.PI / 2;
// scene.add( grid );

scene.background = stexture;

function lerpColor(a, b, amount) { 

  var ah = parseInt(a.parseIn.replace(/#/g, ''), 16),
      ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ''), 16),
      br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

  return '0x' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}
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


let turnFraction = 0.540904892;
let baseCoords = 200;
let randomSeedMax = 30;
let numPoints = baseCoords * randomSeedMax;
var positions = new Float32Array( numPoints * 3 );
var base_positions = new Float32Array( numPoints * 2);

function initPoints() {

  const amount = numPoints;
  var geometry = new THREE.BufferGeometry();
  geometry = init_point_boid(geometry, amount, 0.005);
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

function init_point_boid(geometry, amount, turnFraction)
{
  //400 * 20max
  const radius = 10;

  const positions = new Float32Array( amount * 3 );
  const colors = new Float32Array( amount * 3 );
  const sizes = new Float32Array( amount );
  var szmod  = 15;
  const vertex = new THREE.Vector3();
  const baseVertex = new THREE.Vector3();
  const color1 = new THREE.Color(0x0F0F0F);
  const color1c = new THREE.Color(0xABAB94);
  const color2c = new THREE.Color(0x00008B)
  const color2 = new THREE.Color(0x00008B);
  let counterforhex = 0;

  for (let i = 0; i < numPoints; i++)
  {

      let dst = i / (amount - 1);
      let angle = 2 * Math.PI * turnFraction * i;
      if(randomSeedMax > 1)
       randomSeedMax -= 0.0001;
      baseVertex.x = dst * Math.cos(angle) * radius;
      baseVertex.z = dst * Math.sin(angle) * radius;

      //baseVertex.toArray(i * 2);
      
      for(let x = 0; x<randomSeedMax; x++)
      {
          let spread = 0.0003;
          let offs = 0.0001 * i;
          vertex.x = ((baseVertex.x+spread - baseVertex.x-spread) + baseVertex.x - spread);
          vertex.y = ((baseVertex.y+spread - baseVertex.y-spread) + baseVertex.y - spread);
          vertex.z = ((baseVertex.z+spread - baseVertex.z-spread) + baseVertex.z - spread);
          vertex.toArray( positions, i * 3 );
      }
      if(i < 0.3 * amount)
      {
        color1.setHex(color1.getHex() + (counterforhex += 0.7));
        color1.toArray( colors, i * 3 );
        szmod = 30;
        sizes[i] = 10;
      }
      else  if(i % 10 == 0 || i % 9 == 0)
      {
          sizes[ i ] =  i % 40;  
          color1c.toArray(colors , i * 3);
      }  
      else
      {
        //color2.setHex((color2.getHex() - 100));
        color1.setHex(color1.getHex() + (counterforhex += 0.7));
        color1.toArray( colors, i * 3 );
        sizes[ i ] =  i % 80; 
      }
       
  }
  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
  geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  geometry.verticesNeedUpdate = true;
  return(geometry);

}

function move_point_boid(geometry, amount, turnFraction)
{
  //400 * 20max
  const radius = 100;

  
  const colors = new Float32Array( amount * 3 );
  const sizes = new Float32Array( amount );
  var szmod  = 15;
  const vertex = new THREE.Vector3();
  const baseVertex = new THREE.Vector3();
  const blau = new THREE.Color(0xAFeFcF);
  const color1c = new THREE.Color(0x1011f1);
  const yellow = new THREE.Color(0xFFFF00);
  const dblue = new THREE.Color(0x00008B);
  const lerpedColor = new THREE.Color();
  let counterforhex = 0;
  let c2 = 0;

  for (let i = 0; i < numPoints; i++)
  {
      let dst = i / (amount - 1);
      let angle = 2 * Math.PI * turnFraction * i;
      if(randomSeedMax > 1)
       randomSeedMax -= 0.0001;
      baseVertex.x = dst * Math.cos(angle) * radius;
      baseVertex.z = dst * Math.sin(angle) * radius;

      for(let x = 0; x<randomSeedMax; x++)
      {
          vertex.x = baseVertex.x + positions[i];
          vertex.y = baseVertex.y + positions[i + 1];
          vertex.z = baseVertex.z + positions[i + 2];
          vertex.toArray( positions, i * 3 );
      }
      if(i < 0.8 * amount)
      {
        lerpedColor.lerpColors(yellow, blau, counterforhex += i  * 0.000001);
        lerpedColor.toArray( colors, i * 3 );
        szmod = 30;
        sizes[ i ] =  30;  
      }
      else  if(i % 4 == 0 )
      {
          sizes[ i ] =  30;  
          color1c.toArray(colors , i * 3);
      }
      else
      {
        lerpedColor.lerpColors(blau, dblue,  c2 += i  * 0.0000001);
        lerpedColor.toArray( colors, i * 3 );
        sizes[ i ] =  30; 
      }
       
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

init_point_boid(stars, numPoints, turnFraction -= 0.00000001);
console.log(stars);
function animate() {
    //boid(stars, numPoints, turnFraction += 0.000001);
    //console.clear();
    //console.log(turnFraction);
    move_point_boid(stars, numPoints, turnFraction -= 0.0000001);
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    
    // model.position.x = Math.sin(xpos += 0.01) * 15;
    // model.position.z = Math.cos(xpos) * 15;
    //model.position.y = Math.sin(xpos * 4);
};


