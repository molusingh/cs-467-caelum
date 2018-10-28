function ObjectMover(object)
{
	var maxPosition = 185;
	var duckFlightHeight = 20;
	var hawkFlightHeight = 35;
	ObjectMover.prototype.up = up;
	ObjectMover.prototype.down = down;
	ObjectMover.prototype.left = left;
	ObjectMover.prototype.right = right;
	ObjectMover.prototype.flyToggle = flyToggle;

	function up()
	{
		if (object.position.x >= -maxPosition) // if within bounds
		{
			object.position.x -= 10;
		}
		switch (object.userData.currentDirection)
		{
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

	function left()
	{
		if (object.position.z <= maxPosition) // if within bounds
		{
			object.position.z += 10;
		}

		switch (object.userData.currentDirection)
		{
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

	function down()
	{
		if (object.position.x <= maxPosition) // if within bounds
		{
			object.position.x += 10;
		}

		switch (object.userData.currentDirection)
		{
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

	function right()
	{
		if (object.position.z >= -maxPosition) // if within bounds
		{
			object.position.z -= 10;
		}

		switch (object.userData.currentDirection)
		{
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

	function flyToggle()
	{
		if (object.userData.inAir == true)
		{
			if (object.name == "duck")
			{
				object.position.y -= duckFlightHeight;
			}
			else if (object.name == "hawk")
			{
				object.position.y -= hawkFlightHeight;
			}

			object.userData.inAir = false;
		}
		else
		{
			if (object.name == "duck")
			{
				object.position.y += duckFlightHeight;
			}
			else if (object.name == "hawk")
			{
				object.position.y += hawkFlightHeight;
			}

			object.userData.inAir = true;
		}
	}

	function isLegalMove(object)
	{
		var inWater = object.userData.inWater;
		var inAir = object.userData.inAir;
		var objectType = object.name;

		if (inAir)
		{
			return true;
		}
	}
}
