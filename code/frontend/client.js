let SCREEN_NONE = 0;
let SCREEN_LOGIN = 1;
let SCREEN_WAITING_FOR_SERVER = 2;
let SCREEN_SHOW_LIST = 3;

let app = {};
app.pixiApp = null;
app.ui = {};
app.ui.size = {}
app.ui.mouse = {};
app.ui.mouseDown = false;
app.ui.mouseJustDown = false;
app.ui.mouseJustUp = false;
app.ui.size.x = 0;
app.ui.size.y = 0;
app.ui.pixiFields = [];
app.ui.pixiSprites = [];

app.ui.prevScreen = -1;
app.ui.currentScreen = SCREEN_NONE;

app.showManager = {};
app.showManager.shows = [];
app.showManager.currentShowIndex = 0;
app.showManager.currentSeatIndices = [];

{
	let show = {};
	show.id = 1;
	show.name = "Beetlejuice";
	show.date = new Date("March 30, 2022 07:24:00");
	show.seats = [];

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
		width: 1280,
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
		for (let i = 0; i < ui.pixiFields.length; i++) {
			app.pixiApp.stage.removeChild(ui.pixiFields[i]);
		}
		ui.pixiFields = [];
		for (let i = 0; i < ui.pixiSprites.length; i++) {
			app.pixiApp.stage.removeChild(ui.pixiSprites[i]);
		}
		ui.pixiSprites = [];

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
			changeScreen(SCREEN_LOGIN);
		}
	} else if (ui.currentScreen == SCREEN_LOGIN) {
		if (onFirstFrame) {
			ui.userField = createTextField();
			ui.userField.text = "username";
			ui.userField.x = ui.size.x / 2 - ui.userField.width / 2;
			ui.userField.y = ui.size.y / 2 - ui.userField.height / 2;

			ui.passField = createTextField();
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
				sprite.y = yPos;
				yPos += sprite.height + 10;
				ui.showButtons.push(sprite);
            }
		}

		for (let i = 0; i < ui.showButtons.length; i++) {
			let button = ui.showButtons[i];

			if (spriteClicked(button)) {
				console.log("You clicked button "+i);
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

function createTextButtonSprite(text) {
	let sprite = new PIXI.Sprite.from("assets/button.png"); //@todo(Jeru): Cache textures so that I know the size of them on frame 1
	app.pixiApp.stage.addChild(sprite);
	app.ui.pixiSprites.push(sprite);
	return sprite;
}

function spriteClicked(sprite) {
	let ui = app.ui;

	let hoveringButton = false;
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
        console.log(this.responseText);
		changeScreen(SCREEN_SHOW_LIST);
      }
    }
	//xmlhttp.open("GET", "login.html", true);
    xmlhttp.open("GET", "login.php?username="+username+"&password="+password, true);
    xmlhttp.send();
}