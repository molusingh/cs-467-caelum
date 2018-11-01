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
    var gameOn = false; // whether game is currently running
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
        bus.subscribe("playerLoses", resetGame); // player loses in the levelAI, so levelAI will publish loss
        bus.subscribe("levelEnd", finishLevel); // player completes level, levelAI publishes end
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
        level.updateSettings(
            {
                level: currentLevel,
                invisibilityLevel: invisibilityLevel,
                speedLevel: speedLevel,
                quackLevel: quackLevel
            }
        );
        level.setState(levelState.new);
        currentState = gameState.level;
    }


    function continueGame() {
        level.setState(levelState.continue);
    }

    function pauseGame() {
        level.setState(levelState.pause);
    }

    /*
     * Ends the current level and enters boost screen
     */
    function finishLevel() {

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

        if (currentState === gameState.level) {
            switch (level.getState()) {
                case levelState.ready:
                    gameOn = true;
                    level.setState(play);
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
    }
}
