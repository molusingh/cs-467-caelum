function ObjectMover(object)
{
	var maxPosition = 185;
	ObjectMover.prototype.up = up;
	ObjectMover.prototype.down = down;
	ObjectMover.prototype.left = left;
	ObjectMover.prototype.right = right;

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
}
