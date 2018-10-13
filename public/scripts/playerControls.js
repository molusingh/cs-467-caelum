function playerControls(scene, clock, duck) {

    var currentState = playerState.init;

    document.addEventListener('keydown', (event) => {
        //this will pop an alert if CTRL is pressed
        if (event.keyCode == 17) {
            console.log("right");
            duck.position.z -= 10;
        }
        else if (event.keyCode == 16) {
            console.log("left");
            duck.position.z += 10;
        }
    });

    console.log("pc: " + duck.name);

    /*
    duck.position.x = -125;
    duck.position.z = -25;
    duck.position.y = 0;
    */

    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}