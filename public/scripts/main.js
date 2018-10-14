(function () {
  var clock = new THREE.Clock();

  var screenDimensions = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // Initial init 
  setFrameSize();
  var container = buildContainer();
  console.log(container);
  var scene = buildScene();
  var renderer = buildRender(screenDimensions);
  var camera = buildCamera(screenDimensions);
  var light = buildLight();
  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);
  // var debug = addDebugger();
  var pan = addPanControls();
  var limit = createLimit();
  addScreenChangeHandler(300, "orientationchange");
  addScreenChangeHandler(0, "resize");
  addFullScreenControls();
  addHelpers();
  var game = new gameAI(scene, clock);
  update();
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

    pan.minDistance = 150;
    pan.maxDistance = 150;

    pan.enableZoom = false;
    pan.enableRotate = false;

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
    /*
    if (debug) {
      debug.innerHTML =
        "width: " + window.innerWidth + " height: " + window.innerHeight;
    }
    */
  }

  /* resuse for AI
  function checkPanLimits(limitObject) {
    var frustum = new THREE.Frustum();
    var cameraViewProjectionMatrix = new THREE.Matrix4();

    // every time the camera or objects change position (or every frame)

    camera.updateMatrixWorld(); // make sure the camera matrix is updated
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);

    // frustum is now ready to check all the objects you need
    console.log("limit visible: " + frustum.intersectsObject(limitObject));
    return frustum.intersectsObject(limitObject);
  }


  function createLimit() {
    var geometry2 = new THREE.BoxBufferGeometry(20, 20, 20);

    var diffuseColor2 = new THREE.Color().setHSL(0.9, 0.5, 1 * 0.5 + 0.1);
    var material2 = new THREE.MeshLambertMaterial({
      color: diffuseColor2,
    });

    var mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;
    mesh2.position.x = -210;
    mesh2.position.y = -5;
    scene.add(mesh2);
    return mesh2;
  }
  */

  function update() {
    requestAnimationFrame(update);
    var elapsedTime = clock.getElapsedTime();

    game.update();
    pan.update();

    renderer.render(scene, camera);
  }
})();
