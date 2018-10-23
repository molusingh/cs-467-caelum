/* global $*/
/* global location*/
/* global bus*/

/*
 * Simply create instance of object to activate user interface
 */
function UserInterface()
{
	// document.addEventListener('keydown', onKeyDown);
	$("#menuButton").click(flipMenuDisplay);
	$("#closeMenuButton").click(flipMenuDisplay);
	$("#restartButton").click(restart);
	$("#startButton").click(start);

	/*
	 * Starts a new game
	 */
	function start()
	{
		bus.publish("start");
		$("#startScreen").hide();
	}

	/*
	 * Restarts the game
	 */
	function restart()
	{
		location.reload();
	}

	/*
	 * flips the display of the menu
	 */
	function flipMenuDisplay(event)
	{
		bus.publish("menu");
		if ($("#menu").css("display") == "none")
		{
			$("#menu").show();
		}
		else
		{
			$("#menu").hide();
		}
	}

	function onKeyDown(event)
	{

		switch (event.keyCode)
		{

			case 38: // up
			case 87: // W
				bus.publish("moveUp");
				break;

			case 37: // left
			case 65: // A
				bus.publish("moveLeft");
				break;

			case 40: // down
			case 83: // S
				bus.publish("moveDown");
				break;

			case 39: // right
			case 68: // D
				bus.publish("moveRight");
				break;

			case 82: // R
				moveUp = true;
				break;
				
			case 70: // F
				moveDown = true;
				break;
		}
	}
}
