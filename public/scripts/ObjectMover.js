function ObjectMover(object) {
	var maxPosition = 185;
	var duckFlightHeight = 20;
	var hawkFlightHeight = 35;
	ObjectMover.prototype.up = up;
	ObjectMover.prototype.rotateUp = rotateUp;
	ObjectMover.prototype.down = down;
	ObjectMover.prototype.rotateDown = rotateDown;
	ObjectMover.prototype.left = left;
	ObjectMover.prototype.rotateLeft = rotateLeft;
	ObjectMover.prototype.right = right;
	ObjectMover.prototype.rotateRight = rotateRight;
	ObjectMover.prototype.flyToggle = flyToggle;

	function up() {
		if (object.position.x >= -maxPosition) // if within bounds
		{
			object.position.x -= 10;
			grid.updateActor(object);
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
		if (object.position.z <= maxPosition) // if within bounds
		{
			object.position.z += 10;
			grid.updateActor(object);
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
		if (object.position.x <= maxPosition) // if within bounds
		{
			object.position.x += 10;
			grid.updateActor(object);
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
		if (object.position.z >= -maxPosition) // if within bounds
		{
			object.position.z -= 10;
			grid.updateActor(object);
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
		var currentSquareInfo;
		currentSquareInfo = grid.getEnvInfo(object.position.z, object.position.x);

		// landing
		if (object.userData.inAir == true) {
			// duck landing logic
			if (object.name == "duck") {
				// can't land on obstacle (3), fox (4), hawk (5), croq (6), or egg (9)
				if (currentSquareInfo != 3 && currentSquareInfo != 4 && currentSquareInfo != 5 && currentSquareInfo != 6 && currentSquareInfo != 9) {
					object.position.y -= duckFlightHeight;
					// if we land in water, toggle flag
					if (currentSquareInfo == 2) {
						object.userData.inWater = true;
					}
					bus.publish("flySound");
					object.userData.inAir = false;
				}

			}
			else if (object.name == "hawk") {
				object.position.y -= hawkFlightHeight;
			}
			updateActor(object);
		}
		// takeoff
		else {
			if (object.name == "duck") {
				object.position.y += duckFlightHeight;
				// if we take off from water, toggle flag
				if (currentSquareInfo == 2) {
					object.userData.inWater = false;
				}
				bus.publish("flySound");
			}
			else if (object.name == "hawk") {
				object.position.y += hawkFlightHeight;
			}

			object.userData.inAir = true;
		}
	}
}
