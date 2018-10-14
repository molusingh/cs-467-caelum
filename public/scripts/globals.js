// ENUMS

//Note: these are 'external states', internal representations can have more

var gameState = { "start": 1, "level": 2, "boosts": 3, "win": 4, "lose": 5 };
Object.freeze(gameState);

var levelState = { "init": 1, "ready": 2, "play": 3, "end": 4 };
Object.freeze(levelState);

var playerState = { "init": 1, "ready": 2, "alive": 3, "dead": 4 };
Object.freeze(playerState);

var ducklingState = { "init": 1, "ready": 2, "egg": 3, "duckling": 4, "dead": 5 };
Object.freeze(playerState);

var hawkState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(playerState);

var croqState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(playerState);

var foxState = { "init": 1, "ready": 2, "alive": 3, "stun": 4 };
Object.freeze(playerState);

// CONSTANTS

var motionUnit = 1.0;


var mover = new ObjectMover();

function ObjectMover()
{
	ObjectMover.prototype.moveUp = moveUp;
	ObjectMover.prototype.moveDown = moveDown;
	ObjectMover.prototype.moveLeft = moveLeft;
	ObjectMover.prototype.moveRight = moveRight;
	function moveUp(object)
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
	
	function moveLeft(object)
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
	
	function moveDown(object)
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
	
	function moveRight(object)
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
