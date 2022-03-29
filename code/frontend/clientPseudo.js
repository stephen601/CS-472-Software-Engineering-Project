/**
 * Enum for screens
 * @readonly
 * @enum {number}
 */
var SCREENS = {
	/** A sentinel screen */
	SCREEN_NONE: -1,
	/** The user or admin logs in */
	SCREEN_LOGIN: 0,
	/** A screen for the client to wait for a server responce on */
	SCREEN_WAITING_FOR_SEVER: 1,
	/** Shows all the available shows in a list (icon|title|date) */
	SCREEN_SHOW_LIST: 2,
	/** Shows a grid of seats where the user can select multiple seats by touching/clicking them, then purchase them by clicking a buy button. Available seats are in white, unavailable ones are grey, selected are yellow. */
	SCREEN_SEAT_LIST: 3,
	/** Shows a screen where the user inputs their credit card, CSV, and exp date, then clicks buy. There should be visual icons of each of the major card providers, with all but MasterCard and VISA crossed out. (TODO: Figure out how to know what provider a card came from)

	(TODO: Figure out how to avoid two people paying at the same time for the same seat)
	Optionally: User can save or pick a saved card
	Optionally: Cash payment
	 */
	SCREEN_PAYMENT_INFO: 4,
	/** Just shows the seat and show you paid with a green check mark or something. Has a button to go back to the show list. */
	SCREEN_RECIPT: 5,
	/** A screen that admins get to from the seat list, that allows them to modify the show name, date, icon. (TODO: How do get icons???) */
	SCREEN_SHOW_EDITOR: 6,
	/** A screen that admins get to from the seat list, that allows them to modify the selected seats price. */
	SCREEN_SEAT_EDITOR: 7,
	/** A screen that dumps a huge filterable log of all the events */
	SCREEN_REPORT: 8,
}

var app = {
	ui: {
		currentScreen: SCREEN_NONE,
		screenTime: 0,
		userNameField: null,
		passwordField: null,
		logInButton: null,
		pixiStage: null,
		pixiTextFields: [],
		pixiSprites: []
	},
	showManager: {
	},
	server: {
	}
}

/**
The "main" function, called by external means to start the app
*/
function runClient() {
	requestAnimationFrame(updateApp);
}

/**
The main update loop for the client application, is called every frame
*/
function updateApp() {
	var elapsed = 1/60; // I should probably get the real refresh rate
	var ui = app.ui;

	var onFirstFrame = false;
	if (ui.screenTime == 0) onFirstFrame = true;

	var onLastFrame = false; // @todo Make this actually work

	//@todo Add back buttons!
	if (ui.currentScreen == SCREEN_NONE) {
		if (onFirstFrame) {
			// Real app init is in here?
			changeScreen(SCREEN_LOGIN)
		}
	} else if (ui.currentScreen == SCREEN_LOGIN) {
		if (onFirstFrame) { // On the first frame of the screen
			// Creates the user name text field
			var field = new PIXI.Text();
			// Make the text field's width a percentage of the screen's width, to accommodate displays of all sizes
			field.width = screen.width*0.3;
			// Center the field horizontally
			field.x = screen.width/2 - field.width/2;
			// Center the field vertically
			field.y = screen.height/2 - field.height/2;
			// Add some initial text, this should be "hint text" later, which is text that appears faintly and is instantly erased when the user goes to input text
			field.text = "username";
			// Add the field to the stage
			stage.addChild(field);
			// Keep track of the refernce to the field
			ui.userNameField = field;

			// Create the password field
			field = new PIXI.Text();
			field.width = screen.width*0.3;
			field.x = screen.width/2 - field.width/2;
			// This field goes below the user name field with some padding
			field.y = ui.userNameText.y + ui.userNameText.height + 5;
			field.text = "password";
			stage.addChild(field);
			ui.passwordField = field;

			// Add a log in button
			var button = new PIXI.Sprite();
			button.x = //...
			button.y = //...
			stage.addChild(button);
			ui.logInButton = button;
		}

		if (onLastFrame) { // On the last frame of the screen
			// Remove the screen elements
			stage.removeChild(app.ui.userNameField);
			stage.removeChild(app.ui.passwordField);
			stage.removeChild(app.ui.logInButton);
		}

		// Every frame
		if (spriteClicked(ui.logInButton)) { // Check if the log in button was clicked
			// Attempt a log in
			server.attemptLogIn(ui.userNameField.text, ui.passwordField.text);
			// Change to a waiting screen, the ServerInterOp will change our screen to something else when it's done
			changeScreen(SCREEN_WAITING_FOR_SEVER);
		}

	} else if (ui.currentScreen == SCREEN_SHOW_LIST) {
		if (onFirstFrame) {
		}
		if (onLastFrame) {
		}
	} else if (ui.currentScreen == SCREEN_SEAT_LIST) {
		//@todo Create row and column label (A, B, C, 1, 2, 3...)
		if (onFirstFrame) {
			// Create a 12x8 seat sprites in the center of the screen
			// Create the buy button
			// If you're logged in as an admin
			//	Create Edit Show button
			//	Create Edit Seats button
		}
		if (onLastFrame) {
			// Destroy the seat sprites
			// Destroy the buy button
			// If you're logged in as an admin
			//	Destroy Edit Show button
			//	Destroy Edit Seats button
		}

		// For each seat sprite
		// Set the color of the seat based on its status (red=taken, green=avail, yellow=selected)
		//	if the seat sprite was clicked
		//		call selectSeat(seatIndex)

		// If 0 seats are selected buy button is hidden
		// If buy button was clicked
		//	changeScreen(SCREEN_PAYMENT_INFO)

		// If Edit Show button was clicked
		//	changeScreen(SCREEN_SHOW_EDITOR)

		// If 0 seats are selected Edit Seats button is hidden
		// If Edit Seats button was clicked
		//	changeScreen(SCREEN_SEAT_EDITOR)
	} else if (ui.currentScreen == SCREEN_PAYMENT_INFO) {
		// @todo Figure out how to avoid double buys
		// @todo We might also need address related infomation to charage a card!
		if (onFirstFrame) {
			// Create creditCardName field (hint: Name)
			// Create creditCardNumber field (hint: CC#, maxChars: 16)
			// Create creditCardCVV field (hint: CVV, maxChars: 3)
			// Create creditCardDate date field
			// Create creditCardZip field (hint: Zip)
			// Create confirmButton
		}
		if (onLastFrame) {
			// Destroy creditCardName field
			// Destroy creditCardNumber field
			// Destroy creditCardCVV field
			// Destroy creditCardDate date field
			// Destroy creditCardZip field
			// Destroy confirmButton
		}

		// If confirm button was clicked
		//	Maybe do simple card checks?
		//	chargeCreditCard(allTheStuff)
		//	changeScreen(SCREEN_WAITING_FOR_SEVER) // The server will send you back here or to SCREEN_RECIPT

	} else if (ui.currentScreen == SCREEN_RECIPT) {
		if (onFirstFrame) {
			// Create and setup recipt text field
			// Create back button
		}
		if (onLastFrame) {
			// Destroy recipt text field
			// Destroy back button
		}

		// if back button was clicked
		//	 changeScreen(SCREEN_SHOW_LIST)
	} else if (ui.currentScreen == SCREEN_SHOW_EDITOR) {
		//@todo Figure out icons
		if (onFirstFrame) {
			// Create Show name text field
			// Create Date date field
			// Create Save button
		}
		if (onLastFrame) {
			// Destroy Show name text field
			// Destroy Date date field
			// Destroy Save button
		}

		// if Save button was clicked
		//	@todo Figure out how the admin saves show data
		//	changeScreen(SCREEN_SEAT_LIST)
	} else if (ui.currentScreen == SCREEN_SEAT_EDITOR) {
		if (onFirstFrame) {
			// Create X seats selected static text field
			// Create price text field
			// Create save button
		}
		if (onLastFrame) {
			// Destroy X seats selected static text field
			// Destroy price text field
			// Destroy save button
		}

		// If save button was clicked
		//	@todo Figure out how to update the seat prices
		//	changeScreen(SCREEN_SEAT_LIST)
	} else if (ui.currentScreen == SCREEN_REPORT) {
		//@todo Do filters
		if (onFirstFrame) {
			// Create report static text field
			// Create back button
		}
		if (onLastFrame) {
			// Destroy report static text field
			// Destroy back button
		}
	} else {
		// Invalid screen
	}

	ui.screenTime += elapsed;
}

/**
Checks whether or not a sprite was clicked this frame
@param {PIXI.Sprite} sprite - The sprite in question
@returns {boolean} If it was clicked
*/
function spriteClicked(sprite) {
	return false; // @todo Figure how sprites get clicked
}

/**
Changes the current screen that the user is seeing and interacting with
@param {number} newScreen - The newly picked screen to display
*/
function changeScreen(newScreen) {
	app.ui.currentScreen = newScreen;
	app.ui.screenTime = 0;
}
