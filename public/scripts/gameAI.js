/* global UserInterface*/
/* global gameState*/
/* global levelState*/
/* global levelAI*/
/* global bus*/
/* global $*/

/*
 * Constructor for a gameAI object
 */
function gameAI(scene, clock) {

    // public functions
    this.getState = getState;
    this.update = update;

    // private variables
    var totalLevels = 10; // # of levels in the game
    var currentState = gameState.start;
    var currentLevelDifficulty = 1; // not sure what determines this
    var currentLevel = 1;
    var score = 0; // user score 
    var points = score; // points to spend on skills
    var maxSkillLevel = 3;
    var quackLevel = 0;
    var speedLevel = 0;
    var invisibilityLevel = 0;
    var quackCost = 10;
    var speedCost = 10;
    var invisibilityCost = 10;



    // activate levelAI, userinterface, setupSubscriptions
    new UserInterface(); // acivate user interface
    var level = new levelAI(scene); // AI for the level, created when game starts
    setupSubscriptions();

    /*
     * sets up the game AI's subscriptions to the event bus
     */
    function setupSubscriptions() {
        bus.subscribe("start", startLevel);
        bus.subscribe("openMenu", pauseGame);
        bus.subscribe("closeMenu", continueGame);
        bus.subscribe("pickBoosts", updateBoostsScreen);
        bus.subscribe("endPickBoosts", startLevel); // starts next level after done picking boosts

        bus.subscribe("invisiblityUpgrade", upgradeInvisibility);
        bus.subscribe("speedUpgrade", upgradeSpeed);
        bus.subscribe("quackUpgrade", upgradeQuack);
    }

    /*
     * Upgrades quack level
     */
    function upgradeQuack() {
        if (points < quackCost || quackLevel >= maxSkillLevel) {
            return;
        }
        points -= quackCost;
        ++quackLevel;
    }

    /*
     * Upgrades speed level
     */
    function upgradeSpeed() {
        if (points < speedCost || speedLevel >= maxSkillLevel) {
            return;
        }
        points -= speedCost;
        ++speedLevel;
    }

    /*
     * Upgrade invisibility level
     */
    function upgradeInvisibility() {
        if (points < invisibilityCost || invisibilityLevel >= maxSkillLevel) {
            return;
        }
        points -= invisibilityCost;
        ++invisibilityLevel;
    }


    /*
     * starts a new level
     */
    function startLevel() {
        if (level.getState() !== levelState.ready) {
            //show loading screen
        }
        currentState = gameState.level;
    }

    function sendSettings() {
        level.updateSettings(
            {
                level: currentLevel,
                invisibilityLevel: invisibilityLevel,
                speedLevel: speedLevel,
                quackLevel: quackLevel
            }
        );
    }


    function continueGame() {
        level.setState(levelState.continue);
    }

    function pauseGame() {
        level.setState(levelState.pause);
    }

    function resetGame() {

        currentLevel = 1;
        score = 0; // user score 
        points = 0; // points to spend on skills
        quackLevel = 0;
        speedLevel = 0;
        invisibilityLevel = 0;
        bus.publish("playerLoses");
        currentState = gameState.loss;
    }

    /*
     * Ends the current level and enters boost screen
     */
    function finishLevel() {
        console.log("got to FINISH");
        ++currentLevel;
        if (currentLevel > totalLevels) // if completed last level, player wins
        {
            bus.publish("playerWins", score);
            currentState = gameState.win;
        }
        else // move to boosts
        {
            bus.publish("pickBoosts");
            currentState = gameState.boosts;
        }
    }

    /*
     * Upgrades boosts screen with current data
     */
    function updateBoostsScreen() {
        $('#pointsOutput').text(points);
        $('#quackLevelOutput').text(quackLevel);
        $('#speedLevelOutput').text(speedLevel);
        $('#invisibilityLevelOutput').text(invisibilityLevel);
        $('#quackCostOutput').text(quackCost);
        $('#speedCostOutput').text(speedCost);
        $('#invisibilityCostOutput').text(invisibilityCost);
    }

    /*
     * public function returns current game State
     */
    function getState() {
        return currentState;
    }

    /*
     * Update function called routinely
     */
    function update() {
        var elapsedTime = clock.getElapsedTime();
        $('#scoreOutput').text(score);
        $('#levelOutput').text(currentLevel);

        console.log("gameState:" + currentState);

        if (currentState === gameState.level) {
            level.update();
            switch (level.getState()) {
                case levelState.preGame:
                    sendSettings();
                    console.log("before BUILD");
                    level.setState(levelState.build);
                    break;
                case levelState.ready:
                    //hide loading screen
                    level.setState(levelState.play);
                    break;
                case levelState.end:
                    finishLevel();
                    level.setState(levelState.preGame);
                    break;
                case levelState.loss:
                    resetGame();
                    level.setState(levelState.preGame);
                    break;
                default:
                    break;
            }
        }
    }
}
