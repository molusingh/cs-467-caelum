function croqAI(scene, clock, croq) {

    var currentState = croq.State.init;

    //must report all enum states
    this.getState = function () {

        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

    }
}