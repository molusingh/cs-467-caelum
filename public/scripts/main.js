(function () {
  var clock = new THREE.Clock();

  var screenDimensions = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // Core Settings
  setFrameSize();
  var container = buildContainer();
  var scene = buildScene();
  var renderer = buildRender(screenDimensions);
  var camera = buildCamera(screenDimensions);
  var entities = createEngineEntities(scene);
  var light = buildLight();
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);
  var debug = addDebugger();
  var pan = addPanControls();
  addScreenChangeHandler(300, "orientationchange");
  addScreenChangeHandler(0, "resize");
  //temp
  addFPOGeo();
  addFullScreenControls();
  addHelpers();
  updateEngine();
  var fullScreen = false;

  function addDebugger() {
    if (!document.getElementById('debug')) {
      var container = document.createElement("div");
      document.body.appendChild(container);
      return debug;
    }
    else {
      return document.getElementById('debug');
    }
  }

  function addHelpers() {
    var dirLightHelper = new THREE.DirectionalLightHelper(light, 5, 0x444444);
    scene.add(dirLightHelper);

    var gridHelper = new THREE.GridHelper(400, 40, 0x444444, 0x808080);
    gridHelper.position.y = 0;
    gridHelper.position.x = 0;
    scene.add(gridHelper);

    scene.add(new THREE.AxesHelper(20));

    var shadowHelper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(shadowHelper);
  }

  function addFPOGeo() {

    var shadowMat = new THREE.ShadowMaterial({
      color: 0xff0000, transparent: true, opacity: 0.5
    });

    var loader = new THREE.FBXLoader();
    loader.load('../geo/envFPO.fbx', function (object) {
      object.traverse(function (child) {

        if (child instanceof THREE.Mesh) {
          //child.scale.x = 10;
          child.castShadow = true;
          child.receiveShadow = true;
          child.shadowMaterial = shadowMat;
        }

      });
      object.scale.x = 100;
      object.scale.y = 100;
      object.scale.z = 100;
      object.castShadow = true;
      object.receiveShadow = true;
      scene.add(object);
    });

    /*
    var loader = new THREE.FBXLoader();
    loader.load('../geo/cube.fbx', function (object) {
      object.traverse(function (child) {

        if (child instanceof THREE.Mesh) {
          //child.scale.x = 10;
        }

      });
      object.scale.x = 100;
      object.scale.y = 100;
      object.scale.z = 100;
      object.castShadow = true;
      object.receiveShadow = true;
      scene.add(object);
    });
    */

    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    var diffuseColor = new THREE.Color().setHSL(0.5, 0.5, 1 * 0.5 + 0.1);
    var material = new THREE.MeshLambertMaterial({
      color: diffuseColor,
    });

    var mesh = new THREE.Mesh(geometry, material, shadowMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    var geometry2 = new THREE.BoxBufferGeometry(20, 20, 20);

    var diffuseColor2 = new THREE.Color().setHSL(0.9, 0.5, 1 * 0.5 + 0.1);
    var material2 = new THREE.MeshLambertMaterial({
      color: diffuseColor2,
    });

    var mesh2 = new THREE.Mesh(geometry2, material2, shadowMat);
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;
    mesh2.position.x = -20;
    mesh2.position.y = -5;
    scene.add(mesh2);

  }

  function addFullScreenControls() {
    if (document.getElementById("fullScreenButton")) {
      var fullScreenButton = document.getElementById("fullScreenButton");
      fullScreenButton.onclick = function () {
        showFullScreen();
      };
    }
    else {
      console.log("full screen disabled");
    }
  }

  function buildLight() {
    var light = new THREE.DirectionalLight(0xffffff, 1, 100);
    light.position.set(100, 200, 150);
    light.castShadow = true;
    light.shadowCameraVisible = true;
    scene.add(light);

    light.shadow.camera.top = 250;
    light.shadow.camera.bottom = -250;
    light.shadow.camera.left = -250;
    light.shadow.camera.right = 250;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    return light;
  }

  function addPanControls() {
    var pan = new THREE.MapControls(camera, renderer.domElement);

    pan.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    pan.dampingFactor = 0.25;

    pan.screenSpacePanning = false;

    pan.minDistance = 100;
    pan.maxDistance = 1000;

    pan.maxPolarAngle = Math.PI / 2;

    return pan;
  }

  function setFrameSize() {
    //check mobile/desktop
    //check portrait/landscape

    //if we're inside a frame, set frame size
    if (window.frameElement) {
      window.frameElement.style.height = "300px";
    }
  }

  function buildContainer() {
    var container = document.createElement("div");
    document.body.appendChild(container);
    return container;
  }

  function buildScene() {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color("#fff");
    return scene;
  }

  function buildRender({ width, height }) {
    var renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    var DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    return renderer;
  }

  function buildCamera({ width, height }) {
    var aspectRatio = width / height;
    //var fieldOfView = 20;
    //var fieldOfView = 70;
    var fieldOfView = 50;
    var nearPlane = 0.25;
    //var farPlane = 600;
    //var farPlane = 200;
    var farPlane = 400;
    var camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    //camera.position.set(20, 500, 0);
    camera.position.set(20, 150, 0);

    return camera;
  }

  function createEngineEntities() {
    //var engineEntities = [new controls(scene, renderer)];
    var engineEntities;

    return engineEntities;
  }

  function showFullScreen() {
    if (!fullScreen) {
      //not embeded as an iframe
      var elem = document.documentElement;

      //embeded in an iframe
      if (window.frameElement) {
        elem = window.frameElement;
      }
      //is parent doc
      else {
        elem = document.documentElement;
      }

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        //Firefox
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
        //Chrome, Safari and Opera
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
        //IE/Edge
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      fullScreen = true;
    } else {
      elem = window.parent.document;

      if (elem.exitFullscreen) {
        elem.exitFullscreen();
        //Firefox
      } else if (elem.mozCancelFullScreen) {
        elem.mozCancelFullScreen();
        //Chrome, Safari and Opera
      } else if (elem.webkitExitFullscreen) {
        elem.webkitExitFullscreen();
        //IE/Edge
      } else if (elem.msExitFullscreen) {
        elem.msExitFullscreen();
      }
      fullScreen = false;
    }
  }

  function addScreenChangeHandler(delay, eventType) {
    window.addEventListener(
      eventType,
      function (e) {
        setTimeout(function () {
          resizeCanvas();
        }, delay);
      },
      false
    );
  }

  function resizeCanvas() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (debug) {
      debug.innerHTML =
        "width: " + window.innerWidth + " height: " + window.innerHeight;
    }
  }

  function updateEngine() {
    requestAnimationFrame(updateEngine);
    var elapsedTime = clock.getElapsedTime();

    //for (var i = 0; i < entities.length; i++) entities[i].update(elapsedTime, scene, renderer);

    //TO DO: 1.limit horiz + vert pan 2. adjust portrait zoom for mobile
    //console.log("CAM: " + camera.position.x);
    //if camera.position.x > then...
    pan.update();

    renderer.render(scene, camera);
  }
})();