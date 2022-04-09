//@todo limit data sending string size for server
//@todo Fix receipt screen since now we have tickets from multiple shows
//@todo Figure out the report screen in general
//@todo Do show editor
//@todo Do seat editor
//@todo Pretty up the text fields some more
//@todo Do transitions
//@todo Do background for plain text fields
//@todo Prevent cart and show list screen from overflowing the layout
//@todo Do input text field hints

let verboseLogging = false;
let defaultFontSize = 40;

let SCREEN_NONE = 0;
let SCREEN_LOGIN = 1;
let SCREEN_WAITING_FOR_SERVER = 2;
let SCREEN_SHOW_LIST = 3;
let SCREEN_SEAT_LIST = 4;
let SCREEN_PAYMENT_INFO = 5;
let SCREEN_CART = 6;
let SCREEN_RECEIPT = 7;
let SCREEN_SHOW_EDITOR = 8;
let SCREEN_SEAT_EDITOR = 9;
let SCREEN_REPORT = 10;

let app = {};
app.pixiApp = null;
app.time = 0;

let ui = {};
ui.size = {};
ui.mouse = {};
ui.mouseDown = false;
ui.mouseJustDown = false;
ui.mouseJustUp = false;
ui.size.x = 0;
ui.size.y = 0;
ui.pixiFields = [];
ui.pixiInputFields = [];
ui.pixiInputFieldBackgrounds = [];
ui.pixiSprites = [];

ui.selectedInputField = null;
ui.selectedInputFieldTime = 0;
ui.textCursorSprite = null;

ui.prevScreen = -1;
ui.currentScreen = SCREEN_NONE;

ui.popup = null;
ui.popupTime = 0;

ui.bgSprite = null;
ui.stageSprite = null;
ui.foregroundSprite = null;

let showManager = {};
showManager.shows = [];
showManager.currentShowIndex = 0;
showManager.currentSeatIndices = [];

let cart = [];

let THEATER_ROWS = 8;
let THEATER_COLS = 12;

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

	showManager.shows.push(show);
}

{
	let show = {};
	show.id = 2;
	show.name = "Harry Potter and the Cursed Child";
	show.date = new Date("April 2, 2022 09:24:00");
	show.seats = [];

	showManager.shows.push(show);
}

{
	let show = {};
	show.id = 3;
	show.name = "Mrs. Doubtfire";
	show.date = new Date("April 5, 2022 03:24:00");
	show.seats = [];

	showManager.shows.push(show);
}


function runClient() {
	let pixiApp = new PIXI.Application({
		resizeTo: window,
		backgroundColor: 0xFF262626
	});

	document.body.appendChild(pixiApp.view);

	pixiApp.ticker.add(updateClient);
	app.pixiApp = pixiApp;

	ui.stageSprite = new PIXI.Sprite();
	app.pixiApp.stage.addChild(ui.stageSprite);

	ui.foregroundSprite = new PIXI.Sprite();
	app.pixiApp.stage.addChild(ui.foregroundSprite);

	ui.bgSprite = new PIXI.Sprite.from("assets/white.png");
	ui.bgSprite.tint = 0xFF262626;
	ui.stageSprite.addChild(ui.bgSprite);

	ui.stageSprite.interactive = true;
	ui.stageSprite.on("mousemove", function(e) {
		ui.mouse.x = e.data.global.x;
		ui.mouse.y = e.data.global.y;
	});
	ui.stageSprite.on("pointerdown", function(e) {
		ui.mouseJustDown = true;
		ui.mouseDown = true;
	});
	ui.stageSprite.on("pointerup", function(e) {
		ui.mouseJustUp = true;
		ui.mouseDown = false;
	});
	ui.stageSprite.on("touchmove", function(e) {
		ui.mouse.x = e.data.global.x;
		ui.mouse.y = e.data.global.y;
	});
	ui.stageSprite.on("touchstart", function(e) {
		ui.mouse.x = e.data.global.x;
		ui.mouse.y = e.data.global.y;
		ui.mouseJustDown = true;
		ui.mouseDown = true;
	});
	ui.stageSprite.on("touchend", function(e) {
		ui.mouseJustUp = true;
		ui.mouseDown = false;
	});

	// Create invisible text field
	app.inputHtmlElement = document.createElement("INPUT");
	app.inputHtmlElement.setAttribute("style", "position:absolute; left: 0px; top: 0px; width: 100%; height: 10%; opacity: 100%"); //@todo Make this unclickable
	document.body.appendChild(app.inputHtmlElement);

	ui.textCursorSprite = new PIXI.Sprite.from("assets/black.png");
	ui.foregroundSprite.addChild(ui.textCursorSprite);

	//@server loadShows.php?after=2525278934
	//ShowID1, ShowName1, ShowDate1
	//ShowID2, ShowName2, ShowDate2
	//...

	changeScreen(SCREEN_LOGIN);
}

function updateClient(delta) {
	let elapsed = 1/60;

	ui.size.x = app.pixiApp.screen.width;
	ui.size.y = app.pixiApp.screen.height;

	let onFirstFrame = false;
	if (ui.prevScreen != ui.currentScreen) {
		for (let i = 0; i < ui.pixiFields.length; i++) ui.stageSprite.removeChild(ui.pixiFields[i]);
		for (let i = 0; i < ui.pixiInputFields.length; i++) ui.stageSprite.removeChild(ui.pixiInputFields[i]);
		for (let i = 0; i < ui.pixiInputFieldBackgrounds.length; i++) ui.stageSprite.removeChild(ui.pixiInputFieldBackgrounds[i]);
		for (let i = 0; i < ui.pixiSprites.length; i++) ui.stageSprite.removeChild(ui.pixiSprites[i]);
		ui.pixiFields = [];
		ui.pixiInputFields = [];
		ui.pixiInputFieldBackgrounds = [];
		ui.pixiSprites = [];
		ui.selectedInputField = false;

		ui.prevScreen = ui.currentScreen;
		onFirstFrame = true;
	}

	if (ui.stageSprite != null) {
		ui.bgSprite.width = ui.size.x;
		ui.bgSprite.height = ui.size.y;
	}

	if (ui.currentScreen == SCREEN_NONE) {
	} else if (ui.currentScreen == SCREEN_LOGIN) {
		//@stp Failed to login in general
		if (onFirstFrame) {
			//@server user creation
			ui.userField = createInputTextField("username");
			ui.passField = createInputTextField("password");
			ui.loginButton = createTextButtonSprite("Login");
			ui.instantLogin = createTextButtonSprite("Instant login");
		}
		ui.userField.x = ui.size.x/2 - ui.userField.width/2;
		ui.userField.y = ui.size.y*0.3 - ui.userField.height/2;

		ui.passField.x = ui.size.x / 2 - ui.passField.width / 2;
		ui.passField.y = ui.userField.y + ui.userField.height + 10;

		ui.loginButton.x = ui.size.x / 2 - ui.loginButton.width / 2;
		ui.loginButton.y = ui.passField.y + ui.passField.height + 10;

		ui.instantLogin.x = ui.size.x / 2 - ui.instantLogin.width / 2;
		ui.instantLogin.y = ui.loginButton.y + ui.loginButton.height + 10;

		if (spriteClicked(ui.loginButton)) {
			attemptLogin(ui.userField.text, ui.passField.text);
			changeScreen(SCREEN_WAITING_FOR_SERVER);
		}

		if (spriteClicked(ui.instantLogin)) {
			attemptLogin("Jeru", "testPass");
			changeScreen(SCREEN_WAITING_FOR_SERVER);
		}
	} else if (ui.currentScreen == SCREEN_WAITING_FOR_SERVER) {
		//@stp Time out on this screen
		if (onFirstFrame) {
			ui.waitingText = createTextField();
			ui.waitingText.text = "Waiting...";
		}

		ui.waitingText.x = ui.size.x / 2 - ui.waitingText.width / 2;
		ui.waitingText.y = ui.size.y / 2 - ui.waitingText.height / 2;
	} else if (ui.currentScreen == SCREEN_SHOW_LIST) {
		//@stp What if there's too many shows to fit on the screen
		if (onFirstFrame) {
			ui.showButtons = [];

			for (let i = 0; i < showManager.shows.length; i++) {
				let show = showManager.shows[i];
				let sprite = createTextButtonSprite(show.name);
				ui.showButtons.push(sprite);
			}
			ui.addButton = createTextButtonSprite("Add show");

			ui.cartButton = createTextButtonSprite("Cart");
		}

		ui.addButton.x = ui.size.x*0.8 - ui.addButton.width/2;
		ui.addButton.y = ui.size.y*0.9 - ui.addButton.height;
		if (spriteClicked(ui.addButton)) { // if the button add show is clicked then.. 
			//@server addShow.php
			//ShowID
			console.log("add");//***Need solution to add show
			//@todo Go to the edit show screen
		}

		ui.cartButton.x = ui.size.x*0.3 - ui.cartButton.width/2;
		ui.cartButton.y = ui.size.y*0.9 - ui.cartButton.height;
		if (spriteClicked(ui.cartButton)) {
			changeScreen(SCREEN_CART);
		}

		let yPos = 0;
		for (let i = 0; i < ui.showButtons.length; i++) {
			let button = ui.showButtons[i];

			button.x = ui.size.x/2 - button.width/2;
			button.y = yPos + 100; //trying to lower the buttons so its not at the top center
			yPos += button.height + 10;

			if (spriteClicked(button)) {
				selectShow(i);
				changeScreen(SCREEN_SEAT_LIST);
				//@server getSeats.php?showId=3
				//SeatAvailable0, SeatPrice0
				//SeatAvailable1, SeatPrice1
				//...
				//SeatAvailable95, SeatPrice95
			}
		}
	} else if (ui.currentScreen == SCREEN_SEAT_LIST) {
		//@stp You could click the "add to card" button with no seats selected, but it's invisible to avoid this class of errors.
		//@stp Is it possible to select too many seats?
		if (onFirstFrame) {
			showManager.currentSeatIndices = [];
			ui.seatButtons = [];

			for (let y = 0; y < THEATER_ROWS; y++) {
				for (let x = 0; x < THEATER_COLS; x++) {
					let button = createSeatSprite();
					ui.seatButtons.push(button);
				}
			}

			ui.addToCartButton = createTextButtonSprite("Add to cart(and checkout)");
		}

		let seatWidth = 64;
		let seatHeight = 64;
		let pad = seatWidth * 0.156;

		let totalWidth;
		let totalHeight;
		for (let i = 0; i < 999; i++) {
			seatWidth *= 0.9;
			seatHeight *= 0.9;
			totalWidth = (THEATER_COLS * (seatWidth+pad));
			totalHeight = (THEATER_ROWS * (seatHeight+pad));
			pad = seatWidth * 0.156;

			if (
				totalWidth <= ui.size.x*0.8 &&
				totalHeight <= ui.size.y*0.8
			) break;
		}

		let offsetX = ui.size.x/2 - totalWidth/2;
		let offsetY = 20;

		for (let i = 0; i < ui.seatButtons.length; i++) {
			let button = ui.seatButtons[i];
			button.tint = 0xFFFFFF;

			let x = i % THEATER_COLS;
			let y = Math.floor(i / THEATER_COLS);
			button.width = seatWidth;
			button.height = seatHeight;
			button.x = x * (button.width + pad) + offsetX;
			button.y = y * (button.height + pad) + offsetY;

			if (showManager.currentSeatIndices.indexOf(i) != -1) button.tint = 0xFFFF00;
			if (spriteClicked(button)) {
				selectSeat(i);
			}
		}

		if (showManager.currentSeatIndices.length == 0) {
			ui.addToCartButton.visible = false;
		} else {
			ui.addToCartButton.visible = true;
		}

		ui.addToCartButton.x = ui.size.x*0.5 - ui.addToCartButton.width/2;
		ui.addToCartButton.y = ui.size.y*0.9 - ui.addToCartButton.height;
		if (spriteClicked(ui.addToCartButton)) {
			let show = showManager.shows[showManager.currentShowIndex];

			for (let i = 0; i < showManager.currentSeatIndices.length; i++) {
				let cartEntry = {
					showId: show.id,
					seatIndex: showManager.currentSeatIndices[i]
				};
				cart.push(cartEntry);
			}
			changeScreen(SCREEN_CART);
		}

	} else if (ui.currentScreen == SCREEN_CART) {
		//@stp There could be too many items to display
		//@stp You could buy with nothing in your cart
		//@stp The title of the show could change while a ticket in your cart, what happens?
		if (onFirstFrame) {

			for (let i = 0; i < cart.length; i++) {
				let entry = cart[i];
				let show = getShowById(entry.showId);
				entry.sprite = createTextButtonSprite(show.name + ", " + convertSeatIndexToString(entry.seatIndex));
				entry.removeSprite = createTextButtonSprite("X");
			}

			ui.backButton = createTextButtonSprite("Browse more shows");
			ui.buyButton = createTextButtonSprite("Buy");
		}

		let yPos = ui.size.y*0.15;
		for (let i = 0; i < cart.length; i++) {
			let entry = cart[i];
			let sprite = entry.sprite;
			let removeSprite = entry.removeSprite;

			sprite.x = ui.size.x/2 - sprite.width/2;
			sprite.y = yPos;

			removeSprite.x = sprite.x + sprite.width + ui.size.x*0.01;
			removeSprite.y = sprite.y;
			if (spriteClicked(removeSprite)) {
				sprite.visible = false;
				removeSprite.visible = false;
				cart.splice(i, 1);
				i--;
				continue;
			}

			yPos += sprite.height + ui.size.y*0.02;
		}

		ui.backButton.x = ui.size.x*0.4 - ui.backButton.width/2;
		ui.backButton.y = ui.size.y - ui.backButton.height - ui.size.y*0.15;
		if (spriteClicked(ui.backButton)) {
			changeScreen(SCREEN_SHOW_LIST);
		}

		ui.buyButton.x = ui.size.x*0.7 - ui.buyButton.width/2;
		ui.buyButton.y = ui.size.y - ui.buyButton.height - ui.size.y*0.15;
		if (spriteClicked(ui.buyButton)) {
			changeScreen(SCREEN_PAYMENT_INFO);
		}

	} else if (ui.currentScreen == SCREEN_PAYMENT_INFO) {
		//@stp Check if card is expired
		//@stp Check if number and name are valid
		//@stp Card could be rejected for wrong brand
		//@stp Card could be rejected for not enough money
		if (onFirstFrame) {
			//@server Possibly load saved credit card info
			ui.nameField = createInputTextField("Name on card");
			ui.creditNumber = createInputTextField("Credit Card Number");
			ui.cvvField = createInputTextField("CVV");
			ui.dateField = createInputTextField("Date");
			// todo exp date picker

			ui.zipField = createInputTextField("Zip");

			ui.buyButton = createTextButtonSprite("Buy");
		}

		let downPad = ui.size.y*0.02;
		ui.nameField.x = ui.size.x / 2 - ui.nameField.width / 2;
		ui.nameField.y = ui.size.y*0.15;

		ui.creditNumber.x = ui.size.x / 2 - ui.creditNumber.width / 2;
		ui.creditNumber.y = ui.nameField.y + ui.nameField.height + downPad;

		ui.cvvField.x = ui.size.x / 2 - ui.cvvField.width / 2;
		ui.cvvField.y = ui.creditNumber.y + ui.creditNumber.height + downPad;

		ui.dateField.x = ui.size.x / 2 - ui.dateField.width / 2;
		ui.dateField.y = ui.cvvField.y + ui.cvvField.height + downPad;

		ui.zipField.x = ui.size.x / 2 - ui.zipField.width / 2;
		ui.zipField.y = ui.dateField.y + ui.dateField.height + downPad;

		ui.buyButton.x = ui.size.x * 0.5 - ui.buyButton.width / 2;
		ui.buyButton.y = ui.size.y*0.85 - ui.buyButton.height;
		if (spriteClicked(ui.buyButton)) {
			chargeCreditCard(ui.nameField.text, ui.creditNumber.text, ui.dateField.text, 0); //@todo Figure out the price // The server probably has to do this
			//changeScreen(SCREEN_WAITING_FOR_SERVER); //@todo(Jeru): Make this actually work
			changeScreen(SCREEN_RECEIPT);
			//@server buyTickets.php?seats=3,31,3,46,2,25,1,73 // These are interleaved showIds and seat numbers
			//Success: 1
			//Fail: 0,reasonString
		}
	} else if (ui.currentScreen == SCREEN_RECEIPT) {
		//@stp There could be too many items to display
		//@stp Syncing show details if they changed
		//@todo We need name, age, address, telephone, and email, but the user profile should already have that.
		if (onFirstFrame) {
			let show = showManager.shows[showManager.currentShowIndex];

			ui.nameField = createTextField();
			ui.nameField.text = show.name;

			ui.showDateField = createTextField();
			ui.showDateField.text = show.date.toString();

			ui.seatsField = createTextField();
			ui.seatsField.text = "Seats: ";
			for (let i = 0; i < showManager.currentSeatIndices.length; i++) {
				let seatIndex = showManager.currentSeatIndices[i];
				ui.seatsField.text = convertSeatIndexToString(seatIndex);
				if (i < showManager.currentSeatIndices.length-1) ui.seatsField.text += ", ";
			}

			ui.doneButton = createTextButtonSprite("Done");
		}

		let downPad = ui.size.y*0.02;
		ui.nameField.x = ui.size.x / 2 - ui.nameField.width / 2;
		ui.nameField.y = ui.size.y*0.15;

		ui.showDateField.x = ui.size.x / 2 - ui.showDateField.width / 2;
		ui.showDateField.y = ui.nameField.y + ui.nameField.height + downPad;

		ui.seatsField.x = ui.size.x / 2 - ui.seatsField.width / 2;
		ui.seatsField.y = ui.showDateField.y + ui.showDateField.height + downPad;

		ui.doneButton.x = ui.size.x * 0.5 - ui.doneButton.width / 2;
		ui.doneButton.y = ui.size.y*0.85 - ui.doneButton.height;

		if (spriteClicked(ui.doneButton)) {
			changeScreen(SCREEN_SHOW_LIST);
		}
	} else if (ui.currentScreen == SCREEN_SHOW_EDITOR) {
		//@stp @todo
		if (onFirstFrame) {

		}
		//@todo Delete show
		//@server editShow.php?showId=3&showName=MyShowName&showDate=3248092347
		// 1
	} else if (ui.currentScreen == SCREEN_SEAT_EDITOR) {
		//@stp @todo
		if (onFirstFrame) {

		}
		//@server editSeats.php?showId=3&seats=2,52,26,12&price=5
		// 1
	} else if (ui.currentScreen == SCREEN_REPORT) {
		//@stp @todo
		if (onFirstFrame) {
			//@server getAllReceipts.php
		}
	}

	{ /// Update input field
		ui.textCursorSprite.alpha = 0;
		for (let i = 0; i < ui.pixiInputFields.length; i++) {
			let bg = ui.pixiInputFieldBackgrounds[i];
			let field = ui.pixiInputFields[i];

			let pad = 5;
			bg.width = field.width + pad;
			if (bg.width < ui.size.x*0.25) bg.width = ui.size.x*0.25;
			bg.height = field.height + pad;

			bg.x = field.x + field.width/2 - bg.width/2;
			bg.y = field.y + field.height/2 - bg.height/2;

			if (field == ui.selectedInputField) {
				field.style.fill = 0x404080;
				let cursorPhase = (Math.sin(ui.selectedInputFieldTime*2*Math.PI*2-Math.PI*0.5)/2)+0.5;

				ui.textCursorSprite.width = ui.size.x*0.005;
				ui.textCursorSprite.height = field.height;
				ui.textCursorSprite.x = field.x + field.width;
				ui.textCursorSprite.y = field.y;
				ui.textCursorSprite.alpha = cursorPhase;

				let len = app.inputHtmlElement.value.length;
				app.inputHtmlElement.setSelectionRange(len, len);

				ui.selectedInputFieldTime += elapsed;
			} else {
				field.style.fill = 0x000000;
			}

			if (spriteClicked(bg) && ui.selectedInputField != field) {
				ui.selectedInputField = field;
				ui.selectedInputFieldTime = 0;

				app.inputHtmlElement.value = ui.selectedInputField.text;

				setTimeout(function() {
					app.inputHtmlElement.blur();
				}, 100);
				setTimeout(function() {
					app.inputHtmlElement.focus();
				}, 200);
			}

			//@stp What if the user types a weird character
			ui.selectedInputField.text = app.inputHtmlElement.value;
		}
	}

	if (ui.popup != null) { /// Update popup
		ui.popupTime += elapsed;

		let maxTime = 5;
		if (ui.popupTime > maxTime) {
			let fadeTime = ui.popupTime - maxTime;
			ui.popup.alpha = 1 - fadeTime;
			if (ui.popup.alpha < 0) {
				ui.foregroundSprite.removeChild(ui.popup);
				ui.popup = null;
			}
		}
	}

	ui.mouseJustDown = false;
	ui.mouseJustUp = false;

	app.time += elapsed;
}

function changeScreen(newScreen) {
	ui.currentScreen = newScreen;
	ui.screenTime = 0;
}

function createTextField() {
	let field = new PIXI.Text("", {fontFamily: "Arial", fontSize: defaultFontSize});
	ui.stageSprite.addChild(field);
	ui.pixiFields.push(field);
	return field;
}

function createInputTextField(hintText) {
	if (verboseLogging) console.log("Input text field created"); //@stp What if you accidently create a sprite every frame? Then you'll see this log message
	let sprite = new PIXI.NineSlicePlane(PIXI.Texture.from("assets/nineSliceButton.png"), 32, 32, 32, 32);
	sprite.tint = 0xFFE0E0E0;
	ui.stageSprite.addChild(sprite);
	ui.pixiInputFieldBackgrounds.push(sprite);

	let field = new PIXI.Text("", {fontFamily: "Arial", fontSize: defaultFontSize});
	field.text = hintText;
	ui.stageSprite.addChild(field);
	ui.pixiInputFields.push(field);
	return field;
}

function createTextButtonSprite(text) {
	let field = new PIXI.Text("", {fontFamily: "Arial", fontSize: defaultFontSize});
	field.text = text;

	let sprite = new PIXI.NineSlicePlane(PIXI.Texture.from("assets/buttonAsset.png"), 5, 5, 5, 5);
	let pad = ui.size.x*0.01;
	sprite.width = field.width + pad;
	sprite.height = field.height + pad;
	sprite.tint = 0xFF47C1F5;

	field.x = sprite.x + sprite.width/2 - field.width/2;
	field.y = sprite.y + sprite.height/2 - field.height/2;
	sprite.addChild(field);

	ui.stageSprite.addChild(sprite);
	ui.pixiSprites.push(sprite);
	return sprite;
}

function createSeatSprite() {
	let sprite = new PIXI.NineSlicePlane(PIXI.Texture.from("assets/nineSliceButton.png"), 32, 32, 32, 32);
	ui.stageSprite.addChild(sprite);
	ui.pixiSprites.push(sprite);
	return sprite;
}

function spriteClicked(sprite) {
	if (!sprite.visible) return false;

	let hoveringButton = false;
	if (ui.mouse.x > sprite.x && ui.mouse.x < sprite.x + sprite.width && ui.mouse.y > sprite.y && ui.mouse.y < sprite.y + sprite.height) {
		hoveringButton = true;
	}

	if (ui.mouseJustDown && hoveringButton) {
		ui.mouseJustDown = false; // Prevent mouse from clicking multiple objects on the same frame
		return true;
	}
	return false;
}

function attemptLogin(username, password) {
	//@stp Test login case sensitivity
	//False<br> Username does not exist.
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status <= 99 || this.status >= 400) {
				app.userId = 0;
				showPopup("There was problem connecting");
				changeScreen(SCREEN_LOGIN);
			} else if (this.status == 200) {
				let prefix = this.responseText.substring(0, 4);
				if (prefix == "True") {
					let colonIndex = this.responseText.indexOf(":");
					if (colonIndex == -1) console.log("No colon?!"); //@stp
					let numberStr = this.responseText.substring(colonIndex+2);
					app.userId = parseInt(numberStr);
					showPopup("Welcome user "+app.userId);
					changeScreen(SCREEN_SHOW_LIST);
				} else if (prefix == "Fals") {
					showPopup("Wrong credientials");
					changeScreen(SCREEN_LOGIN);
				} else {
					console.log("Bad output: "+this.responseText);
				}
			}
		}
	}
	//xmlhttp.open("GET", "login.html", true);
	//@stp xmlhttp.onerror and this.status
	xmlhttp.open("GET", "includes/login.inc.php?username="+username+"&password="+password, true);
	xmlhttp.send();
}

function selectShow(showIndex) {
	showManager.currentShowIndex = showIndex;
}

function selectSeat(seatId) {
	let index = showManager.currentSeatIndices.indexOf(seatId);

	if (index == -1) {
		showManager.currentSeatIndices.push(seatId);
	} else {
		showManager.currentSeatIndices.splice(index, 1);
	}
}

function chargeCreditCard(cardName, cardNumber, cvv, expDate, amount) {
	
}

function showPopup(text) {
	console.log("Popup: "+text);

	if (ui.popup != null) {
		ui.foregroundSprite.removeChild(ui.popup);
		ui.popup = null;
	}

	let field = new PIXI.Text(text, {fontFamily: "Arial", fontSize: defaultFontSize});

	ui.popup = new PIXI.NineSlicePlane(PIXI.Texture.from("assets/nineSliceButton.png"), 32, 32, 32, 32);
	ui.popup.width = field.width;
	ui.popup.height = field.height;
	ui.popup.addChild(field);

	ui.popup.x = ui.size.x/2 - ui.popup.width/2;
	ui.popup.y = ui.size.y - ui.popup.height - ui.size.y*0.05;
	ui.popup.tint = 0xFF404040;

	ui.popupTime = 0;

	ui.foregroundSprite.addChild(ui.popup);
}

function getShowById(id) {
	for (let i = 0; i < showManager.shows.length; i++) {
		let show = showManager.shows[i];
		if (show.id == id) return show;
	}

	showPopup("Couldn't find show with id "+id);
	return null;
}

function convertSeatIndexToString(seatIndex) {
	let col = seatIndex % THEATER_COLS;
	let row = Math.floor(seatIndex / THEATER_COLS);

	let str = "";
	str += String.fromCharCode(65 + row);
	str += col + 1;
	return str;
}
