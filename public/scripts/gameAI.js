function gameAI(scene, clock) {

    // private

    var currentState 
    var currentLevel, currentLevelDifficulty, gameScore;
    var level, interface;

    interface = new userInterface();
    startLevel();
    setupSubscriptions();
    currentState = gameState.start;

    function setupSubscriptions() {
        //ex.listen for start button
    }

    function setState(state) {
        currentState = state;
    }

    function finishLevel() {
    }

    function startLevel() {
        level = new levelAI(scene, clock, currentLevel, currentLevelDifficulty);
    }

    // public

    this.getState = function(){
        return currentState;
    }

    this.update = function () {

        var elapsedTime = clock.getElapsedTime();

        if (currentState === gameState.level) {
            switch (level.getState()) {
                case levelState.play:
                    level.update();
                    break;
                case levelState.finished:
                    finishLevel();
                    break;
                default:
                    break;
            }
        }
        else if (currentState === gameState.boosts) {
        }
    }
}