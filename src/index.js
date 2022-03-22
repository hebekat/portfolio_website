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


const sloader = new THREE.CubeTextureLoader();

const stexture = sloader.load([
  "dist/space/darkspace/image_part_003.jpg",
  "dist/space/darkspace/image_part_005.jpg",
  "dist/space/darkspace/image_part_006.jpg",
  "dist/space/darkspace/image_part_007.jpg",
  "dist/space/darkspace/image_part_008.jpg",
  "dist/space/darkspace/image_part_011.jpg",
]);

scene.background = stexture;

let turnFraction = 0.26;
let baseCoords = 300;
let randomSeedMax = 20;
let totalAmount = baseCoords * randomSeedMax;
let radius = 300;
let numPoints = baseCoords * randomSeedMax;

var base_positions = new Float32Array( numPoints * 2);

function initPoints() {

  var geometry = new THREE.BufferGeometry();
  geometry = move_point_boid(geometry, 0.005);
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
  let sphere = new THREE.Points( geometry,material );
  scene.add( sphere );
  return(geometry);
}
const baseVertex = new THREE.Vector3();

let randomCoords = new Float32Array( baseCoords * 3 );
let basis = new THREE.Vector3();
for(let i = 0; i < randomSeedMax; i++)
{
  basis.x = Math.random() * -3;
  basis.y = Math.random() * 5;
  basis.z = Math.random() * -3;
  basis.toArray(randomCoords, i * 3);
}

function move_point_boid(geometry, turnFraction)
{
  //400 * 20max
  var positions = new Float32Array( totalAmount * 3 );
  const colors = new Float32Array( totalAmount * 3 );
  const sizes = new Float32Array( totalAmount );
  var szmod  = 15;
  const vertex = new THREE.Vector3();
  const blau = new THREE.Color(0xAFeFcF);
  const color1c = new THREE.Color(0xece8a);
  const yellowc = new THREE.Color(0xFFFF00);
  const yellow = new THREE.Color(0xFFFF00);
  const dblue = new THREE.Color(0x00008B);
  const lightblue = new THREE.Color(0xD7FCF7);
  const lerpedColor = new THREE.Color();
  let counterforhex = 0;
  let c2 = 0;

  for (let i = 0; i < baseCoords; i++)
  {
      let dst = i / (baseCoords - 1);
      let angle = 2 * Math.PI * turnFraction * i;

      baseVertex.x = dst * Math.cos(angle) * radius * 1.3;
      baseVertex.y = 0.1;
      baseVertex.z = dst * Math.sin(angle) * radius * 1.3;
      let rdcounter = 0;
      for(let x = 0; x<randomSeedMax; x++)
      {
          vertex.x = baseVertex.x - randomCoords[rdcounter];
          vertex.y = baseVertex.y - randomCoords[rdcounter + 1];
          vertex.z = baseVertex.z - randomCoords[rdcounter + 2];
          rdcounter += 3;
          vertex.toArray( positions, i * 3 );
          if(i % 20 == 0 )
          {
              sizes[ i ] =  90;  
              color1c.toArray(colors , i * 3);
          }
          else  if(i % 10 == 0 )
          {
              sizes[ i ] =  100;  
              yellowc.toArray(colors , i * 3);
          }
          else if(i < 0.8 * totalAmount)
          {
            lerpedColor.lerpColors(yellow, dblue, counterforhex += i  * 0.000002);
            lerpedColor.toArray( colors, i * 3 );
            szmod = 30;
            sizes[ i ] =  i % 90;  
          }
          else
          {
            //lerpedColor.lerpColors(0xFFFFFF, dblue,  i/0.1 );
            lightblue.toArray( colors, i * 3 );
            sizes[ i ] =  60; 
          }
          geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
          geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
          geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
          geometry.verticesNeedUpdate = true;
       }
       geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
          geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
          geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
          geometry.verticesNeedUpdate = true;
  }
  return(geometry);

}

let stars = initPoints();
stars.name = 'stars';


$("#baseslider").on("change",function(){
  baseCoords = $(this).val();
  totalAmount = baseCoords * randomSeedMax;
  console.log(baseCoords,randomSeedMax, totalAmount, radius);
});

$("#randomMaxSlider").on("change",function(){
  randomSeedMax = $(this).val();
  totalAmount = baseCoords * randomSeedMax;
  console.log(baseCoords,randomSeedMax, totalAmount, radius);
});

$("#radiusSlider").on("change",function(){
  radius = $(this).val();
  console.log(baseCoords,randomSeedMax, totalAmount, radius);
});

animate();

function animate() {
    stars = move_point_boid(stars,  turnFraction += 0.00001);
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};


