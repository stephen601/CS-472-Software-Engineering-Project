//@todo limit data sending size for server

let SCREEN_NONE = 0;
let SCREEN_LOGIN = 1;
let SCREEN_WAITING_FOR_SERVER = 2;
let SCREEN_SHOW_LIST = 3;
let SCREEN_SEAT_LIST = 4;
let SCREEN_PAYMENT_INFO = 5;
let SCREEN_RECEIPT = 6;
let SCREEN_SHOW_EDITOR = 7;
let SCREEN_SEAT_EDITOR = 8;
let SCREEN_REPORT = 9;

let app = {};
app.pixiApp = null;
app.ui = {};
app.ui.size = {}
app.ui.mouse = {};
app.ui.mouseDown = false;
app.ui.mouseJustDown = false;
app.ui.mouseJustUp = false;
app.ui.keysPressed = [];
app.ui.size.x = 0;
app.ui.size.y = 0;
app.ui.pixiFields = [];
app.ui.pixiInputFields = [];
app.ui.pixiSprites = [];
app.ui.selectedInputField = null;

app.ui.prevScreen = -1;
app.ui.currentScreen = SCREEN_NONE;

app.showManager = {};
app.showManager.shows = [];
app.showManager.currentShowIndex = 0;
app.showManager.currentSeatIndices = [];

let theaterRows = 8;
let theaterCols = 12;

{
	let show = {};
	show.id = 1;
	show.name = "Beetlejuice";
	show.date = new Date("March 30, 2022 07:24:00");
	show.seats = [];
	for (let i = 0; i < 12*8; i++) {
		let seat = {};
		//seat.id = 
	}

	app.showManager.shows.push(show);
}

{
	let show = {};
	show.id = 2;
	show.name = "Harry Potter and the Cursed Child";
	show.date = new Date("April 2, 2022 09:24:00");
	show.seats = [];

	app.showManager.shows.push(show);
}

{
	let show = {};
	show.id = 3;
	show.name = "Mrs. Doubtfire";
	show.date = new Date("April 5, 2022 03:24:00");
	show.seats = [];

	app.showManager.shows.push(show);
}


function runClient() {
	let pixiApp = new PIXI.Application({
		width: 1280, //@todo make this dynamically resizing
		height: 720,
		backgroundColor: 0x2980b9
	});

	document.body.appendChild(pixiApp.view);

	pixiApp.ticker.add(updateClient);
	app.pixiApp = pixiApp;
	app.ui.size.x = 1280;
	app.ui.size.y = 720;
}

function updateClient(delta) {
	let ui = app.ui;
	let showManager = app.showManager;

	let onFirstFrame = false;
	if (ui.prevScreen != ui.currentScreen) {
		for (let i = 0; i < ui.pixiFields.length; i++) app.pixiApp.stage.removeChild(ui.pixiFields[i]);
		for (let i = 0; i < ui.pixiInputFields.length; i++) app.pixiApp.stage.removeChild(ui.pixiInputFields[i]);
		for (let i = 0; i < ui.pixiSprites.length; i++) app.pixiApp.stage.removeChild(ui.pixiSprites[i]);
		ui.pixiFields = [];
		ui.pixiInputFields = [];
		ui.pixiSprites = [];
		ui.selectedInputField = false;

		ui.prevScreen = ui.currentScreen;
		onFirstFrame = true;
	}

	if (ui.currentScreen == SCREEN_NONE) {
		if (onFirstFrame) {
			app.pixiApp.stage.interactive = true;
			app.pixiApp.stage.on('mousemove', function(e) {
				app.ui.mouse.x = e.data.global.x;
				app.ui.mouse.y = e.data.global.y;
			});
			app.pixiApp.stage.on('pointerdown', function(e) {
				app.ui.mouseJustDown = true;
				app.ui.mouseDown = true;
			});
			app.pixiApp.stage.on('pointerup', function(e) {
				app.ui.mouseJustUp = true;
				app.ui.mouseDown = false;
			});

			// Create invisible text field
			app.inputHtmlElement = document.createElement("INPUT");
			app.inputHtmlElement.setAttribute("style", "position:absolute; left: 0px; width: 1%; height: 1%; opacity: 0%");
			window.addEventListener("keydown", function(e) {
				if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || e.key == "Backspace" || e.key == "Enter") {
					app.ui.keysPressed.push(e.key);
				}
			}, false);
			//x.focus();
			document.body.appendChild(app.inputHtmlElement);

			//@todo Get a list of the shows
			changeScreen(SCREEN_LOGIN);
		}
	} else if (ui.currentScreen == SCREEN_LOGIN) {
		if (onFirstFrame) {
			ui.userField = createInputTextField();
			ui.userField.text = "username";
			ui.userField.x = ui.size.x / 2 - ui.userField.width / 2;
			ui.userField.y = ui.size.y / 2 - ui.userField.height / 2;

			ui.passField = createInputTextField();
			ui.passField.text = "password";
			ui.passField.x = ui.size.x / 2 - ui.passField.width / 2;
			ui.passField.y = ui.userField.y + ui.userField.height + 10;

			ui.loginButton = createTextButtonSprite("Login");
			console.log(ui.loginButton.width);
			ui.loginButton.x = ui.size.x / 2 - ui.loginButton.width / 2;
			ui.loginButton.y = ui.passField.y + ui.passField.height + 10;
		}

		if (spriteClicked(ui.loginButton)) {
			attemptLogin(ui.userField.text, ui.passField.text);
			changeScreen(SCREEN_WAITING_FOR_SERVER);
		}
	} else if (ui.currentScreen == SCREEN_WAITING_FOR_SERVER) {
		if (onFirstFrame) {
			let waitingText = createTextField();
			waitingText.text = "Waiting...";
			waitingText.x = ui.size.x / 2 - waitingText.width / 2;
			waitingText.y = ui.size.y / 2 - waitingText.height / 2;
			changeScreen(SCREEN_SHOW_LIST); //@todo(Jeru) Hack
		}
	} else if (ui.currentScreen == SCREEN_SHOW_LIST) {
		if (onFirstFrame) {
			ui.showButtons = [];

			let yPos = 0;
			for (let i = 0; i < showManager.shows.length; i++) {
				let sprite = createTextButtonSprite(" ");
				sprite.x = ui.size.x / 2 - sprite.width / 2;
				sprite.y = yPos; //trying to lower the buttons so its not at the top center
				yPos += sprite.height + 10;
				ui.showButtons.push(sprite);
			}
			ui.addButton = createTextButtonSprite("+"); //creating add show button
			ui.addButton.x = ui.size.x * 0.5 - ui.addButton.width / 2 + 200;
			ui.addButton.y = ui.size.y - ui.addButton.height - 10;

			ui.removeButton = createTextButtonSprite("-"); //creating remove show button
			ui.removeButton.x = ui.size.x * 0.5 - ui.removeButton.width / 2 - 200;
			ui.removeButton.y = ui.size.y - ui.removeButton.height - 10;
		}
		/*if (false) { //To make visible buttons only for admin *How to get result
			ui.addButton.visible = false; //hiding add show button true
			ui.removeButton.visible = false; //hiding remove show button if false 
		} else {
			ui.addButton.visible = true; //showing add show button if true
			ui.removeButton.visible = true; //showing remove show button if true 
		}*/
		if (spriteClicked(ui.addButton)) { // if the button add show is clicked then.. 
			console.log("add");//***Need solution to add show
		}
		if (spriteClicked(ui.removeButton)) { // if the button removed show is clicked then.. 
			console.log("remove");//***Need solution to remove show
		}
		for (let i = 0; i < ui.showButtons.length; i++) {
			let button = ui.showButtons[i];

			if (spriteClicked(button)) {
				selectShow(i);
				changeScreen(SCREEN_SEAT_LIST);

			}
		}
	} else if (ui.currentScreen == SCREEN_SEAT_LIST) {
		if (onFirstFrame) {
			showManager.currentSeatIndices = [];
			ui.seatButtons = [];

			let pad = 10;
			let seatWidth = 64;
			let seatHeight = 64;
			
			
			let offsetX = ui.size.x/2 - (theaterCols * (seatWidth+pad))/2
			let offsetY = 20;

			for (let y = 0; y < theaterRows; y++) {
				for (let x = 0; x < theaterCols; x++) {
					let sprite = createSeatSprite();
					sprite.width = seatWidth;
					sprite.height = seatHeight;
					sprite.x = x * (sprite.width + pad) + offsetX;
					sprite.y = y * (sprite.height + pad) + offsetY;
					ui.seatButtons.push(sprite);
				}
			}

			let button = createTextButtonSprite("Buy");
			button.x = ui.size.x*0.5 - button.width/2;
			button.y = ui.size.y - button.height - 10;
			ui.buyButton = button;
		}

		for (let i = 0; i < ui.seatButtons.length; i++) {
			let button = ui.seatButtons[i];
			button.tint = 0xFFFFFF;
			if (showManager.currentSeatIndices.indexOf(i) != -1) button.tint = 0xFFFF00;
			if (spriteClicked(button)) {
				selectSeat(i);
			}
        }

		if (showManager.currentSeatIndices.length == 0) {
			ui.buyButton.visible = false;
		} else {
			ui.buyButton.visible = true;
		}
		if (spriteClicked(ui.buyButton)) {
			changeScreen(SCREEN_PAYMENT_INFO);
		}

	} else if (ui.currentScreen == SCREEN_PAYMENT_INFO) {
		if (onFirstFrame) {
			ui.nameField = createInputTextField();
			ui.nameField.text = "Name on card";
			ui.nameField.x = ui.size.x / 2 - ui.nameField.width / 2;
			ui.nameField.y = 20;

			ui.creditNumber = createInputTextField();
			ui.creditNumber.text = "Credit Card Number";
			ui.creditNumber.x = ui.size.x / 2 - ui.creditNumber.width / 2;
			ui.creditNumber.y = ui.nameField.y + ui.nameField.height + 10;

			ui.cvvField = createInputTextField();
			ui.cvvField.text = "CVV";
			ui.cvvField.x = ui.size.x / 2 - ui.cvvField.width / 2;
			ui.cvvField.y = ui.creditNumber.y + ui.creditNumber.height + 10;

			ui.dateField = createInputTextField();
			ui.dateField.text = "Date";
			ui.dateField.x = ui.size.x / 2 - ui.dateField.width / 2;
			ui.dateField.y = ui.cvvField.y + ui.cvvField.height + 10;
			// todo exp date picker

			ui.zipField = createInputTextField();
			ui.zipField.text = "Zip";
			ui.zipField.x = ui.size.x / 2 - ui.zipField.width / 2;
			ui.zipField.y = ui.dateField.y + ui.dateField.height + 10;

			let button = createTextButtonSprite("Buy");
			button.x = ui.size.x * 0.5 - button.width / 2;
			button.y = ui.size.y - button.height - 10;
			ui.buyButton = button;
		}

		if (spriteClicked(ui.buyButton)) {
			chargeCreditCard(ui.nameField.text, ui.creditNumber.text, ui.dateField.text, 0); //@todo Figure out the price
			//changeScreen(SCREEN_WAITING_FOR_SERVER); //@todo(Jeru): Make this actually work
			changeScreen(SCREEN_RECEIPT);
        }
	} else if (ui.currentScreen == SCREEN_RECEIPT) {
		//@todo We need name, age, address, telephone, and email, but the user profile should already have that.
		if (onFirstFrame) {
			let show = showManager.shows[showManager.currentShowIndex];

			let nameField = createTextField();
			nameField.text = show.name;
			nameField.x = ui.size.x / 2 - nameField.width / 2;
			nameField.y = 20;

			let showDateField = createTextField();
			showDateField.text = show.date.toString();
			showDateField.x = ui.size.x / 2 - showDateField.width / 2;
			showDateField.y = nameField.y + nameField.height + 10;

			let seatsField = createTextField();
			seatsField.text = "Seats: ";
			for (let i = 0; i < showManager.currentSeatIndices.length; i++) {
				let seatIndex = showManager.currentSeatIndices[i];
				let col = seatIndex % theaterCols;
				let row = Math.floor(seatIndex / theaterCols);
				seatsField.text += String.fromCharCode(65 + row);
				seatsField.text += col + 1;
				if (i < showManager.currentSeatIndices.length-1) seatsField.text += ", ";
			}
			seatsField.x = ui.size.x / 2 - seatsField.width / 2;
			seatsField.y = showDateField.y + showDateField.height + 10;

			let button = createTextButtonSprite("Done");
			button.x = ui.size.x * 0.5 - button.width / 2;
			button.y = ui.size.y - button.height - 10;
			ui.doneButton = button;
		}

		if (spriteClicked(ui.doneButton)) {
			changeScreen(SCREEN_SHOW_LIST);
		}
	} else if (ui.currentScreen == SCREEN_SHOW_EDITOR) {
		if (onFirstFrame) {

		}
	} else if (ui.currentScreen == SCREEN_SEAT_EDITOR) {
		if (onFirstFrame) {

		}
	} else if (ui.currentScreen == SCREEN_REPORT) {
		if (onFirstFrame) {

		}
	}

	{ /// Update input field
		for (let i = 0; i < ui.pixiInputFields.length; i++) {
			let field = ui.pixiInputFields[i];
			if (field == ui.selectedInputField) {
				field.alpha = 0.75;
			} else {
				field.alpha = 1.0;
			}

			if (spriteClicked(field)) ui.selectedInputField = field;

			while (app.ui.keysPressed.length > 0) {
				let key = app.ui.keysPressed.shift();
				if (ui.selectedInputField) {
					if (key == "Backspace") {
						ui.selectedInputField.text = ui.selectedInputField.text.substring(0, ui.selectedInputField.text.length-1);
					} else if (key == "Enter") {
						ui.selectedInputField = null;
					} else {
						ui.selectedInputField.text += key;
					}
				}
			}
		}
	}

	app.ui.mouseJustDown = false;
	app.ui.mouseJustUp = false;
}

function changeScreen(newScreen) {
	app.ui.currentScreen = newScreen;
	app.ui.screenTime = 0;
}

function createTextField() {
	let field = new PIXI.Text();
	app.pixiApp.stage.addChild(field);
	app.ui.pixiFields.push(field);
	return field;
}

function createInputTextField() {
	let field = new PIXI.Text();
	app.pixiApp.stage.addChild(field);
	app.ui.pixiInputFields.push(field);
	return field;
}

function createTextButtonSprite(text) {
	let sprite = new PIXI.Sprite.from("assets/button.png"); //@todo(Jeru): Cache textures so that I know the size of them on frame 1
	app.pixiApp.stage.addChild(sprite);
	app.ui.pixiSprites.push(sprite);
	return sprite;
}

function createSeatSprite() {
	let sprite = new PIXI.Sprite.from("assets/seat.png");
	app.pixiApp.stage.addChild(sprite);
	app.ui.pixiSprites.push(sprite);
	return sprite;
}

function spriteClicked(sprite) {
	let ui = app.ui;

	if (!sprite.visible) return false;

	let hoveringButton = false;
	// let x = sprite.x;
	// let y = sprite.y;
	// let w = sprite.width;
	// let h = sprite.height;
	// console.log(x+"|"+y+"|"+w+"|"+h);
	if (ui.mouse.x > sprite.x && ui.mouse.x < sprite.x + sprite.width && ui.mouse.y > sprite.y && ui.mouse.y < sprite.y + sprite.height) {
		hoveringButton = true;
	}

	if (ui.mouseJustDown && hoveringButton) {
		return true;
	}
	return false;
}

function attemptLogin(username, password) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) { // @todo(Jeru): Handle failure
			console.log(this.responseText); //@todo Parse and verify this
			changeScreen(SCREEN_SHOW_LIST);
		}
	}
	// -1: User doesn't exist
	// 35, Jeru Sanders, jerusanders@gmail.com
	//xmlhttp.open("GET", "login.html", true);
	//@stp xmlhttp.onerror
	xmlhttp.open("GET", "login.php?username="+username+"&password="+password, true);
	xmlhttp.send();
}

function selectShow(showIndex) {
	app.showManager.currentShowIndex = showIndex;
}

function selectSeat(seatId) {
	let showManager = app.showManager;

	let index = showManager.currentSeatIndices.indexOf(seatId);

	if (index == -1) {
		showManager.currentSeatIndices.push(seatId);
	} else {
		showManager.currentSeatIndices.splice(index, 1);
	}
}

function chargeCreditCard(cardName, cardNumber, cvv, expDate, amount) {
	
}
