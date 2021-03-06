/* global bus*/
/* global grid*/
function ObjectMover(object, isDuck) {
	var maxPosition = 185;
	var duckFlightHeight = 20;
	var hawkFlightHeight = 35;
	this.up = up;
	this.rotateUp = rotateUp;
	this.down = down;
	this.rotateDown = rotateDown;
	this.left = left;
	this.rotateLeft = rotateLeft
	this.right = right;
	this.rotateRight = rotateRight;
	this.flyToggle = flyToggle;
	this.updateCam = updateCam;

	function updateCam() {
		if (!isDuck)
			return;
		var pos = new THREE.Vector3(object.position.x, object.position.y, object.position.z);
		bus.publish("updateCam", pos);
	}

	function up() {
		rotateUp();
		if (object.position.x >= -maxPosition) // if within bounds
		{
			object.position.x -= 10;
			grid.updateActor(object);
			updateCam();
		}
	}

	function rotateUp() {
		switch (object.userData.currentDirection) {
			case 'left':
				object.rotateY(-(Math.PI / 2));
				break;
			case 'down':
				object.rotateY(Math.PI);
				break;
			case 'right':
				object.rotateY(Math.PI / 2);
				break;
		}
		object.userData.currentDirection = 'up';
	}

	function left() {
		rotateLeft();
		if (object.position.z <= maxPosition) // if within bounds
		{
			object.position.z += 10;
			grid.updateActor(object);
			updateCam();
		}
	}

	function rotateLeft() {
		switch (object.userData.currentDirection) {
			case 'down':
				object.rotateY(-(Math.PI / 2));
				break;
			case 'right':
				object.rotateY(Math.PI);
				break;
			case 'up':
				object.rotateY(Math.PI / 2);
				break;
		}
		object.userData.currentDirection = 'left';
	}

	function down() {
		rotateDown();
		if (object.position.x <= maxPosition) // if within bounds
		{
			object.position.x += 10;
			grid.updateActor(object);
			updateCam();
		}
	}

	function rotateDown() {
		switch (object.userData.currentDirection) {
			case 'right':
				object.rotateY(-(Math.PI / 2));
				break;
			case 'up':
				object.rotateY(Math.PI);
				break;
			case 'left':
				object.rotateY(Math.PI / 2);
				break;
		}
		object.userData.currentDirection = 'down';
	}

	function right() {
		rotateRight();
		if (object.position.z >= -maxPosition) // if within bounds
		{
			object.position.z -= 10;
			grid.updateActor(object);
			updateCam();
		}
	}

	function rotateRight() {
		switch (object.userData.currentDirection) {
			case 'up':
				object.rotateY(-(Math.PI / 2));
				break;
			case 'left':
				object.rotateY(Math.PI);
				break;
			case 'down':
				object.rotateY(Math.PI / 2);
				break;
		}
		object.userData.currentDirection = 'right';
	}

	function flyToggle() {
		var point = {};
		point.z = object.position.z;
		point.x = object.position.x;
		var belowObject = grid.getActorObject(point, object);
		var currentSquareInfo = grid.getEnvOnlyInfo(point.z, point.x);

		// landing
		if (object.userData.inAir == true) {
			// can't land on obstacle (3) or egg (9)
			if (currentSquareInfo != componentType.obstacle && (belowObject == null || belowObject.userData.componentType != componentType.egg)) {

				object.position.y -= duckFlightHeight;

				// if we land in water, toggle flag
				if (currentSquareInfo == componentType.water) {
					object.userData.inWater = true;
				}
				bus.publish("flySound");
				object.userData.inAir = false;

				if (belowObject != null && belowObject.userData.componentType == componentType.stick) {
					bus.publish("foundStick", belowObject);
				}
			}
		}

		// takeoff
		else {
			object.position.y += duckFlightHeight;
			object.userData.inAir = true;
			// if we take off from water, toggle flag
			if (currentSquareInfo == 2) {
				object.userData.inWater = false;
			}
			bus.publish("flySound");
		}
	}
}