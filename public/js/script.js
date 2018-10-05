var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ canvas: $("#app")[0], antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;


$("#menuButton").click(turnOnMenu);
var menuStatus = true;

function turnOnMenu()
{
 menuStatus = !menuStatus;
 if (menuStatus)
 {
  $("#menu").show();
  return;
 }
 $("#menu").hide();


}

function animate()
{
 requestAnimationFrame(animate);

 cube.rotation.x += 0.01;
 cube.rotation.y += 0.01;
 renderer.setSize(window.innerWidth, window.innerHeight);

 renderer.render(scene, camera);
};


requestAnimationFrame(animate);
