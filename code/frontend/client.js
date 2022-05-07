//@todo Prevent two people from buying the same seat
//@todo Fix time stepper interval
//@todo Make debugMode toggles
//@todo Make sure site works
//@todo Figure out presentation
//@todo Make it so you can't select red seats
//@todo Filter reports by date, and by show
//@todo Guest mode
//@todo Popup styles
//@todo Make sure $conn works with the new Linode server
//
//@todo Do background for plain text fields
//@todo Prevent cart and show list screen from overflowing the layout
//@todo Legend
//@todo Make select all seats button

let verboseLogging = false;
let defaultFontSize = 35;
let titleFontSize = 60;
let seatPriceFontSize = 20;
let blueColor = 0xFF47C1F5;

let SCREEN_NONE               = 0;
let SCREEN_LOGIN              = 1;
let SCREEN_CREATE_ACCOUNT     = 2;
let SCREEN_WAITING_FOR_SERVER = 3;
let SCREEN_SHOW_LIST          = 4;
let SCREEN_SEAT_LIST          = 5;
let SCREEN_PAYMENT_INFO       = 6;
let SCREEN_CART               = 7;
let SCREEN_RECEIPT            = 8;
let SCREEN_SHOW_EDITOR        = 9;
let SCREEN_SEAT_EDITOR        = 10;
let SCREEN_REPORT             = 11;

let app = {};
app.pixiApp = null;
app.userId = 0;
app.isAdmin = 0;
app.time = 0;

let ui = {};
ui.mouse = {};
ui.mouseDown = false;
ui.mouseJustDown = false;
ui.mouseJustUp = false;
ui.prevSize = {x: 0, y: 0};
ui.size = {x: 0, y: 0};
ui.pixiInputFields = [];
ui.dateTimePickers = [];

ui.prevScreen = -1;
ui.currentScreen = SCREEN_NONE;
ui.screenTime = 0;
ui.screenTransBackwards = false;
ui.prevScreenTexture = null;

ui.popup = null;
ui.popupTime = 0;

ui.stageSprite = null;
ui.stageInteractionSprite = null;
ui.backgroundSprite = null;
ui.foregroundSprite = null;

let showManager = {};
showManager.shows = [];
showManager.currentShowIndex = 0;
showManager.currentSeatIndices = [];

let cart = [];

let THEATER_ROWS = 8;
let THEATER_COLS = 12;

let debugMode = true;

function runClient() {
	let pixiApp = new PIXI.Application({
		backgroundColor: 0xFF262626
	});

	document.body.appendChild(pixiApp.view);

	pixiApp.ticker.add(app.updateClient);
	app.pixiApp = pixiApp;

	ui.backgroundSprite = new PIXI.Sprite();
	app.pixiApp.stage.addChild(ui.backgroundSprite);

	ui.stageSprite = new PIXI.Sprite();
	app.pixiApp.stage.addChild(ui.stageSprite);

	ui.foregroundSprite = new PIXI.Sprite();
	app.pixiApp.stage.addChild(ui.foregroundSprite);

	ui.stageInteractionSprite = new PIXI.Sprite.from("assets/white.png");
	ui.stageInteractionSprite.tint = 0xFF262626;
	ui.stageSprite.addChild(ui.stageInteractionSprite);

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

	generateUml();

	changeScreen(SCREEN_LOGIN);
}

app.updateClient = function(delta) {
	let elapsed = 1/60;

	let newSize = {x: window.innerWidth, y: window.innerHeight};
	let allowResize = true;
	if (newSize.x == ui.size.x && newSize.y < ui.size.y - 200) allowResize = false;

	if (allowResize) {
		ui.size.x = window.innerWidth;
		ui.size.y = window.innerHeight;
	}

	let screenSizeChanged = false;
	if (ui.prevSize.x != ui.size.x || ui.prevSize.y != ui.size.y) {
		ui.prevSize.x = ui.size.x;
		ui.prevSize.y = ui.size.y;
		app.pixiApp.renderer.resize(ui.size.x, ui.size.y);
		screenSizeChanged = true;
	}

	let onFirstFrame = false;
	if (ui.prevScreen != ui.currentScreen) {
		if (ui.prevScreen != -1) {
			if (ui.prevScreenSprite) {
				ui.prevScreenSprite.parent.removeChild(ui.prevScreenSprite);
				ui.prevScreenSprite.destroy();
			}
			let texture = app.pixiApp.renderer.generateTexture(ui.stageSprite);
			ui.prevScreenSprite = new PIXI.Sprite(texture);
			if (ui.screenTransBackwards) {
				ui.foregroundSprite.addChild(ui.prevScreenSprite);
			} else {
				ui.backgroundSprite.addChild(ui.prevScreenSprite);
			}
		}

		function removeAllChildren(sprite, startingAt) {
			while (sprite.children.length > startingAt) {
				sprite.removeChild(sprite.children[startingAt]);
			}
		}
		removeAllChildren(ui.stageSprite, 1);
		ui.pixiInputFields = [];
		ui.dateTimePickers = [];

		ui.prevScreen = ui.currentScreen;
		ui.screenTime = 0;
		onFirstFrame = true;
	}

	let isPortraitMode = false;
	if (ui.size.y > ui.size.x) isPortraitMode = true;

	ui.stageInteractionSprite.width = ui.size.x;
	ui.stageInteractionSprite.height = ui.size.y;

	if (isPortraitMode) {
		if (ui.screenTransBackwards) {
			ui.prevScreenSprite.x = clampMap(ui.screenTime, 0, 0.25, 0, ui.size.x, 0);
		} else {
			ui.stageSprite.x = clampMap(ui.screenTime, 0, 0.25, ui.size.x, 0, QUAD_OUT);
		}
	} else {
		if (ui.screenTransBackwards) {
			ui.prevScreenSprite.alpha = clampMap(ui.screenTime, 0, 0.25, 1, 0, QUAD_OUT);
		} else {
			ui.stageSprite.alpha = clampMap(ui.screenTime, 0, 0.25, 0, 1, QUAD_OUT);
		}
	}

	function placeAtTitlePosition(sprite) {
		sprite.x = ui.size.x/2 - sprite.width/2;
		sprite.y = ui.size.y*0.01;
	}

	function placeAtTop(sprite) {
		sprite.x = ui.size.x/2 - sprite.width/2;
		sprite.y = ui.size.y*0.15;
	}

	function placeAtTopLeft(sprite) {
		sprite.x = ui.size.x*0.05;
		sprite.y = ui.size.y*0.05;
	}

	function placeAtBottom(sprite) {
		sprite.x = ui.size.x/2 - sprite.width/2;
		sprite.y = ui.size.y - sprite.height - ui.size.y*0.05;
	}

	function placeUnder(below, above) {
		// below.x = ui.size.x / 2 - below.width / 2;
		below.x = above.x + above.width/2 - below.width/2;
		below.y = above.y + above.height + 10;
	}

	function placeAtCenter(sprite) {
		sprite.x = ui.size.x / 2 - sprite.width / 2;
		sprite.y = ui.size.y / 2 - sprite.height / 2;
	}

	function placeAtBottomLeft(sprite) {
		sprite.x = ui.size.x*0.05;
		sprite.y = ui.size.y - sprite.height - ui.size.y*0.05;
	}

	function placeAtBottomRight(sprite) {
		sprite.x = ui.size.x - sprite.width - ui.size.x*0.05;
		sprite.y = ui.size.y - sprite.height - ui.size.y*0.05;
	}


	function simulateBackButton(onFirstFrame, elapsed, prevScreen) {
		if (onFirstFrame) ui.backButton = createTextButtonSprite("Back");
		placeAtTopLeft(ui.backButton);
		if (spriteClicked(ui.backButton)) {
			changeScreenBackwards(prevScreen);
		}
	}

	if (ui.currentScreen == SCREEN_NONE) {
	} else if (ui.currentScreen == SCREEN_LOGIN) {
		if (onFirstFrame) {
			getShowsFromServer(false);

			ui.userField = createInputTextField("Username", 50);
			ui.passField = createInputTextField("Password", 32);
			ui.loginButton = createTextButtonSprite("Login");
			ui.instantLogin = createTextButtonSprite("Instant login");
			ui.instantReceipt = createTextButtonSprite("Instant receipt");
			ui.debugButton = createTextButtonSprite("Debug code");
			ui.createAccountButton = createTextButtonSprite("Create Account");
		}

		if (onFirstFrame) ui.title = createTitleText("Theatre Los Portales");
		placeAtTitlePosition(ui.title);

		placeAtTop(ui.userField);
		placeUnder(ui.passField, ui.userField);
		placeUnder(ui.loginButton, ui.passField);
		placeUnder(ui.instantLogin, ui.loginButton);
		placeUnder(ui.instantReceipt, ui.instantLogin);
		placeUnder(ui.debugButton, ui.instantReceipt);

		placeAtBottomLeft(ui.createAccountButton);

		if (spriteClicked(ui.loginButton)) {
			attemptLogin(ui.userField.text, ui.passField.text);
		}

		if (spriteClicked(ui.instantLogin)) {
			attemptLogin("Jeru", "testPass");
		}

		if (spriteClicked(ui.debugButton)) {
			// let url = "includes/newShowInsert.inc.php?showname=testShow&showdate=2022-4-21&showtime=15:25:00&showprice=0";
			// let url = "includes/newDeleteShow.php?ShowID=31";
			// let url = "includes/buySeats.php?UserID=22&str=32-1-32-2-32-3-33-4-33-5-33-6";
			// let url = "includes/editShow.php?ShowID=32&ShowName=newName&ShowDate=2022-4-25&ShowTime=16:25:00";
			// let url = "includes/newUserInsert.inc.php?Username=Jeru&Password=testPass&Dob=1994-3-29&Phone=15552350&Address=123%20Place&Email=myName@site.com";
			// makeRequest(url, function(responseText) {
			// 	console.log("Url: "+url);
			// 	console.log(responseText);
			// });
		}

		if (spriteClicked(ui.instantReceipt)) {
			cart = [
				{showId: 34, seatIndex: 1, price: 5}, 
				{showId: 34, seatIndex: 13, price: 5}, 
				{showId: 34, seatIndex: 25, price: 15}, 
				{showId: 32, seatIndex: 22, price: 10}, 
				{showId: 32, seatIndex: 10, price: 10}, 
			];
			changeScreen(SCREEN_RECEIPT);
		}

		if (spriteClicked(ui.createAccountButton)) {
			changeScreen(SCREEN_CREATE_ACCOUNT);
		}

	} else if (ui.currentScreen == SCREEN_CREATE_ACCOUNT) {
		if (onFirstFrame) {
			ui.userNameField = createInputTextField("Username", 50);
			ui.passwordField = createInputTextField("Password", 32);
			ui.dobPicker = createDatePicker("Dob");
			ui.phoneField = createInputTextField("Phone number", 16);
			ui.addressField = createInputTextField("Address", 64);
			ui.emailField = createInputTextField("Email", 64);
			ui.createButton = createTextButtonSprite("Create");
		}

		if (onFirstFrame) ui.title = createTitleText("Create account");
		placeAtTitlePosition(ui.title);

		placeAtTop(ui.userNameField);
		placeUnder(ui.passwordField, ui.userNameField);
		placeUnder(ui.dobPicker, ui.passwordField);
		placeUnder(ui.phoneField, ui.dobPicker);
		placeUnder(ui.addressField, ui.phoneField);
		placeUnder(ui.emailField, ui.addressField);

		placeAtBottom(ui.createButton);
		if (spriteClicked(ui.createButton)) {
			let url = "includes/newUserInsert.inc.php?";
			url += "Username="+ui.userNameField.text + "&";
			url += "Password="+ui.passwordField.text + "&";
			url += "Dob="+ui.dobPicker.text + "&";
			url += "Phone="+ui.phoneField.text + "&";
			url += "Address="+ui.addressField.text + "&";
			url += "Email="+ui.emailField.text;
			makeRequest(url, function() {
				showPopup("You user has been created, you can sign in now");
				changeScreen(SCREEN_LOGIN);
			});
		}

		simulateBackButton(onFirstFrame, elapsed, SCREEN_LOGIN);
	} else if (ui.currentScreen == SCREEN_WAITING_FOR_SERVER) {
		//@stp Time out on this screen
		if (onFirstFrame) {
			ui.waitingText = createTextField();
			ui.waitingText.text = "Waiting...";
		}

		placeAtCenter(ui.waitingText);
	} else if (ui.currentScreen == SCREEN_SHOW_LIST) {
		if (onFirstFrame) {
			ui.showButtons = [];

			for (let i = 0; i < showManager.shows.length; i++) {
				let show = showManager.shows[i];
				let buttonLabel = show.name + " at:";
				buttonLabel += (show.date.getMonth()+1) + "-";
				buttonLabel += show.date.getDate() + "-";
				buttonLabel += show.date.getFullYear() + " ";
				buttonLabel += show.date.getHours() + ":";
				buttonLabel += show.date.getMinutes() + ":";
				buttonLabel += show.date.getSeconds();
				let sprite = createTextButtonSprite(buttonLabel);
				ui.showButtons.push(sprite);
			}

			ui.addShowButton = createTextButtonSprite("Add show");
			ui.cartButton = createTextButtonSprite("Cart");
		}

		if (onFirstFrame) ui.title = createTitleText("Shows");
		placeAtTitlePosition(ui.title);

		ui.addShowButton.visible = app.isAdmin;
		ui.addShowButton.x = ui.size.x*0.8 - ui.addShowButton.width/2;
		ui.addShowButton.y = ui.size.y*0.9 - ui.addShowButton.height;
		if (spriteClicked(ui.addShowButton)) { // if the button add show is clicked then.. 
			let date = new Date();
			let dateStr = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
			let timeStr = date.getHours() + ":00:00";
			let url = "includes/newShowInsert.inc.php?showname=&showdate="+dateStr+"&showtime="+timeStr+"&showprice=0";
			makeRequest(url, function(responseText) {
				let showId = parseInt(responseText);
				getShowsFromServer(false, function() {
					selectShow(getShowIndex(getShowById(showId)), function() {
						changeScreen(SCREEN_SHOW_EDITOR);
					});
				});
			});
		}

		ui.cartButton.x = ui.size.x*0.3 - ui.cartButton.width/2;
		ui.cartButton.y = ui.size.y*0.9 - ui.cartButton.height;
		if (spriteClicked(ui.cartButton)) {
			changeScreen(SCREEN_CART);
		}

		if (onFirstFrame) ui.reportButton = createTextButtonSprite("Get report");
		ui.reportButton.visible = app.isAdmin;
		placeUnder(ui.reportButton, ui.addShowButton);
		if (spriteClicked(ui.reportButton)) {
			changeScreen(SCREEN_REPORT);
		}

		let yPos = 0;
		for (let i = 0; i < ui.showButtons.length; i++) {
			let button = ui.showButtons[i];

			button.x = ui.size.x/2 - button.width/2;
			button.y = yPos + 100; //trying to lower the buttons so its not at the top center
			yPos += button.height + 10;

			if (spriteClicked(button)) {
				selectShow(i, function() {
					changeScreen(SCREEN_SEAT_LIST);
				});
			}
		}
	} else if (ui.currentScreen == SCREEN_SEAT_LIST) {
		if (onFirstFrame) {
			showManager.currentSeatIndices = [];
			ui.seatButtons = [];

			for (let y = 0; y < THEATER_ROWS; y++) {
				for (let x = 0; x < THEATER_COLS; x++) {
					let show = showManager.shows[showManager.currentShowIndex];
					let seat = show.seats[y*THEATER_COLS + x];
					let button = createSeatSprite(seat);
					ui.seatButtons.push(button);
				}
			}

			ui.addToCartButton = createTextButtonSprite("Add to cart");
			ui.editShowButton = createTextButtonSprite("Edit show");
		}

		if (onFirstFrame) ui.title = createTitleText("Seats selection");
		placeAtTitlePosition(ui.title);

		let seatWidth = 64;
		let seatHeight = 64;
		let pad = seatWidth * 0.156;

		let totalWidth;
		let totalHeight;
		for (let i = 0; i < 999; i++) {
			seatWidth *= 0.95;
			seatHeight *= 0.95;
			totalWidth = (THEATER_COLS * (seatWidth+pad));
			totalHeight = (THEATER_ROWS * (seatHeight+pad));
			pad = seatWidth * 0.156;

			if (
				totalWidth <= ui.size.x*0.95 &&
				totalHeight <= ui.size.y*0.8
			) break;
		}

		let offsetX = ui.size.x/2 - totalWidth/2;
		let offsetY = ui.size.y*0.15;

		for (let i = 0; i < ui.seatButtons.length; i++) {
			let button = ui.seatButtons[i];
			button.tint = 0x60FF60;

			let x = i % THEATER_COLS;
			let y = Math.floor(i / THEATER_COLS);
			button.width = seatWidth;
			button.height = seatHeight;
			button.x = x * (button.width + pad) + offsetX;
			button.y = y * (button.height + pad) + offsetY;

			let show = showManager.shows[showManager.currentShowIndex];
			let seat = show.seats[i];
			if (seat.userId != 0) button.tint = 0x900000;
			if (showManager.currentSeatIndices.indexOf(i) != -1) button.tint = 0xFFFF00;
			if (spriteClicked(button)) {
				selectSeat(i);
			}
		}

		ui.addToCartButton.visible = showManager.currentSeatIndices.length != 0;

		ui.addToCartButton.x = ui.size.x*0.5 - ui.addToCartButton.width/2;
		ui.addToCartButton.y = ui.size.y*0.9 - ui.addToCartButton.height;
		if (spriteClicked(ui.addToCartButton)) {
			let show = showManager.shows[showManager.currentShowIndex];

			for (let i = 0; i < showManager.currentSeatIndices.length; i++) {
				let cartEntry = {
					showId: show.id,
					seatIndex: showManager.currentSeatIndices[i],
					price: 0,
				};
				//@incomplete The client controls the price, this is insecure! This should be asking the server the price
				cartEntry.price = show.seats[cartEntry.seatIndex].price;

				cart.push(cartEntry);
			}
			changeScreen(SCREEN_CART);
		}

		placeAtBottomLeft(ui.editShowButton);

		ui.editShowButton.visible = app.isAdmin && showManager.currentSeatIndices.length != 0;
		if (spriteClicked(ui.editShowButton)) changeScreen(SCREEN_SHOW_EDITOR);

		if (onFirstFrame) ui.editSeatsButton = createTextButtonSprite("Edit seats");
		ui.editSeatsButton.visible = app.isAdmin;
		placeUnder(ui.editSeatsButton, ui.addToCartButton);
		if (spriteClicked(ui.editSeatsButton)) changeScreen(SCREEN_SEAT_EDITOR);

		simulateBackButton(onFirstFrame, elapsed, SCREEN_SHOW_LIST);
	} else if (ui.currentScreen == SCREEN_CART) {
		//@stp You could buy with nothing in your cart
		if (onFirstFrame) {

			for (let i = 0; i < cart.length; i++) {
				let entry = cart[i];
				let show = getShowById(entry.showId);
				entry.sprite = createTextButtonSprite(show.name + ", " + convertSeatIndexToString(entry.seatIndex) + " $" + entry.price);
				entry.removeSprite = createTextButtonSprite("X");
				entry.removeSprite.tint = 0xA00000;
			}

			ui.buyButton = createTextButtonSprite("Buy");
		}

		if (onFirstFrame) ui.title = createTitleText("Cart");
		placeAtTitlePosition(ui.title);

		let total = 0;
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

			total += entry.price;
			yPos += sprite.height + ui.size.y*0.02;
		}

		if (onFirstFrame) ui.totalField = createTextField("------ Total: $"+total + " ------");
		//@incomplete
		placeUnder(ui.totalField, cart[cart.length-1].sprite);

		ui.buyButton.x = ui.size.x*0.7 - ui.buyButton.width/2;
		ui.buyButton.y = ui.size.y - ui.buyButton.height - ui.size.y*0.15;
		if (spriteClicked(ui.buyButton)) {
			changeScreen(SCREEN_PAYMENT_INFO);
		}

		if (onFirstFrame) ui.browseMoreButton = createTextButtonSprite("Browse more");
		placeAtBottom(ui.browseMoreButton);
		if (spriteClicked(ui.browseMoreButton)) changeScreen(SCREEN_SHOW_LIST);

		simulateBackButton(onFirstFrame, elapsed, SCREEN_SHOW_LIST);
	} else if (ui.currentScreen == SCREEN_PAYMENT_INFO) {
		//@stp Check if card is expired
		//@stp Check if number and name are valid
		//@stp Card could be rejected for wrong brand
		//@stp Card could be rejected for not enough money
		if (onFirstFrame) {
			//@server Possibly load saved credit card info
			ui.nameField = createInputTextField("Name on card", 64);
			ui.creditNumber = createInputTextField("Credit Card Number", 32);
			ui.cvvField = createInputTextField("CVV", 4);
			ui.dateField = createDatePicker("Exp");

			ui.zipField = createInputTextField("Zip", 16);

			ui.buyButton = createTextButtonSprite("Buy");
		}

		if (onFirstFrame) ui.title = createTitleText("Payment info");
		placeAtTitlePosition(ui.title);

		placeAtTop(ui.nameField);
		placeUnder(ui.creditNumber, ui.nameField);
		placeUnder(ui.cvvField, ui.creditNumber);
		placeUnder(ui.dateField, ui.cvvField);
		placeUnder(ui.zipField, ui.dateField);

		ui.buyButton.x = ui.size.x * 0.5 - ui.buyButton.width / 2;
		ui.buyButton.y = ui.size.y*0.85 - ui.buyButton.height;
		if (spriteClicked(ui.buyButton)) {
			let total = 0;
			for (let i = 0; i < cart.length; i++) {
				total += cart[i].price;
			}

			chargeCreditCard(ui.nameField.text, ui.creditNumber.text, ui.cvvField, ui.dateField.text, total);
		}

		simulateBackButton(onFirstFrame, elapsed, SCREEN_CART);
	} else if (ui.currentScreen == SCREEN_RECEIPT) {
		//@stp There could be too many items to display
		if (onFirstFrame) {
			ui.receiptFields = [];

			let total = 0;
			for (let i = 0; i < cart.length; i++) {
				let entry = cart[i];
				total += entry.price;

				let show = getShowById(entry.showId);

				let str = show.name + " " + convertSeatIndexToString(entry.seatIndex) + " $" + entry.price;
				let field = createTextField(str);
				ui.receiptFields.push(field);
			}

			let field = createTextField("------ Total: $"+total + " ------");
			ui.receiptFields.push(field);
		}

		if (onFirstFrame) ui.title = createTitleText("Receipt");
		placeAtTitlePosition(ui.title);

		for (let i = 0; i < ui.receiptFields.length; i++) {
			let field = ui.receiptFields[i];
			if (i == 0) {
				placeAtTop(field);
			} else {
				let prevField = ui.receiptFields[i-1];
				placeUnder(field, prevField);
			}
		}

		simulateBackButton(onFirstFrame, elapsed, SCREEN_SHOW_LIST);
	} else if (ui.currentScreen == SCREEN_SHOW_EDITOR) {
		if (onFirstFrame) {
			let show = showManager.shows[showManager.currentShowIndex];

			ui.showNameField = createInputTextField("Show name", 250);
			ui.showNameField.text = show.name;

			ui.showDateField = createDatePicker("Show date");
			ui.showDateField.values = [show.date.getMonth()+1, show.date.getDate(), show.date.getFullYear()];

			ui.showTimeField = createTimePicker("Show time");
			ui.showTimeField.values = [show.date.getHours()+1, show.date.getMinutes()];

			ui.saveButton = createTextButtonSprite("Save");
			ui.deleteButton = createTextButtonSprite("Delete");
		}

		if (onFirstFrame) ui.title = createTitleText("Show editor");
		placeAtTitlePosition(ui.title);

		placeAtTop(ui.showNameField);
		placeUnder(ui.showDateField, ui.showNameField);
		placeUnder(ui.showTimeField, ui.showDateField);

		ui.saveButton.x = ui.size.x/2 - ui.saveButton.width/2;
		ui.saveButton.y = ui.size.y - ui.saveButton.height - ui.size.y*0.05;
		if (spriteClicked(ui.saveButton)) {
			let show = showManager.shows[showManager.currentShowIndex];
			let url = "includes/editShow.php?ShowID="+show.id+"&ShowName="+ui.showNameField.text+"&ShowDate="+ui.showDateField.text+"&ShowTime="+ui.showTimeField.text;
			makeRequest(url, function(responseText) {
				showPopup("The show was successfully updated!");
				changeScreen(SCREEN_SHOW_LIST);
			});
		}

		placeAtBottomRight(ui.deleteButton);
		if (spriteClicked(ui.deleteButton)) {
			let show = showManager.shows[showManager.currentShowIndex];
			let url = "includes/newDeleteShow.php?ShowID="+show.id;
			console.log(url);
			makeRequest(url, function(responseText) {
				changeScreen(SCREEN_SHOW_LIST);
			});
		}

		simulateBackButton(onFirstFrame, elapsed, SCREEN_SEAT_LIST);
	} else if (ui.currentScreen == SCREEN_SEAT_EDITOR) {
		if (onFirstFrame) {
		}

		if (onFirstFrame) ui.title = createTitleText("Seat editor");
		placeAtTitlePosition(ui.title);

		if (onFirstFrame) ui.priceField = createInputTextField("New price", 4);
		placeAtTop(ui.priceField);

		if (onFirstFrame) ui.saveButton = createTextButtonSprite("Save");
		placeAtBottom(ui.saveButton);
		if (spriteClicked(ui.saveButton)) {
			let show = showManager.shows[showManager.currentShowIndex];
			let url = "includes/changeSeatPrices.php?ShowID="+show.id+"&NewPrice="+ui.priceField.text+"&SeatsStr=";

			for (let i = 0; i < showManager.currentSeatIndices.length; i++) {
				url += showManager.currentSeatIndices[i];
				if (i != showManager.currentSeatIndices.length-1) url += "-";
			}

			makeRequest(url, function(responseText) {
				showPopup("Seat prices were changed");
				changeScreen(SCREEN_SHOW_LIST);
			});
		}

		simulateBackButton(onFirstFrame, elapsed, SCREEN_SEAT_LIST);
	} else if (ui.currentScreen == SCREEN_REPORT) {
		if (onFirstFrame) {

			ui.reportFields = [];
			makeRequest("includes/getReport.php?ReceiptDateMin=2020-1-1&ReceiptDateMax=3000-1-1", function(responseText) {
				console.log(responseText);
				let lines = responseText.split("<br />");
				for (let i = 0; i < lines.length; i++) {
					if (lines[i].length < 2) continue;
					let sections = lines[i].split("|");

					let field = createTextField(sections[0] + " - Purchase by user " + sections[1] + " on " + sections[4] + ":");
					ui.reportFields.push(field);

					let purchaseData = sections[2].split("-");
					for (let i = 0; i < purchaseData.length; i += 2) {
						let show = getShowById(parseInt(purchaseData[i]));
						let seatIndex = parseInt(purchaseData[i + 1]);
						let field = createTextField(show.name + "-" + convertSeatIndexToString(seatIndex));
						ui.reportFields.push(field);
					}

					{
						let total = parseInt(sections[3]);
						let field = createTextField("------ Total: $"+total + " ------");
						ui.reportFields.push(field);
					}
				}
			});
		}

		if (onFirstFrame) ui.title = createTitleText("Report");
		placeAtTitlePosition(ui.title);

		for (let i = 0; i < ui.reportFields.length; i++) {
			let field = ui.reportFields[i];
			if (i == 0) {
				placeAtTop(field);
			} else {
				let prevField = ui.reportFields[i-1];
				placeUnder(field, prevField);
			}
		}

		simulateBackButton(onFirstFrame, elapsed, SCREEN_SHOW_LIST);
	}

	for (let i = 0; i < ui.pixiInputFields.length; i++) { // Update input fields
		let field = ui.pixiInputFields[i];
		if (screenSizeChanged || ui.screenTime == 0) {
			if (isPortraitMode) {
				field.setInputStyle("width", ui.size.x*0.8+"px");
			} else {
				field.setInputStyle("width", ui.size.x*0.2+"px");
			}
		}
	}

	for (let i = 0; i < ui.dateTimePickers.length; i++) { // Update dateTime pickers
		let picker = ui.dateTimePickers[i];

		if (!picker.container) {
			picker.container = new PIXI.Container();
			ui.stageSprite.addChild(picker.container);

			picker.labelField = new PIXI.Text("", {fontFamily: "Arial", fontSize: defaultFontSize});
			picker.labelField.style.fill = 0x909090;
			picker.container.addChild(picker.labelField);

			picker.tickers = [];
			for (let i = 0; i < picker.values.length; i++) {
				let ticker = {};
				ticker.container = new PIXI.Container();
				picker.container.addChild(ticker.container);

				ticker.upButton = new PIXI.NineSlicePlane(PIXI.Texture.from("assets/nineSliceButton.png"), 32, 32, 32, 32);
				ticker.container.addChild(ticker.upButton);

				ticker.field = new PIXI.Text("", {fontFamily: "Arial", fontSize: defaultFontSize});
				ticker.field.style.fill = 0x909090;
				ticker.container.addChild(ticker.field);

				ticker.downButton = new PIXI.NineSlicePlane(PIXI.Texture.from("assets/nineSliceButton.png"), 32, 32, 32, 32);
				ticker.container.addChild(ticker.downButton);

				ticker.upArrow = new PIXI.Sprite.from("assets/triangle.png");
				ticker.upButton.addChild(ticker.upArrow);

				ticker.downArrow = new PIXI.Sprite.from("assets/triangle.png");
				ticker.downButton.addChild(ticker.downArrow);

				picker.tickers.push(ticker);
			}
		}

		let buttonWidth = ui.size.x * 0.05;
		let buttonHeight = ui.size.x * 0.02;
		if (isPortraitMode) {
			buttonWidth = ui.size.x * 0.20;
			buttonHeight = ui.size.x * 0.10;
		}

		let xPos = 0;
		for (let i = 0; i < picker.tickers.length; i++) {
			let ticker = picker.tickers[i];
			let tickAmount = 1;
			if (picker.dateTimeMode == "time" && i == 1) tickAmount = 5;

			ticker.upButton.width = buttonWidth;
			ticker.upButton.height = buttonHeight;
			if (spriteClicked(ticker.upButton)) picker.values[i] += tickAmount;
			ticker.upArrow.tint = 0x707070;
			ticker.upArrow.width = ticker.upArrow.height = ticker.upButton.height*0.8;
			ticker.upArrow.x = ticker.upButton.width/2 - ticker.upArrow.width/2;

			ticker.field.x = ticker.upButton.x + ticker.upButton.width/2 - ticker.field.width/2;
			ticker.field.y = ticker.upButton.y + ticker.upButton.height;
			ticker.field.text = picker.values[i];

			ticker.downButton.width = buttonWidth;
			ticker.downButton.height = buttonHeight;
			ticker.downButton.y = ticker.field.y + ticker.field.height;
			if (spriteClicked(ticker.downButton)) picker.values[i] -= tickAmount;
			ticker.downArrow.tint = 0x707070;
			ticker.downArrow.width = ticker.downArrow.height = ticker.downButton.height*0.8;
			ticker.downArrow.anchor.set(0.5);
			ticker.downArrow.x = ticker.downButton.width/2;
			ticker.downArrow.y = ticker.downButton.height/2;
			ticker.downArrow.rotation = Math.PI;

			if (picker.dateTimeMode == "date") {
				if (i == 0) picker.values[i] = wrap(picker.values[i], 1, 12);
				if (i == 1) picker.values[i] = wrap(picker.values[i], 1, 31);
				if (i == 2) picker.values[i] = wrap(picker.values[i], 1970, 3000); // eol lol
			} else {
				if (i == 0) picker.values[i] = wrap(picker.values[i], 0, 23);
				if (i == 1) picker.values[i] = wrap(picker.values[i], 0, 59);
			}

			ticker.container.x = xPos;
			ticker.container.y = picker.labelField.y + picker.labelField.height;
			xPos += ticker.container.width + ui.size.x*0.005;
		}

		picker.labelField.text = picker.labelText;

		if (picker.dateTimeMode == "date") {
			picker.text = "";
			picker.text += picker.values[2] + "-";
			picker.text += picker.values[0] + "-";
			picker.text += picker.values[1] + "";
		} else {
			picker.text = "";
			picker.text += picker.values[0] + ":";
			picker.text += picker.values[1] + ":";
			picker.text += "00";
		}

		// Sync stuff
		picker.container.x = picker.x;
		picker.container.y = picker.y;
		picker.width = picker.container.width;
		picker.height = picker.container.height;
	}

	if (ui.popup != null) { // Update popup
		ui.popupTime += elapsed;

		let maxTime = 2;
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

	ui.screenTime += elapsed;
	app.time += elapsed;
}

function changeScreen(newScreen) {
	if (newScreen == SCREEN_SHOW_LIST) {
		getShowsFromServer(false, function() {
			ui.screenTransBackwards = false;
			ui.currentScreen = newScreen;
		});
	} else if (newScreen == SCREEN_REPORT) {
		getShowsFromServer(true, function() {
			ui.screenTransBackwards = false;
			ui.currentScreen = newScreen;
		});
	} else {
		ui.screenTransBackwards = false;
		ui.currentScreen = newScreen;
	}
}

function changeScreenBackwards(newScreen) {
	if (newScreen == SCREEN_SHOW_LIST) {
		getShowsFromServer(false, function() {
			ui.screenTransBackwards = true;
			ui.currentScreen = newScreen;
		});
	} else if (newScreen == SCREEN_REPORT) {
		getShowsFromServer(true, function() {
			ui.screenTransBackwards = true;
			ui.currentScreen = newScreen;
		});
	} else {
		ui.screenTransBackwards = true;
		ui.currentScreen = newScreen;
	}
}

function createTextField(text) {
	if (text === undefined) text = "";
	let field = new PIXI.Text(text, {fontFamily: "Arial", fontSize: defaultFontSize});
	field.style.fill = 0xA0A0A0;
	ui.stageSprite.addChild(field);
	return field;
}

function createTitleText(text) {
	let field = createTextField(text);

	field.style.fontSize = titleFontSize;
	field.style.fill = 0x00FFFFFF & blueColor;

	return field;
}

function createInputTextField(hintText, maxLen) {
	if (verboseLogging) console.log("Input text field created"); //@stp What if you accidently create a sprite every frame? Then you'll see this log message

	let field = new PIXI.TextInput({
		input: {
			fontSize: '25pt',
			padding: '14px',
			width: '500px',
			color: '#26272E'
		}, box: {
			default: {fill: 0xE8E9F3, rounded: 16, stroke: {color: 0xCBCEE0, width: 4}},
			focused: {fill: 0xE1E3EE, rounded: 16, stroke: {color: 0xABAFC6, width: 4}},
			disabled: {fill: 0xDBDBDB, rounded: 16}
		}
	});
	field.placeholder = hintText;
	field.x = 100;
	field.y = 100;
	field.maxLength = maxLen;
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
	sprite.tint = blueColor;

	field.x = sprite.x + sprite.width/2 - field.width/2;
	field.y = sprite.y + sprite.height/2 - field.height/2;
	sprite.addChild(field);

	ui.stageSprite.addChild(sprite);
	return sprite;
}

function createSeatSprite(seat) {
	let sprite = new PIXI.NineSlicePlane(PIXI.Texture.from("assets/nineSliceButton.png"), 32, 32, 32, 32);

	let field = new PIXI.Text("$"+seat.price, {fontFamily: "Arial", fontSize: seatPriceFontSize});
	sprite.addChild(field);

	ui.stageSprite.addChild(sprite);
	return sprite;
}

function spriteClicked(sprite) {
	if (!sprite.visible) return false;

	let hoveringButton = false;
	let rect = sprite.getBounds();
	if (ui.mouse.x > rect.x && ui.mouse.x < rect.x + rect.width && ui.mouse.y > rect.y && ui.mouse.y < rect.y + rect.height) {
		hoveringButton = true;
	}

	if (ui.mouseJustDown && hoveringButton) {
		ui.mouseJustDown = false; // Prevent mouse from clicking multiple objects on the same frame
		return true;
	}
	return false;
}

function createDatePicker(label) {
	let picker = {x: 0, y: 0, width: 0, height: 0};
	picker.labelText = label;
	picker.dateTimeMode = "date";
	picker.values = [0, 0, 0];
	ui.dateTimePickers.push(picker);
	return picker;
}

function createTimePicker(label) {
	let picker = {x: 0, y: 0, width: 0, height: 0};
	picker.labelText = label;
	picker.dateTimeMode = "time";
	picker.values = [0, 0];
	ui.dateTimePickers.push(picker);
	return picker;
}

function makeRequest(url, onSuccess) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status <= 99 || this.status >= 400) {
				app.userId = 0;
				showPopup("There was problem connecting");
				changeScreen(SCREEN_LOGIN);
			} else if (this.status == 200) {
				if (this.responseText.startsWith("Error:")) {
					console.log("Url: "+url);
					console.log("Response: "+this.responseText);
					showPopup(this.responseText);
					app.userId = 0;
					changeScreen(SCREEN_LOGIN);
				} else {
					onSuccess(this.responseText);
				}
			}
		}
	}
	xmlhttp.onerror = function() {
		console.log("xmlhttp.onerror");
		console.log("Url: "+url);
		showPopup("Server failure");
		app.userId = 0;
		changeScreen(SCREEN_LOGIN);
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function attemptLogin(username, password) {
	function onComplete(responseText) {
		console.log(responseText);
		let stringArray = responseText.split("|");
		app.userId = parseInt(stringArray[0]);
		app.isAdmin = parseInt(stringArray[1]);
		showPopup("Welcome user "+app.userId);
		changeScreen(SCREEN_SHOW_LIST);
	}

	makeRequest("includes/login.inc.php?username="+username+"&password="+password, onComplete);
}

function getShowsFromServer(getAllShows, whenDone) {
	function parseShowData(data) {
		showManager.shows = [];

		let showLines = data.split("<br />");
		for (let i = 0; i < showLines.length; i++) {
			let line = showLines[i];
			if (line.length < 2) continue;
			let entries = line.split("|");

			let show = {};
			show.id = parseInt(entries[0]);
			show.name = entries[1];
			{
				let dateComponents = entries[2].split("-");
				show.date = new Date();
				show.date.setFullYear(parseInt(dateComponents[0]));
				show.date.setMonth(parseInt(dateComponents[1])-1);
				show.date.setDate(parseInt(dateComponents[2]));

				let timeComponents = entries[3].split(":");
				show.date.setHours(parseInt(timeComponents[0]), parseInt(timeComponents[1]), parseInt(timeComponents[2]));
			}
			showManager.shows.push(show);
		}

		if (whenDone != null) whenDone();
		// 27|test|2022-04-15|22:32:26|5<br />28|test|2022-04-16|21:32:26|5<br />29|test|2022-04-17|15:32:26|5<br />
	}

	let date = new Date();
	if (getAllShows) date.setFullYear(date.getFullYear()-1000);
	let minDateStr = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	let maxDateStr = (date.getFullYear()+2000) + "-" + (date.getMonth()+1) + "-" + date.getDate();
	let url = "includes/getShowReport.inc.php?showdatemin="+minDateStr+"&showdatemax="+maxDateStr;
	makeRequest(url, parseShowData);
}

function selectShow(showIndex, onComplete) {
	showManager.currentShowIndex = showIndex;

	let show = showManager.shows[showIndex];
	show.seats = [];
	for (let i = 0; i < THEATER_COLS*THEATER_ROWS; i++) {
		let seat = {};
		seat.userId = 0;
		seat.price = 1000;
		show.seats.push(seat);
	}


	let url = "includes/loadSeats.inc.php?ShowID="+show.id;
	makeRequest(url, function(str) {
		show.seats = [];
		let stringArray = str.split("-");
		for (let i = 0; i < stringArray.length; i += 2) {
			let seat = {};
			seat.userId = parseInt(stringArray[i]);
			seat.price = parseInt(stringArray[i+1]);
			show.seats.push(seat);
		}

		onComplete();
	});
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
	if (!cardNumber.startsWith("4") && !cardNumber.startsWith("5")) {
		showPopup("Only Visa and MasterCard accepted!");
		changeScreen(SCREEN_PAYMENT_INFO);
		cart = [];
		return;
	}

	let url = "includes/buySeats.php?UserID="+app.userId+"&TotalPrice="+amount+"&str=";

	for (let i = 0; i < cart.length; i++) {
		let entry = cart[i];
		url += entry.showId + "-";
		url += entry.seatIndex;
		if (i != cart.length-1) url += "-";
	}

	makeRequest(url, function(responseText) {
		showPopup("Your payment has been processed!");
		changeScreen(SCREEN_RECEIPT);
	});
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

function getShowIndex(show) {
	for (let i = 0; i < showManager.shows.length; i++) {
		if (show == showManager.shows[i]) return i;
	}

	showPopup("Couldn't find show with id "+id);
	return -1;
}

function convertSeatIndexToString(seatIndex) {
	let col = seatIndex % THEATER_COLS;
	let row = Math.floor(seatIndex / THEATER_COLS);

	let str = "";
	str += String.fromCharCode(65 + row);
	str += col + 1;
	return str;
}

function generateUml() {
	let docObjects = {};
	docObjects["app"] = app;
	docObjects["ui"] = ui;
	docObjects["showManager"] = showManager;

	let graphVizStr = "";
	graphVizStr += "digraph G {\n";
	graphVizStr += "rankdir=\"RL\"\n";

	for (let objKey in docObjects) {
		let obj = docObjects[objKey];

		for (let key in obj) {
			let value = obj[key];
			let str = objKey+"->\"";

			if (typeof value === "function") {
				str += "key("+getParamNames(value)+")";
			} else if (Array.isArray(obj)) {
				str += key+"[]";
			} else {
				str += key + ":" + typeof value;
			}
			str += "\"\n";
			graphVizStr += str;
		}
	}
	graphVizStr += "}";
	console.log(graphVizStr);
}

// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null) result = [];
  return result;
}

/// Math stuff
function clamp(x, min, max) {
	if (x < min) return min;
	if (x > max) return max;
	return x;
}
function norm(min, max, value) { return (value-min)/(max-min); }
function lerp(min, max, perc) { return min + (max - min) * perc; }

function clampMap(value, sourceMin, sourceMax, destMin, destMax, ease) {
	let perc = norm(sourceMin, sourceMax, value);
	perc = clamp(perc, 0, 1);
	perc = tweenEase(perc, ease);
	return lerp(destMin, destMax, perc);
}

function wrap(x, min, max) {
	if (x < min) x = max;
	if (x > max) x = min;
	return x;
}

let LINEAR = 0;
let QUAD_IN = 1; let QUAD_OUT = 2; let QUAD_IN_OUT = 3;
let CUBIC_IN = 4; let CUBIC_OUT = 5; let CUBIC_IN_OUT = 6;
let QUART_IN = 7; let QUART_OUT = 8; let QUART_IN_OUT = 9;
let QUINT_IN = 10; let QUINT_OUT = 11; let QUINT_IN_OUT = 12;
let SINE_IN = 13; let SINE_OUT = 14; let SINE_IN_OUT = 15;
let CIRC_IN = 16; let CIRC_OUT = 17; let CIRC_IN_OUT = 18;
let EXP_IN = 19; let EXP_OUT = 20; let EXP_IN_OUT = 21;
let ELASTIC_IN = 22; let ELASTIC_OUT = 23; let ELASTIC_IN_OUT = 24;
let BACK_IN = 25; let BACK_OUT = 26; let BACK_IN_OUT = 27;
let BOUNCE_IN = 28; let BOUNCE_OUT = 29; let BOUNCE_IN_OUT = 30;

function tweenEase(p, ease) {
	let piOver2 = 3.14159/2;
	if (ease == LINEAR) {
		return p;
	} else if (ease == QUAD_IN) {
		return p * p;
	} else if (ease == QUAD_OUT) {
		return -(p * (p - 2));
	} else if (ease == QUAD_IN_OUT) {
		if (p < 0.5) return 2 * p * p;
		else return (-2 * p * p) + (4 * p) - 1;
	} else if (ease == CUBIC_IN) {
		return p * p * p;
	} else if (ease == CUBIC_OUT) {
		let f = (p - 1);
		return f * f * f + 1;
	} else if (ease == CUBIC_IN_OUT) {
		let f = ((2 * p) - 2);
		if (p < 0.5) return 4 * p * p * p;
		else return 0.5 * f * f * f + 1;
	} else if (ease == QUART_IN) {
		return p * p * p * p;
	} else if (ease == QUART_OUT) {
		let f = (p - 1);
		return f * f * f * (1 - p) + 1;
	} else if (ease == QUART_IN_OUT) {
		let f = (p - 1);
		if (p < 0.5) return 8 * p * p * p * p;
		else return -8 * f * f * f * f + 1;
	} else if (ease == QUINT_IN) {
		return p * p * p * p * p;
	} else if (ease == QUINT_OUT) {
		let f = (p - 1);
		return f * f * f * f * f + 1;
	} else if (ease == QUINT_IN_OUT) {
		let f = ((2 * p) - 2);
		if (p < 0.5) return 16 * p * p * p * p * p;
		else return  0.5 * f * f * f * f * f + 1;
	} else if (ease == SINE_IN) {
		return Math.sin((p - 1) * piOver2) + 1;
	} else if (ease == SINE_OUT) {
		return Math.sin(p * piOver2);
	} else if (ease == SINE_IN_OUT) {
		return 0.5 * (1 - Math.cos(p * M_PI));
	} else if (ease == CIRC_IN) {
		return 1 - sqrt(1 - (p * p));
	} else if (ease == CIRC_OUT) {
		return sqrt((2 - p) * p);
	} else if (ease == CIRC_IN_OUT) {
		if (p < 0.5) return 0.5 * (1 - sqrt(1 - 4 * (p * p)));
		else return 0.5 * (sqrt(-((2 * p) - 3) * ((2 * p) - 1)) + 1);
	} else if (ease == EXP_IN) {
		return (p == 0.0) ? p : pow(2, 10 * (p - 1));
	} else if (ease == EXP_OUT) {
		return (p == 1.0) ? p : 1 - pow(2, -10 * p);
	} else if (ease == EXP_IN_OUT) {
		if (p == 0.0 || p == 1.0) return p;
		if (p < 0.5) return 0.5 * pow(2, (20 * p) - 10);
		else return -0.5 * pow(2, (-20 * p) + 10) + 1;
	} else if (ease == ELASTIC_IN) {
		return Math.sin(13 * piOver2 * p) * pow(2, 10 * (p - 1));
	} else if (ease == ELASTIC_OUT) {
		return Math.sin(-13 * piOver2 * (p + 1)) * pow(2, -10 * p) + 1;
	} else if (ease == ELASTIC_IN_OUT) {
		if (p < 0.5) return 0.5 * Math.sin(13 * piOver2 * (2 * p)) * pow(2, 10 * ((2 * p) - 1));
		else return 0.5 * (Math.sin(-13 * piOver2 * ((2 * p - 1) + 1)) * pow(2, -10 * (2 * p - 1)) + 2);
	} else if (ease == BACK_IN) {
		return p * p * p - p * Math.sin(p * M_PI);
	} else if (ease == BACK_OUT) {
		let f = (1 - p);
		return 1 - (f * f * f - f * Math.sin(f * M_PI));
	} else if (ease == BACK_IN_OUT) {
		if (p < 0.5) {
			let f = 2 * p;
			return 0.5 * (f * f * f - f * Math.sin(f * M_PI));
		} else {
			let f = (1 - (2*p - 1));
			return 0.5 * (1 - (f * f * f - f * Math.sin(f * M_PI))) + 0.5;
		}
	} else if (ease == BOUNCE_IN) {
		return 1 - tweenEase(1 - p, BOUNCE_OUT);
	} else if (ease == BOUNCE_OUT) {
		if (p < 4/11.0) return (121 * p * p)/16.0;
		else if (p < 8/11.0) return (363/40.0 * p * p) - (99/10.0 * p) + 17/5.0;
		else if (p < 9/10.0) return (4356/361.0 * p * p) - (35442/1805.0 * p) + 16061/1805.0;
		else return (54/5.0 * p * p) - (513/25.0 * p) + 268/25.0;
	} else if (ease == BOUNCE_IN_OUT) {
		if (p < 0.5) return 0.5 * tweenEase(p*2, BOUNCE_IN);
		else return 0.5 * tweenEase(p * 2 - 1, BOUNCE_OUT) + 0.5;
	}

	return 0;
}
