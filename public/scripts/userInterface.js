/* global $*/
/* global location*/
/* global bus*/

/*
 * Simply create instance of object to activate user interface
 */
function UserInterface()
{
	var keyDown = false;
	var speedBoost = false;
	var speedIntervalIds = {};

	// interface event subscriptions
	bus.subscribe("start", getToggleDisplayFunction("startScreen"));
	bus.subscribe("start", getToggleDisplayFunction("loadingScreen"));
	bus.subscribe("openMenu", getToggleDisplayFunction("menu"));
	bus.subscribe("closeMenu", getToggleDisplayFunction("menu"));
	bus.subscribe("openHowToPlay", flipBetweenStartAndHowToPlay);
	bus.subscribe("closeHowToPlay", flipBetweenStartAndHowToPlay);
	bus.subscribe("pickBoosts", getToggleDisplayFunction("boostsScreen"));
	bus.subscribe("endPickBoosts", getToggleDisplayFunction("boostsScreen"));
	bus.subscribe("playerWins", getToggleDisplayFunction("winScreen"));
	bus.subscribe("playerLoses", getToggleDisplayFunction("loseScreen"));
	bus.subscribe("toggleSpeedBoost", toggleSpeedBoost);
	bus.subscribe("updateDucklingLabels", updateDucklingStatusLabels);
	bus.subscribe('validateSkillLevel', validateSkillButtons);
	bus.subscribe("clearSpeedTimers", clearSpeedTimers);
	// interface event callbacks
	// movement buttons
	$(document).keydown(onKeyDown);
	$(document).keyup(onKeyUp);
	$("#leftButton").click(getPublishFunction("duckLeft"));
	$("#rightButton").click(getPublishFunction("duckRight"));
	$("#downButton").click(getPublishFunction("duckDown"));
	$("#upButton").click(getPublishFunction("duckUp"));

	$("#leftButton").on('pointerdown pointerup', speedLeft);
	$("#rightButton").on('pointerdown pointerup', speedRight);
	$("#downButton").on('pointerdown pointerup', speedDown);
	$("#upButton").on('pointerdown pointerup', speedUp);

	// game state buttons
	$("#restartButton").click(restart);
	$("#restartButton2").click(restart);
	$("#restartButton3").click(restart);
	$("#startButton").click(getPublishFunction("start"));
	$("#startButton").click(getPublishFunction("mainMusic"));
	$("#menuButton").click(getPublishFunction("openMenu"));
	$("#closeMenuButton").click(getPublishFunction("closeMenu"));
	$("#howToPlayButton").click(getPublishFunction("openHowToPlay"));
	$("#closeHowToPlayButton").click(getPublishFunction("closeHowToPlay"));
	$("#soundButton").click(getPublishFunction("toggleSound"));
	$("#musicButton").click(getPublishFunction("toggleMusic"));
	$("#nextLevelButton").click(getPublishFunction("endPickBoosts"));

	// skill request buttons
	$("#flyButton").click(getPublishFunction("flyToggle"));
	$("#jumpButton").click(getPublishFunction("jump"));
	$("#callButton").click(getPublishFunction("call"));
	$("#nestButton").click(getPublishFunction("nest"));
	$("#invisibilityButton").click(getPublishFunction("invisibilitySkillRequested"));
	$("#speedButton").click(getPublishFunction("speedSkillRequested"));
	$("#quackButton").click(getPublishFunction("quackSkillRequested"));

	// skill purchase buttons
	$("#upgradeInvisibilityButton").click(getPublishFunction("invisiblityUpgrade"));
	$("#upgradeSpeedButton").click(getPublishFunction("speedUpgrade"));
	$("#upgradeQuackButton").click(getPublishFunction("quackUpgrade"));

	// pointer click sound publishers
	$("#gameControls").click(getPublishFunction("clickSound")); // includes skillButtons, movementControls, and actionButtons
	$("#startButton").click(getPublishFunction("clickSound")); // start button at title
	$("#howToPlayButton").click(getPublishFunction("clickSound")); // how to play button at title
	$("#closeHowToPlayButton").click(getPublishFunction("clickSound"));
	$("#menuButton").click(getPublishFunction("clickSound")); // menu button
	$("#menu").click(getPublishFunction("clickSound")); // all buttons in menu

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

	function validateSkillButtons()
	{
		var id = '#quackButton';
		if (stunLength <= 0)
		{
			$(id).hide();
		}
		else
		{
			$(id).show();
		}
		id = '#speedButton';
		if (speedLength <= 0)
		{
			$(id).hide();
		}
		else
		{
			$(id).show();
		}
		id = '#invisibilityButton';
		if (invisLength <= 0)
		{
			$(id).hide();
		}
		else
		{
			$(id).show();
		}
	}

	/*
	 * Restarts the game
	 */
	function restart()
	{

		location.reload();
	}

	function clearSpeedTimers()
	{
		clearInterval(speedIntervalIds.down);
		clearInterval(speedIntervalIds.up);
		clearInterval(speedIntervalIds.left);
		clearInterval(speedIntervalIds.right);
	}

	/*
	 * toggles the displays for the how to play and start screen
	 */
	function flipBetweenStartAndHowToPlay(event)
	{
		getToggleDisplayFunction("startScreen")();
		getToggleDisplayFunction("howToPlayScreen")();
	}

	function toggleSpeedBoost()
	{
		if (speedBoost === false)
		{
			speedBoost = true;
		}
		else
		{
			speedBoost = false;
			clearSpeedTimers();
		}
	}

	function speedDown(e)
	{
		clearSpeedTimers();
		if (e.type == "pointerdown")
		{
			if (speedBoost == true)
			{
				speedIntervalIds.down =
					setInterval(getPublishFunction("duckDown"), 100);
			}
		}
		else if (e.type == "pointerup")
		{
			clearSpeedTimers();
		}
	}

	function speedUp(e)
	{
		clearSpeedTimers();
		if (e.type == "pointerdown")
		{
			if (speedBoost == true)
			{
				speedIntervalIds.up =
					setInterval(getPublishFunction("duckUp"), 100);
			}
		}
		else if (e.type == "pointerup")
		{
			clearSpeedTimers();
		}
	}

	function speedLeft(e)
	{
		clearSpeedTimers();
		if (e.type == "pointerdown")
		{
			if (speedBoost == true)
			{
				speedIntervalIds.left =
					setInterval(getPublishFunction("duckLeft"), 100);
			}
		}
		else if (e.type == "pointerup")
		{
			clearSpeedTimers();
		}
	}

	function speedRight(e)
	{
		clearSpeedTimers();
		if (e.type == "pointerdown")
		{
			if (speedBoost == true)
			{
				speedIntervalIds.right =
					setInterval(getPublishFunction("duckRight"), 100);
			}
		}
		else if (e.type == "pointerup")
		{
			clearSpeedTimers();
		}
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
				if (keyDown === false)
				{
					bus.publish("duckUp");
					if (speedBoost === true)
					{
						return;
					}
					keyDown = true;
				}
				break;

			case 37: // left
			case 65: // A
				if (keyDown === false)
				{
					bus.publish("duckLeft");
					if (speedBoost === true)
					{
						return;
					}
					keyDown = true;

				}
				break;

			case 40: // down
			case 83: // S
				if (keyDown === false)
				{
					bus.publish("duckDown");
					if (speedBoost === true)
					{
						return;
					}
					keyDown = true;
				}
				break;

			case 39: // right
			case 68: // D
				if (keyDown === false)
				{
					bus.publish("duckRight");
					if (speedBoost === true)
					{
						return;
					}
					keyDown = true;
				}
				break;

			case 49: // 1 
				bus.publish("flyToggle");

				break;

			case 50: // 2
				bus.publish("jump");
				break;

			case 51: // 3
				bus.publish("call");
				break;

			case 52: // 4
				bus.publish("nest");
				break;

			case 81: // Q 
				bus.publish("invisibilitySkillRequested");
				break;

			case 69: // E
				bus.publish("quackSkillRequested");
				break;

			case 82: // R
				bus.publish("speedSkillRequested");
				break;
		}
	}

	function onKeyUp(event)
	{

		switch (event.keyCode)
		{
			case 38: // up
			case 87: // W
				keyDown = false;
				break;

			case 37: // left
			case 65: // A
				keyDown = false;
				break;

			case 40: // down
			case 83: // S
				keyDown = false;
				break;

			case 39: // right
			case 68: // D
				keyDown = false;
				break;
		}
	}

	function updateDucklingStatusLabels(args)
	{
		$('#roamingOutput').text(args.roaming);
		$('#killedOutput').text(args.dead);
		$('#nestedOutput').text(args.nested);
	}

}
