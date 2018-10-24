/* global UserInterface*/
/* global gameState*/
/* global levelState*/
/* global levelAI*/
/* global bus*/

/*
 * Constructor for a gameAI object
 */
function gameAI(scene, clock)
{

    // public functions
    this.getState = getState;
    this.update = update;

    // private
    var totalLevels = 10; // # of levels in the game
    var currentState = gameState.start;
    var currentLevelDifficulty = 1; // not sure what determines this
    var currentLevel = 1;
    var gameScore = 0; // user score 
    var gameOn = false; // whether game is currently running
    var interface = new UserInterface(); // acivate user interface
    var level = null; // AI for the level, created when game starts
    setupSubscriptions();

    /*
     * sets up the game AI's subscriptions to the event bus
     */
    function setupSubscriptions()
    {
        bus.subscribe("start", startLevel);
        bus.subscribe("openMenu", toggleGame);
        bus.subscribe("closeMenu", toggleGame);
        bus.subscribe("playerLoses", toggleGame); // player loses in the levelAI, so levelAI will publish loss
        bus.subscribe("endPickBoosts", startLevel); // starts next level after done picking boosts
    }

    /*
     * flips the gameOn flag
     */
    function toggleGame()
    {
        gameOn = !gameOn;
    }

    /*
     * starts a new level
     */
    function startLevel()
    {
        gameOn = true;
        // currentState = gameState.level;
        level = new levelAI(scene, clock, currentLevel, currentLevelDifficulty);
    }

    /*
     * Ends the current level and enters boost screen
     */
    function finishLevel()
    {
        level = null;
        gameOn = false;

        ++currentLevel;
        ++currentLevelDifficulty; // TODO:
        if (currentLevel > totalLevels) // if completed last level, player wins
        {
            bus.publish("playerWins", gameScore);
            currentState = gameState.win;
        }
        else // move to boosts
        {
            currentState = gameState.boosts;
            bus.publish("pickBoosts", gameScore);
        }
    }

    /*
     * public function returns current game State
     */
    function getState()
    {
        return currentState;
    }

    /*
     * Update function called routinely
     */
    function update()
    {
        var elapsedTime = clock.getElapsedTime();

        if (!gameOn)
        {
            return;
        }

        //temp, needs to be inside conditionals
        // level.update();

        if (currentState === gameState.level)
        {
            switch (level.getState())
            {
                case levelState.play:
                    level.update();
                    break;
                case levelState.end:
                    finishLevel();
                    break;
                default:
                    break;
            }
        }
        else if (currentState === gameState.boosts) {} // TODO: Anmol: what should be here? Doesn't userinterface handle this?
    }
}
