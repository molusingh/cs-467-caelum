/* global $*/
/* global location*/
$("#menuButton").click(flipMenuDisplay);
$("#closeMenuButton").click(flipMenuDisplay);
$("#restartButton").click(restart);
$("#startButton").click(start);


/*
 * Starts a new game
 */
function start() {
	$("#startScreen").hide();
}
/*
 * Restarts the game
 */
function restart() {
	location.reload();
}
/*
 * flips the display of the menu
 */
function flipMenuDisplay(event) {
	if ($("#menu").css("display") == "none") {
		$("#menu").show();
	}
	else {
		$("#menu").hide();
	}
}

//public functions need to go inside as: this.functionName = function(){}
function userInterface() {

}