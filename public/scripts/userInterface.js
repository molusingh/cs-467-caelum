/* global $*/
/* global location*/
/* global bus*/

/*
 * Simply create instance of object to activate user interface
 */
function UserInterface()
{
	// interface event subscriptions
	bus.subscribe("start", getToggleDisplayFunction("startScreen"));
	bus.subscribe("openMenu", getToggleDisplayFunction("menu"));
	bus.subscribe("closeMenu", getToggleDisplayFunction("menu"));
	bus.subscribe("openHowToPlay", flipBetweenStartAndHowToPlay);
	bus.subscribe("closeHowToPlay", flipBetweenStartAndHowToPlay);
	// bus.subscribe("pickBoosts", getToggleDisplayFunction("boostsScreen"));
	// bus.subscribe("endPickBoosts", getToggleDisplayFunction("boostsScreen"));
	bus.subscribe("playerWins", getToggleDisplayFunction("winScreen"));
	bus.subscribe("playerLoses", getToggleDisplayFunction("loseScreen"));


	// interface event callbacks

	// movement buttons
	$(document).keydown(onKeyDown);
	$("#leftButton").click(getPublishFunction("moveLeft"));
	$("#rightButton").click(getPublishFunction("moveRight"));
	$("#downButton").click(getPublishFunction("moveDown"));
	$("#upButton").click(getPublishFunction("moveUp"));

	// game state buttons
	$("#restartButton").click(restart);
	$("#startButton").click(getPublishFunction("start"));
	$("#menuButton").click(getPublishFunction("openMenu"));
	$("#closeMenuButton").click(getPublishFunction("closeMenu"));
	$("#howToPlayButton").click(getPublishFunction("openHowToPlay"));
	$("#closeHowToPlayButton").click(getPublishFunction("closeHowToPlay"));
	$("#soundButton").click(getPublishFunction("toggleSound"));
	$("#musicButton").click(getPublishFunction("toggleMusic"));

	// player control Buttons
	$("#skillButtons").click(getPublishFunction("skillButtonClicked"));
	$("#actionButtons").click(getPublishFunction("actionButtonClicked"));

	$("#flyButton").click(getPublishFunction("flyToggle"));
	$("#jumpButton").click(getPublishFunction("jump"));
	$("#callButton").click(getPublishFunction("call"));
	$("#nestButton").click(getPublishFunction("nest"));

	// skill request buttons
	$("#invisibilityButton").click(getPublishFunction("invisibilitySkillRequested"));
	$("#speedButton").click(getPublishFunction("speedSkillRequested"));
	$("#quackButton").click(getPublishFunction("quackSkillRequested"));

	// mouse click sound publishers
		// includes skillButtons, movementControls, and actionButtons
	$("#gameControls").click(getPublishFunction("clickSound"));
		// start button at title
	$("#startButton").click(getPublishFunction("clickSound"));
		// how to play button at title
	$("#howToPlayButton").click(getPublishFunction("clickSound"));
	$("#closeHowToPlayButton").click(getPublishFunction("clickSound"));
		// menu button
	$("#menuButton").click(getPublishFunction("clickSound"));
		// all buttons in menu
	$("#menu").click(getPublishFunction("clickSound"));

	// skill sounds
	$("#flyButton").click(getPublishFunction("flySound"));
	// jump sound published in playercontrols.jumpSkill
	$("#callButton").click(getPublishFunction("callSound"));
	$("#nestButton").click(getPublishFunction("nestSound"));
	$("#invisibilityButton").click(getPublishFunction("invisibilitySound"));
	$("#speedButton").click(getPublishFunction("speedBoostSound"));
	$("#quackButton").click(getPublishFunction("superQuackSound"));

	/*
	 * returns a function that publishes the specified event
	 */
	function getPublishFunction(eventType)
	{
		return function()
		{
			bus.publish(eventType);
		};
	}

	/*
	 * Returns a function that toggles the display for the specified ID
	 */
	function getToggleDisplayFunction(elementID)
	{
		var id = '#' + elementID;
		return function()
		{
			if ($(id).css("display") == "none")
			{
				$(id).show();
			}
			else
			{
				$(id).hide();
			}
		};
	}

	/*
	 * Restarts the game
	 */
	function restart()
	{
		location.reload();
	}

	/*
	 * toggles the displays for the how to play and start screen
	 */
	function flipBetweenStartAndHowToPlay(event)
	{
		getToggleDisplayFunction("startScreen")();
		getToggleDisplayFunction("howToPlayScreen")();
	}

	/*
	 * Called when a key is pressed
	 */
	function onKeyDown(event)
	{
		switch (event.keyCode)
		{
			case 38: // up
			case 87: // W
				bus.publish("moveUp");
				bus.publish("playerMove");

				break;

			case 37: // left
			case 65: // A
				bus.publish("moveLeft");
				bus.publish("playerMove");
				break;

			case 40: // down
			case 83: // S
				bus.publish("moveDown");
				bus.publish("playerMove");
				break;

			case 39: // right
			case 68: // D
				bus.publish("moveRight");
				bus.publish("playerMove");
				break;

			case 49: // 1 
				bus.publish("flyToggle");
				bus.publish("flySound");
				break;

			case 50: // 2
				bus.publish("jump");
				// sound published in playerControls.jumpSkill
				break;

			case 51: // 3
				bus.publish("call");
				bus.publish("callSound");
				break;

			case 52: // 4
				bus.publish("nest");
				bus.publish("nestSound");
				break;

			case 81: // Q 
				bus.publish("invisibilitySkillRequested");
				bus.publish("invisibilitySound");
				break;

			case 69: // E
				bus.publish("quackSkillRequested");
				bus.publish("superQuackSound");
				break;

			case 82: // R
				bus.publish("speedSkillRequested");
				bus.publish("speedBoostSound");
		}
	}
}
