function hawkAI(scene, clock, hawk) {

    var currentState = hawkState.init;

    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}