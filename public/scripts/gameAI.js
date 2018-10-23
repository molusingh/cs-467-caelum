/* global UserInterface*/
/* global gameState*/
/* global levelAI*/

/*
 * Constructor for a gameAI object
 */
function gameAI(scene, clock)
{
    
    // public functions
    this.getState = getState;
    this.update = update;

    // private
    var currentLevel;
    var currentLevelDifficulty = 1;
    var gameScore;
    var level;
    var interface = new UserInterface();
    startLevel();
    setupSubscriptions();
    var currentState = gameState.start;

    function setupSubscriptions()
    {
        //ex.listen for start button
    }

    function setState(state)
    {
        currentState = state;
    }

    function finishLevel() {}

    function startLevel()
    {
        level = new levelAI(scene, clock, currentLevel, currentLevelDifficulty);
    }



    function getState()
    {
        return currentState;
    }

    function update()
    {
        var elapsedTime = clock.getElapsedTime();

        //temp, needs to be inside conditionals
        level.update();

        if (currentState === gameState.level)
        {
            switch (level.getState())
            {
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
        else if (currentState === gameState.boosts) {}
    }
}
