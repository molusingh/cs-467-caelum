function foxAI(scene, clock, fox) {

    var currentState = foxState.init;

    //must report all enum states
    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}