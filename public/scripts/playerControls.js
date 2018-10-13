function playerControls(scene, clock, duck) {

    var currentState = playerState.init;

    document.addEventListener('keydown', onKeyDown);

    this.getState = function () {

        return currentState;
    };

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    };

	function onKeyDown(event) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ duck.position.x -= 10; break;

			case 37: /*left*/
			case 65: /*A*/ duck.position.z += 10; break;

			case 40: /*down*/
			case 83: /*S*/ duck.position.x += 10; break;

			case 39: /*right*/
			case 68: /*D*/ duck.position.z -= 10; break;

			case 82: /*R*/ moveUp = true; break;
			case 70: /*F*/ moveDown = true; break;

		}

	}

}