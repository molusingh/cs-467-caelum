function playerControls(scene, clock, duck) {

    var currentState = playerState.init;

    document.addEventListener('keydown', onKeyDown);

console.log('Current direction is ' + duck.userData.currentDirection);

    this.getState = function () {

        return currentState;
    };

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    };

	function onKeyDown(event) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ duck.position.x -= 10;
					if (duck.userData.currentDirection != 'up') {
						if (duck.userData.currentDirection == 'left') {duck.rotateY(-(Math.PI / 2));}
						else if (duck.userData.currentDirection == 'down') {duck.rotateY(Math.PI);}
						else if (duck.userData.currentDirection == 'right') {duck.rotateY(Math.PI / 2);}
						duck.userData.currentDirection = 'up';
						console.log('Current direction is ' + duck.userData.currentDirection);
					}
			break;

			case 37: /*left*/
			case 65: /*A*/ duck.position.z += 10;
					if (duck.userData.currentDirection != 'left') {
						if (duck.userData.currentDirection == 'down') {duck.rotateY(-(Math.PI / 2));}
						else if (duck.userData.currentDirection == 'right') {duck.rotateY(Math.PI);}
						else if (duck.userData.currentDirection == 'up') {duck.rotateY(Math.PI / 2);}
						duck.userData.currentDirection = 'left';
						console.log('Current direction is ' + duck.userData.currentDirection);
					}
			break;

			case 40: /*down*/
			case 83: /*S*/ duck.position.x += 10;
					if (duck.userData.currentDirection != 'down') {
						if (duck.userData.currentDirection == 'right') {duck.rotateY(-(Math.PI / 2));}
						else if (duck.userData.currentDirection == 'up') {duck.rotateY(Math.PI);}
						else if (duck.userData.currentDirection == 'left') {duck.rotateY(Math.PI / 2);}
						duck.userData.currentDirection = 'down';
						console.log('Current direction is ' + duck.userData.currentDirection);
					}
			break;

			case 39: /*right*/
			case 68: /*D*/ duck.position.z -= 10;
					if (duck.userData.currentDirection != 'right') {
						if (duck.userData.currentDirection == 'up') {duck.rotateY(-(Math.PI / 2));}
						else if (duck.userData.currentDirection == 'left') {duck.rotateY(Math.PI);}
						else if (duck.userData.currentDirection == 'down') {duck.rotateY(Math.PI / 2);}
						duck.userData.currentDirection = 'right';
						console.log('Current direction is ' + duck.userData.currentDirection);
					}
			break;

			case 82: /*R*/ moveUp = true; break;
			case 70: /*F*/ moveDown = true; break;

		}

	}

}