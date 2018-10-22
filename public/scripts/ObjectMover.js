function ObjectMover(object)
{
	ObjectMover.prototype.up = up;
	ObjectMover.prototype.down = down;
	ObjectMover.prototype.left = left;
	ObjectMover.prototype.right = right;

	function up()
	{
		object.position.x -= 10;
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
		object.position.z += 10;
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
		object.position.x += 10;
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
		object.position.z -= 10;
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
