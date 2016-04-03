var game = {
  rounds: 0,
  playerScore: 0,
  drawScore: 0,
  aiScore: 0,
  pot: 0
};
var stats = {
  money: 500,
  moneyWon: 0,
  moneyAchivs: 0,
  moneyLost: 0,
  gamesWon: 0,
  gamesWonBo1: 0,
  gamesWonBo3: 0,
  gamesWonBo5: 0,
  gamesLost: 0,
  gamesForfeited: 0,
  roundsWon: 0,
  roundsWonRock: 0,
  roundsWonPaper: 0,
  roundsWonScissors: 0,
  roundsWonFP: 0,
  roundsLost: 0,
  roundsDrawed: 0,
  bankrupt: 0,
};
var achivs = [
  // Rounds related achievements.
  {name: "Win 100 Rounds with Rock",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.roundsWonRock >= 100 ? true : false;
	},
	reward: 2000},
  {name: "Win 100 Rounds with Paper",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.roundsWonPaper >= 100 ? true : false;
	},
	reward: 2000},
  {name: "Win 100 Rounds with Scissors",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.roundsWonScissors >= 100 ? true : false;
	},
	reward: 2000},
  {name: "Win 100 Free Play Rounds",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.roundsWonFP >= 100 ? true : false;
	},
	reward: 2000},
  {name: "Win 500 rounds",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.roundsWon >= 500 ? true : false;
	},
	reward: 8000},
  {name: "Draw 100 Rounds",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.roundsDrawed >= 100 ? true : false;
	},
	reward: 2000},
  {name: "Lose 200 Rounds",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.roundsLost >= 200 ? true : false;
	},
	reward: 2000},
  // Games related achievements.
  {name: "Win 50 Best of 1 Games",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesWonBo1 >= 50 ? true : false;
	},
	reward: 3000},
  {name: "Win 50 Best of 3 Games",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesWonBo3 >= 50 ? true : false;
	},
	reward: 3000},
  {name: "Win 50 Best of 5 Games",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesWonBo5 >= 50 ? true : false;
	},
	reward: 3000},
  {name: "Win 200 Games",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesWon >= 200 ? true : false;
	},
	reward: 10000},
  {name: "Lose 100 Games",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesLost >= 100 ? true : false;
	},
	reward: 5000},
  // Money related achievements.
  // FIXME: There seems to be some issues with the currency symbol not displaying.
  // FIXME: It seems that calling prettify before declaring the preferences var
  // throws an error. It can be fixed by moving preferences before achivs.
  // TODO: Transform name into a method.
  // name: function() return "Win 10000" + preferences.currency;
  /*
  {name: "Win " + prettify(10000) + "",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.moneyWon >= 10000 ? true : false;
	},
	reward: 3000}, */
  // Misc achievements.
  {name: "Forfeit A Game",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesForfeited >= 1 ? true : false;
	},
	reward: 1000},
  {name: "Go bankrupt",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.bankrupt >= 1 ? true : false;
	},
	reward: 2000},
  {name: "Win 30 Free Play rounds in one session",
	unlocked: false,
	unlockDate: "",
	req() {
		return game.rounds === Infinity && game.playerScore >= 30 ? true : false;
	},
	reward: 5000},
  {name: "75% Winrate after at least 10 Games Played",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesWon + stats.gamesLost + stats.gamesForfeited >= 10 && getPercent(stats.gamesWon, stats.gamesWon + stats.gamesLost + stats.gamesForfeited) >= 75 ? true : false;
	},
	reward: 10000}
];
var preferences = {
  currency: "$",
  delimiter: ".",
  musicMuted: false,
  musicVolume: 0.8,
  effectsMuted: false,
  effectsVolume: 0.8
};

// Loads the save file and other stuff when the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", function() {
	load();
    // I could probably move all of these into the load function, since
    // they only run once, when the DOM is loaded.
    document.getElementById("sound-music").muted = preferences.musicMuted;
    document.getElementById("sound-music").volume = preferences.musicVolume;
	tickCurrencyRadio();
	tickDelimiterRadio();
    updateSoundIcons();
    updateSoundVolume();
});

function play(num) {
	// TODO: Put this inside the game.rounds < 6 if statement, or maybe make
	// a function for it.
	var betOpts = document.getElementsByClassName("betting-option");
	var betVal = document.getElementsByClassName("betting-value");
	// Disables the betting options that are unrealistic.
	for (var i = 0; i < betVal.length; i++) {
		if (stats.money < betVal[i].innerHTML) {
			betOpts[i].style.display = "none";
			console.log("Disabled one betting option.");
		}
	}
	game.rounds = num;
	updateTableStats();
	changePanel("gamescreen");
	if (game.rounds < 6) {
		fadeIn(document.getElementById("betting"));
		disableCards();
	} else {
		fadeOut(document.getElementById("betting"));
		gameLog("Select a card.");
		enableCards();
		// TODO: Need to remove the Pot and Player Money from the game screen.
	}
}

function bet(sum) {
	stats.money -= sum;
	game.pot = sum * 2;
	updateTableStats();
	setTimeout(function () {
		fadeOut(document.getElementById("betting"));
		enableCards();
	}, 200);
	save();
}

function selectCard(option) {
	// Randomly selects one of the options. 1 = Rock, 2 = Paper, 3 = Scissors.
	var randomNum = Math.floor(Math.random() * 3 + 1);
	// Randomly selects one of the AI Cards. 1 = Left Card, 2 = Middle Card, 3 = Right Card.
	var randomNum2 = Math.floor(Math.random() * 3 + 1);
	var buttons = document.getElementsByClassName("btn");

	if (option === "rock") {
		if (randomNum === 1) {
			declareRoundWinner("draw");
		} else if (randomNum === 2) {
			declareRoundWinner();
		} else {
			declareRoundWinner("player");
			// Stats
			stats.roundsWonRock++;
		}
	} else if (option === "paper") {
		if (randomNum === 1) {
			declareRoundWinner("player");
			// Stats
			stats.roundsWonPaper++;
		} else if (randomNum === 2) {
			declareRoundWinner("draw");
		} else {
			declareRoundWinner();
		}
	} else {
		if (randomNum === 1) {
			declareRoundWinner();
		} else if (randomNum === 2) {
			declareRoundWinner("player");
			// Stats
			stats.roundsWonScissors++;
		} else {
			declareRoundWinner("draw");
		}
	}

	// Fades out and disables the Player Cards that weren't selected.
	for (var i = 3; i < buttons.length; i++) {
		if (buttons[i].id != option + "btn") {
			buttons[i].disabled = true;
			fadeOut(buttons[i]);
		}
	}

	// Same as above, but for the AI Cards, with a 1 second delay.
	setTimeout(function () {
		for (var i = 0; i <= 2; i++) {
			if (buttons[i].id != "aibtn" + randomNum2) {
				fadeOut(buttons[i]);
			}
		}
	}, 1000);

	// Adds the text on the AI Card based on randomNum, and then adds the
    // flipping animation, with a 2 seconds delay.
	setTimeout(function () {
		// TODO: Maybe have a var that changes based on randomNum.
		if (randomNum === 1) {
			document.getElementById("aibtn" + randomNum2).innerHTML = "<i class='fa fa-hand-rock-o'></i><br /> Rock";
		} else if (randomNum === 2) {
			document.getElementById("aibtn" + randomNum2).innerHTML = "<i class='fa fa-hand-paper-o'></i><br /> Paper";
		} else {
			document.getElementById("aibtn" + randomNum2).innerHTML = "<i class='fa fa-hand-scissors-o'></i><br /> Scissors";
		}
		//TODO: Add the card-active class to the selected AI Card.
		document.getElementById("aibtn" + randomNum2).className = "btn card animated flipInY";
	}, 2000);

	function declareRoundWinner(who) {
		setTimeout(function () {
			if (who === "player") {
				game.playerScore++;
				console.log("Round goes to Player. Score: " + game.playerScore + "-" + game.aiScore + " (Draws: " + game.drawScore + ")");
				gameLog("You won!");
				// Stats
				stats.roundsWon++;
				if (game.rounds > 5) {
					stats.roundsWonFP++;
				}
			} else if (who === "draw") {
				game.drawScore++;
				console.log("Draw. Score still " + game.playerScore + "-" + game.aiScore + " (Draws: " + game.drawScore + ")");
				gameLog("Draw");
				// Stats
				stats.roundsDrawed++;
			} else {
				game.aiScore++;
				console.log("Round goes to AI. Score: " + game.playerScore + "-" + game.aiScore + " (Draws: " + game.drawScore + ")");
				gameLog("AI wins");
				// Stats
				stats.roundsLost++;
			}
			save();
			updateTableStats();
		}, 2500);
	}

	function checkScore() {
		if (game.rounds / 2 < game.playerScore) {
			gameLog("You WON! <br />Score <br /> <span style='float: left'>You: " + game.playerScore +"</span> <span style='float: right;'>AI: " + game.aiScore + "</span><br /> Click to continue...");
			console.log("------------------");
			document.getElementById("wrapper-js").addEventListener("click", resetGame);
			// Stats
			stats.gamesWon++;
			stats.money += game.pot;
			stats.moneyWon += game.pot / 2;
			if (game.rounds === 1) {
				stats.gamesWonBo1++;
			} else if (game.rounds === 3) {
				stats.gamesWonBo3++;
			} else if (game.rounds === 5) {
				stats.gamesWomBo5++;
			}
		} else if (game.rounds / 2 < game.aiScore) {
			gameLog("You LOST! <br />Score <br /> <span style='float: left'>You: " + game.playerScore +"</span> <span style='float: right;'>AI: " + game.aiScore + "</span><br /> Click to continue...");
			console.log("------------------");
			document.getElementById("wrapper-js").addEventListener("click", resetGame);
			// Stats
			stats.gamesLost++;
			stats.moneyLost += game.pot / 2;
			avoidBankrupcy();
		} else {
			setTimeout(resetHand, 1000);
		}
		// Called so it will save if the player wins or loses the game.
		// TODO:
		// Maybe put it inside the winning and losing condition, so it
		// wont be called even if the hand just resets.
		// Or maybe just let it stay here and remove the one from the
		// declareRoundWinner function.
        // unlockAchiv();
		save();
	}

	setTimeout(function () {
		checkScore();
	}, 3500);
}

// TODO: Improve this.
function forfeit() {
	if (confirm("Are you sure you want to forfeit? You will lose the money betted.")) {
		stats.gamesForfeited++;
		if (document.getElementById("betting").display != "none") {
			fadeOut(document.getElementById("betting"));
		}
		setTimeout(function() {
			gameLog("Player has forfeited.");
		}, 800);
		setTimeout(function() {
			changePanel("mainscreen");
			resetGame();
		}, 2000);
		save();
	}
}

// Resets the properties of the game object (score, rounds, pot).
function resetGame() {
	document.getElementById("wrapper-js").removeEventListener("click", resetGame);
	game.playerScore = 0;
	game.drawScore = 0;
	game.aiScore = 0;
	game.pot = 0;
	game.rounds = 0;
	changePanel("mainscreen");
	setTimeout(resetHand, 1100);
}

// Resets every card back to the default state.
function resetHand() {
	var buttons = document.getElementsByClassName("btn");
	gameLog("");

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].disabled = false;
		buttons[i].className = "btn card";
		fadeIn(buttons[i]);
	}

	for (var i = 3; i < buttons.length; i++) {
		buttons[i].className += " card-player";
	}

	for (var j = 0; j <= 2; j++) {
		buttons[j].innerHTML = "<i class='fa fa-question'></i><br /> ????????";
	}
}

// Prevents the player from going bankrupt by injecting some money.
// TODO: Decide if it gives the player the difference needed to get to 100$ or
// it gives him back a random value between 50$ and 100$.
function avoidBankrupcy() {
	// 10 is the minimum betting option.
	if (stats.money < 10) {
		stats.bankrupt++;
		stats.money = 100;
		console.log("The casino owner felt bad for you losing all your money, so he gave you 100" + preferences.currency + " back.");
		save();
	}
}

function unlockAchiv() {
	var unlocked = [];
	for (var i = 0; i < achivs.length; i++) {
		if (!achivs[i].unlocked && achivs[i].req()) {
			stats.money += achivs[i].reward;
			stats.moneyAchivs += achivs[i].reward;
			achivs[i].unlocked = true;
			achivs[i].unlockDate = getDateString();
			unlocked.push(achivs[i]);
			console.log("Unlocked " + achivs[i].name + " on " + achivs[i].unlockDate);
		}
	}
	if (unlocked.length) {
		save();
		// I don't think there is a need for this here, besides for debugging.
		updateAchivsPage();
		displayUnlockedAchiv(unlocked);
	}
}

function displayUnlockedAchiv(array) {
	var count = 0;
	console.log(array);
	function display() {
		console.log(array[count].name);
		document.getElementById("unlockedachiv-name").innerHTML = array[count].name;
		fadeIn(document.getElementById("unlockedachiv"));
		playSound("sounds/achievement.mp3");
		setTimeout(function () {
			fadeOut(document.getElementById("unlockedachiv"));
			if (count >= array.length) {
				count = 0;
			} else {
				setTimeout(display, 1000);
			}
		}, 3000);
		count++;
	}
	display();
}

// UTILITY FUNCTIONS

// The game log
function gameLog(message) {
	var log = document.getElementById("log1");
	log.innerHTML = message;
	fadeIn(log);
}

// Returns the current date and time as a string.
// Called by unlockAchiv() to set the unlocked date and time for achievements.
function getDateString() {
	var d = new Date();
	var month = d.getMonth() + 1;
	var minutes = d.getMinutes();
	var hours = d.getHours();
	if (minutes < 10) {
		minutes = "0" + d.getMinutes();
	}
	if (hours < 10) {
		hours = "0" + d.getHours();
	}
	return month.toString() + "/" + d.getDate().toString() + "/" + d.getFullYear().toString() + " " +  hours + ":" + minutes;
}

// Returns the percent of val out of max, or 0 if both are 0.
function getPercent(val, max) {
	if (val === 0 && max === 0) return 0;
	else if (isNaN(val) || isNaN(max)) return console.log("Both arguments need to be numbers.");
	else return Math.floor((val / max) * 100);
}

// Saves the Stats object to localStorage so it wont be lost between sessions.
function save() {
	localStorage.setItem("crps", JSON.stringify(stats));
	localStorage.setItem("crps2", JSON.stringify(preferences));
	console.log("Saved");
}

// Loads the saved Stats object if it was created by the save function.
function load() {
	var savedStats = localStorage.getItem("crps");
	var savedPreferences = localStorage.getItem("crps2");
	if (savedStats) {
		stats = JSON.parse(savedStats);
		console.log("Stats Loaded");
	}
	if (savedPreferences) {
		preferences = JSON.parse(savedPreferences);
		console.log("Preferences Loaded");
	}
}

// Removes the saved Stats and Achievements objects from localStorage,
// and resets them to default.
// Resets the Stats and Achievements objects to default.
// TODO: Change name to resetProfile or resetSave.
function deleteSave() {
	if (confirm("Are you sure? You will lose all the progress made.")) {
		localStorage.removeItem("crps");
		stats = {
		  money: 500,
		  moneyLost: 0,
		  moneyWon: 0,
		  moneyAchivs: 0,
		  gamesWon: 0,
		  gamesWonBo1: 0,
		  gamesWonBo3: 0,
		  gamesWonBo5: 0,
		  gamesLost: 0,
		  gamesForfeited: 0,
		  roundsWon: 0,
		  roundsWonRock: 0,
		  roundsWonPaper: 0,
		  roundsWonScissors: 0,
          roundsWonFP: 0,
		  roundsLost: 0,
		  roundsDrawed: 0,
		  bankrupt: 0
      };
	}
}

function changePanel(panel) {
	var main = document.getElementById("mainscreen");
	var game = document.getElementById("gamescreen");
	var stats = document.getElementById("statsscreen");
	var options = document.getElementById("optionsscreen");
	var achivs = document.getElementById("achievementsscreen");
	var arr = [main, game, stats, options, achivs];
	for (var i = 0; i < arr.length; i++) {
		if (window.getComputedStyle(arr[i], null).getPropertyValue("display") === "inline-block") {
			fadeOut(arr[i]);
		}
	}
	if (panel === "statsscreen") {
		updateStatsPage();
	}
	if (panel === "achievementsscreen") {
		updateAchivsPage();
	}
	setTimeout(function () {
		fadeIn(document.getElementById(panel));
	}, 1000);
}

function disableCards(whos) {
	buttons = document.getElementsByClassName("btn");
	if (whos === "player") {
		for (var i = 3; i < buttons.length; i++) {
			buttons[i].disabled = true;
		}
	} else if (whos === "ai") {
		for (var i = 0; i < 3; i++) {
			buttons[i].disabled = true;
		}
	} else {
		disableCards("player");
		disableCards("ai");
	}
}

function enableCards(whos) {
	buttons = document.getElementsByClassName("btn");
	if (whos === "player") {
		for (var i = 3; i < buttons.length; i++) {
			buttons[i].disabled = false;
		}
	} else if (whos === "ai") {
		for (var i = 0; i < 3; i++) {
			buttons[i].disabled = false;
		}
	} else {
		enableCards("player");
		enableCards("ai");
	}
}


// TODO: Unify setCurrency() and setDelimiter().
// TODO: Unify tickCurrencyRadio() and tickDelimiterRadio().
function setCurrency() {
	var curr = document.getElementsByName("options-currency");
	for (var i = 0; i < curr.length; i++) {
		console.log("looping");
		if (curr[i].checked) {
			preferences.currency = curr[i].value;
			console.log(curr[i].value);
			break;
		}
	}
	save();
	updateCurrency();
}

function tickCurrencyRadio() {
	var curr = document.getElementsByName("options-currency");
	for (var i = 0; i < curr.length; i++) {
		if (preferences.currency === curr[i].value) {
			curr[i].checked = true;
			console.log("Currency: " + preferences.currency);
			console.log("Value: " + curr[i].value);
			break;
		}
	}
	updateCurrency();
}

function setDelimiter() {
	var del = document.getElementsByName("options-delimiter");
	for (var i = 0; i < del.length; i++) {
		console.log("looping");
		if (del[i].checked) {
			preferences.delimiter = del[i].value;
			console.log(del[i].value);
			break;
		}
	}
	save();
}

function tickDelimiterRadio() {
	var del = document.getElementsByName("options-delimiter");
	for (var i = 0; i < del.length; i++) {
		if (preferences.delimiter === del[i].value) {
			del[i].checked = true;
			console.log("Delimiter: " + preferences.delimiter);
			console.log("Value: " + del[i].value);
			break;
		}
	}
	updateCurrency();
}

// SOUND

function changeSoundState(sound) {
    if (sound === "music") {
        var music = document.getElementById("sound-music");
    	if (preferences.musicMuted) preferences.musicMuted = false;
    	else preferences.musicMuted = true;
    	music.muted = preferences.musicMuted;
    } else if (sound === "effects") {
        if (preferences.effectsMuted) preferences.effectsMuted = false;
        else preferences.effectsMuted = true;
    }
    updateSoundIcons();
	save();
}

// Changes the volume of sounds.
function changeSoundVolume(sound, type) {
	var music = document.getElementById("sound-music");
    if (sound === "music") {
        if (type === "inc" && preferences.musicVolume < 1) {
            preferences.musicVolume += 0.1;
        }
        if (type === "dec" && preferences.musicVolume > 0.1) {
            preferences.musicVolume -= 0.1;
        }
        music.volume = preferences.musicVolume;
    } else if (sound === "effects") {
        if (type === "inc" && preferences.effectsVolume < 1) {
            preferences.effectsVolume += 0.1;
        }
        if (type === "dec" && preferences.effectsVolume > 0.1) {
            preferences.effectsVolume -= 0.1;
        }
    }
    updateSoundVolume();
    save();
}

function playSound(url, volume) {
	if (!preferences.effectsMuted) {
		var sound = new Audio();
		sound.src = url;
		sound.volume = volume || preferences.effectsVolume;
		sound.play();
	}
}

// UI

// Temporary function. I should not use IDs for this I guess.
// TODO: Improve updateTableStats.
function updateTableStats() {
	var aiScore = document.getElementById("aiscore");
	var playerScore = document.getElementById("playerscore");
	var tableMoney = document.getElementById("tablemoney");
	var pot = document.getElementById("pot");

	pot.innerHTML = prettify(game.pot);
	tableMoney.innerHTML = prettify(stats.money);
	aiScore.innerHTML = game.aiScore;
	playerScore.innerHTML = game.playerScore;
}

// Updates the numbers in the statsscreen div.
function updateStatsPage() {
	// Games Stats
	document.getElementById("gameswon").innerHTML = prettify(stats.gamesWon);
	document.getElementById("bo1gameswon").innerHTML = prettify(stats.gamesWonBo1);
	document.getElementById("bo3gameswon").innerHTML = prettify(stats.gamesWonBo3);
	document.getElementById("bo5gameswon").innerHTML = prettify(stats.gamesWonBo5);
	document.getElementById("gameslost").innerHTML = prettify(stats.gamesLost);
	document.getElementById("gamesforfeited").innerHTML = prettify(stats.gamesForfeited);
	document.getElementById("gameswinrate").innerHTML = getPercent(stats.gamesWon, stats.gamesWon + stats.gamesLost + stats.gamesForfeited);
	// Rounds Stats
	document.getElementById("roundswon").innerHTML = prettify(stats.roundsWon);
	document.getElementById("roundswonrock").innerHTML = prettify(stats.roundsWonRock);
	document.getElementById("roundswonpaper").innerHTML = prettify(stats.roundsWonPaper);
	document.getElementById("roundswonscissors").innerHTML = prettify(stats.roundsWonScissors);
	document.getElementById("roundswonfp").innerHTML = prettify(stats.roundsWonFP);
	document.getElementById("roundsdrawed").innerHTML = prettify(stats.roundsDrawed);
	document.getElementById("roundslost").innerHTML = prettify(stats.roundsLost);
	// Money Stats
	document.getElementById("money").innerHTML = prettify(stats.money);
	document.getElementById("moneywon").innerHTML = prettify(stats.moneyWon);
	document.getElementById("moneyachivs").innerHTML = prettify(stats.moneyAchivs);
	document.getElementById("moneylost").innerHTML = prettify(stats.moneyLost);
	document.getElementById("moneybalance").innerHTML = prettify(stats.moneyWon + stats.moneyAchivs - stats.moneyLost);
	document.getElementById("bankrupt").innerHTML = stats.bankrupt;

	// TODO: I didn't declare a var for moneybalance and his container, and I should.
    // FIXME: Money Balance doesn't get colored anymore because after going
    // through the prettify function, it gets changed from number to string and
    // string > 0 or string < 1 will always be false.
    // This can be fixed by doing the calculation again, instead of using
    // innerHTML:
    // if (stats.moneyWon + stats.moneyAchivs - stats.moneyLost < 0)
	if (document.getElementById("moneybalance").innerHTML < 0) {
		moneybalancecontainer.className = "negative";
	} else {
		moneybalancecontainer.className = "positive";
	}
}

// FIXME: This doesn't look very efficient.
function updateAchivsPage() {
	var achiv = document.getElementsByClassName("achievement");
	var progress = document.getElementsByClassName("achievement-progress");
	var maxProgress = document.getElementsByClassName("achievement-progress-max");
	var unlockDate = document.getElementsByClassName("achievement-unlock-date");
	// This needs to be ran only once, so maybe create a function to
	// generate the achievement list on the page once, and then just use this
	// function to update them.
    var name = document.getElementsByClassName("achievement-name");
	var reward = document.getElementsByClassName("achievement-reward");
	var icon = document.getElementsByClassName("achievement-icon");
	var achivsCompleted = 0;
	var progressArr = [stats.roundsWonRock, stats.roundsWonPaper,
	  stats.roundsWonScissors, stats.roundsWonFP, stats.roundsWon,
	  stats.roundsDrawed, stats.roundsLost, stats.gamesWonBo1,
	  stats.gamesWonBo3, stats.gamesWonBo5, stats.gamesWon,
	  stats.gamesLost];

	// TODO: Change i < 12 to i < achivs.length
	for (var i = 0; i < 12; i++) {
        name[i].innerHTML = achivs[i].name;
		reward[i].innerHTML = prettify(achivs[i].reward);
		if (i < progressArr.length) {
			if (progressArr[i] > maxProgress[i].innerHTML) progress[i].innerHTML = maxProgress[i].innerHTML;
			else progress[i].innerHTML = prettify(progressArr[i]);
		}

		if (achivs[i].unlocked) {
			achivsCompleted++;
			achiv[i].className = "achievement achievement-unlocked";
			unlockDate[i].innerHTML = achivs[i].unlockDate;
			icon[i].className = "fa fa-check fa-fw achievement-icon positive";
			icon[i].style.opacity = "1";
		} else {
			// Add some way to revert an unlocked achievement in case the player
			// resets his save, or imports one. Otherwise the classes added above
			// and the unlock date will remain.
			// icon[i].className = "fa fa-remove fa-fw achievement-icon negative";
			// achiv[i].className = "achievement achievement-locked";
			icon[i].style.opacity = "0.4";
		}
	}
	document.getElementById("achivstotal").innerHTML = achivs.length;
	document.getElementById("achivscompleted").innerHTML = achivsCompleted;
}

// Shows if the sound/effects is muted in the options screen.
function updateSoundIcons() {
    var musicIco = document.getElementById("sound-music-icon");
    var sfxIco = document.getElementById("sound-effects-icon");
    var unmuted = "fa fa-volume-up fa-fw";
    var muted = "fa fa-volume-off fa-fw";

    if (preferences.musicMuted) musicIco.className = muted;
    else musicIco.className = unmuted;

    if (preferences.effectsMuted) sfxIco.className = muted;
    else sfxIco.className = unmuted;
}

function updateSoundVolume() {
  document.getElementById("volume-music").innerHTML = Math.floor(preferences.musicVolume * 100);
  document.getElementById("volume-sfx").innerHTML = Math.floor(preferences.effectsVolume * 100);
}

// Updates the currency symbol based on the one selected by the player in Options.
function updateCurrency() {
	var curr = document.getElementsByClassName("currency");
	for (var i = 0; i < curr.length; i++) {
		curr[i].innerHTML = preferences.currency;
	}
}

// fade out
function fadeOut(el) {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= 0.03) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

// fade in
function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "inline-block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += 0.1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

// TODO: Change this to fit my needs.
function prettify(input) {
	if (preferences.delimiter === "") {
		return input;
	} else {
        var output = input.toString();
        // The bit that comes before the decimal point.
        var characteristic = "";
        // The bit that comes afterwards.
        var mantissa = "";
        var digitCount = 0;

		//first split the string on the decimal point, and assign to the characteristic and mantissa
		var parts = output.split('.');
		if (typeof parts[1] === 'string') var mantissa = '.' + parts[1]; //check it's defined first, and tack a decimal point to the start of it

		//then insert the commas in the characteristic
		var charArray = parts[0].split(""); //breaks it into an array
		for (var i=charArray.length; i>0; i--) { //counting backwards through the array
			characteristic = charArray[i-1] + characteristic; //add the array item at the front of the string
			digitCount++;
			// FIXME: Money Balance: -.324.573.234€
			// TODO: If the first digit is the minus sign, don't count it.
			if (digitCount == 3 && i != 1) { //once every three digits (but not at the head of the number)
                // Add the delimiter at the front of the string
				characteristic = preferences.delimiter + characteristic;
				digitCount = 0;
			}
		}
		output = characteristic + mantissa; //reassemble the number
        return output;
	}
}
