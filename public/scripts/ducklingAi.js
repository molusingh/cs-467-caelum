function ducklingAI(scene, clock, hawk) {

    var currentState = hawkState.init;

    //must report all enum states
    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}