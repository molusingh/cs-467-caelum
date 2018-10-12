function playerControls(scene, clock, duck) {

    var currentState = playerState.init;

    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}