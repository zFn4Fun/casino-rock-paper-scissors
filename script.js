// The "Game" object that resets every new game session.
var game = {
  rounds: 0,
  playerScore: 0,
  drawScore: 0,
  aiScore: 0,
  pot: 0
};
// The "Stats" object that holds all the stats.
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
// The "Achievements" array of objects that holds all the achievements.
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
  // There was some issues with the name property, since it had to output the
  // prettified number and the currently selected currency. (Hoisting issue)
  // I transformed them into methods, instead of properties, as a workaround.
  {name() {
      return "Win " + prettify(10000) + preferences.currency;
  },
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.moneyWon >= 10000 ? true : false;
	},
	reward: 4000},
  {name() {
        return "Earn " + prettify(10000) + preferences.currency + " from achievements";
  },
    unlocked: false,
    unlockDate: "",
    req() {
        return stats.moneyAchivs >= 10000 ? true : false;
    },
    reward: 3000},
  {name() {
    return "Lose " + prettify(10000) + preferences.currency;
  },
    unlocked: false,
    unlockDate: "",
    req() {
        return stats.moneyLost >= 10000 ? true : false;
    },
    reward: 3000},
  {name() {
     return "Have " + prettify(10000) + preferences.currency + " on hand";
  },
    unlocked: false,
    unlockDate: "",
    req() {
        return stats.money >= 10000 ? true : false;
    },
    reward: 3000},
  // Misc achievements.
  {name: "I give up!",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesForfeited >= 1 ? true : false;
	},
	reward: 1000},
  {name: "Who needs money?",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.bankrupt >= 1 ? true : false;
	},
	reward: 2000},
  {name: "Free spirit",
	unlocked: false,
	unlockDate: "",
	req() {
		return game.rounds === Infinity && game.playerScore >= 30 ? true : false;
	},
	reward: 5000},
  {name: "Winning Machine",
	unlocked: false,
	unlockDate: "",
	req() {
		return stats.gamesWon + stats.gamesLost + stats.gamesForfeited >= 10 && getPercent(stats.gamesWon, stats.gamesWon + stats.gamesLost + stats.gamesForfeited) >= 75 ? true : false;
	},
	reward: 10000}
];
// The "Preferences" object that holds all the preferences.
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
    tickRadioButton();
    updateSoundIcons();
    updateSoundVolumeText();
});

function play(num) {
    // Set the number of max rounds.
	game.rounds = num;
	updateTableStats();
	changePanel("gamescreen");
    // If the game has less than 6 max rounds, show the betting panel.
	if (game.rounds < 6) {
        var betOpts = document.getElementsByClassName("betting-option");
        var betVal = document.getElementsByClassName("betting-value");
        // Disables the betting options that are unrealistic by comparing
        // the players current money value to the betting value inside of every
        // betting option.
        for (var i = 0; i < betVal.length; i++) {
            if (stats.money < betVal[i].innerHTML) {
                betOpts[i].style.display = "none";
                console.log("Disabled one betting option.");
            } else betOpts[i].style.display = "inline-block";
        }
		fadeIn(document.getElementById("betting"));
        // Disables the cards.
		changeCardState("disable");
    // Otherwise the game is "Free Play", so hide everything money related.
	} else {
		fadeOut(document.getElementById("betting"));
		gameLog("Select a card.");
		changeCardState();
		// TODO: Need to remove the Pot and Player Money from the game screen.
	}
}

// Handles the betting.
function bet(sum) {
	stats.money -= sum;
	game.pot = sum * 2;
	updateTableStats();
	setTimeout(function () {
		fadeOut(document.getElementById("betting"));
		changeCardState();
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

    // Checks the score to declare a winner.
	setTimeout(function () {
        if (game.rounds / 2 < game.playerScore) {
            gameLog("You WON! <br />Score <br /> <span style='float: left'>You: " + game.playerScore +"</span> <span style='float: right;'>AI: " + game.aiScore + "</span><br /> Click to continue...");
            console.log("------------------");
            document.getElementById("wrapper").addEventListener("click", resetGame);
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
            document.getElementById("wrapper").addEventListener("click", resetGame);
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
        save();
        unlockAchiv();
	}, 3500);
}

// TODO: Improve this.
function forfeit() {
	if (confirm("Are you sure you want to forfeit? You will lose the money betted.")) {
		stats.gamesForfeited++;
        //TODO: Think of a way to have this called only once.
        if (stats.gamesForfeited === 1) unlockAchiv();
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

// Resets the properties of the "game" object (score, rounds, pot).
function resetGame() {
	document.getElementById("wrapper").removeEventListener("click", resetGame);
	game.playerScore = 0;
	game.drawScore = 0;
	game.aiScore = 0;
	game.pot = 0;
	game.rounds = 0;
	changePanel("mainscreen");
	setTimeout(resetHand, 1100);
}

// Resets every card back to the default state and clears the game log.
function resetHand() {
	var buttons = document.getElementsByClassName("btn");
	gameLog("");

	for (var i = 0; i < buttons.length; i++) {
        // I could just call the changeCardState function, since it does the
        // same thing, but i'm already looping through every card.
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
        //TODO: Have a way to show this to the player, thats not the console.
		console.log("The casino owner felt bad for you losing all your money, so he gave you 100" + preferences.currency + " back.");
		save();
	}
}

function unlockAchiv() {
    // The array where the unlocked achievements are stored so they can be
    // passed to displayUnlockedAchiv().
	var unlocked = [];
    var changed = false;
    // Loop 3 times through all the achievements, in case an achievement gets
    // unlocked by another achievement being unlocked.
    for (var j = 0; j < 3; j++) {
    	for (var i = 0; i < achivs.length; i++) {
    		if (!achivs[i].unlocked && achivs[i].req()) {
    			stats.money += achivs[i].reward;
    			stats.moneyAchivs += achivs[i].reward;
    			achivs[i].unlocked = true;
    			achivs[i].unlockDate = getDateString();
    			unlocked.push(achivs[i]);
    			console.log("Unlocked " + achivs[i].name + " on " + achivs[i].unlockDate);
            // If the achievement was previously unlocked, but the requirements
            // were changed, change the unlocked and unlockDate property to
            // false.
    		} else if (achivs[i].unlocked && !achivs[i].req()) {
                achivs[i].unlocked = false;
                achivs[i].unlockDate = "";
                changed = true;
            }
    	}
    }
    // If the unlocked array is not empty, save and call the function that
    // displays the notification that an achievement was unlocked.
    if (changed || unlocked.length) {
        save();
        // I don't think there is a need for this here, besides for debugging.
        // TODO: Comment this out.
        updateAchivsPage();
        if (unlocked.length) {
            displayUnlockedAchiv(unlocked);
        }
    }
}

// Displays a notification that an achievement was unlocked.
function displayUnlockedAchiv(array) {
	var count = 0;
	console.log(array);
	(function display() {
		console.log(array[count].name);
        // We check to see if the name of the achievement is a method.
        if (typeof array[count].name === "function") {
            document.getElementById("unlockedachiv-name").innerHTML = array[count].name();
        } else  document.getElementById("unlockedachiv-name").innerHTML = array[count].name;
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
	})();
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

// Returns the percentage of val out of max, or 0 if both are 0.
function getPercent(val, max) {
	if (val === 0 && max === 0) return 0;
	else if (isNaN(val) || isNaN(max)) return console.log("Both arguments need to be numbers.");
	else return Math.floor((val / max) * 100);
}

// Adds delimiters to numbers.
// FIXME: prettify(-2323232) -> "-2.323.232"
// prettify(-23232); -> ".-23.232"
// prettify(-23232232); -> ".-23.232.232")
// If the there are only 2 characters before the first delimiter, it counts the
// minus sign too and adds a delimiter at the head of the string.
function prettify(input) {
    // If there is no delimiter, return the input as it is.
	if (preferences.delimiter === "") {
		return input;
    // Otherwise prettify it by adding the delimiters if needed.
	} else {
        var output = input.toString();
        // The bit that comes before the decimal point.
        var characteristic = "";
        // The bit that comes after the decimal point.
        var mantissa = "";
        var digitCount = 0;
        var num = 0;

        // Checks to see if the number is negative or positive.
        if (input > -1) num = 1;
        else num = 2;

		// First split the string on the decimal point, and assign to the
        // characteristic and mantissa.
		var parts = output.split('.');
		if (typeof parts[1] === 'string') mantissa = '.' + parts[1]; //check it's defined first, and tack a decimal point to the start of it

		// Then break the characteristic into an array and insert the
        // delimiters every 3 characters.
		var charArray = parts[0].split("");
		for (var i = charArray.length; i > 0; i--) { //counting backwards through the array
			characteristic = charArray[i-1] + characteristic; //add the array item at the front of the string
			digitCount++;
            // Once every three digits (but not at the head of the number).
			if (digitCount === 3 && i !== num) {
                // Add the delimiter at the front of the string
				characteristic = preferences.delimiter + characteristic;
				digitCount = 0;
			}
		}
        // Return the reassambled number.
		return (output = characteristic + mantissa);
	}
}

// Takes a number that was prettified, and returns it without the delimiter.
function unprettify(input) {
        var charArray = input.split("");
        var output = "";

        for (var i = 0; i < charArray.length; i++) {
            if (charArray[i] != "." && charArray[i] != "," && charArray[i] != [" "]) output += charArray[i];
        }
        return Number(output);
}

// Saves the Stats object to localStorage so it wont be lost between sessions.
// TODO: try btoa and atob for compressing and decompressing.
function save(type) {
    var achivsArr = [];
    for (var i = 0; i < achivs.length; i++) {
        achivsArr.push({unlocked: achivs[i].unlocked, unlockDate: achivs[i].unlockDate});
    }
    var saveFile = JSON.stringify({stats: stats, preferences: preferences, achivs: achivsArr});

    if (type === "export") {
        var encoded = btoa(saveFile);
        console.log('Compressing Save');
        console.log('Compressed from ' + saveFile.length + ' to ' + encoded.length + ' characters');
        document.getElementById("txt-area").value = encoded;
    }

    localStorage.setItem("crps", saveFile);
	console.log("Saved");
}

// Loads all the saved objects if they were created by the save function.
function load(type) {
    // TODO: Add a way to show the player he successfully imported the save.
    if (type === "import") {
        console.log("Imported saved game");
        var encoded = document.getElementById("txt-area").value;
        var decoded = atob(encoded);
        var imported = JSON.parse(decoded);
        stats = imported.stats;
        preferences = imported.preferences;
    } else {
        var saveFile = localStorage.getItem("crps");
    	if (saveFile) {
            var temp = JSON.parse(saveFile);
    		stats = temp.stats;
            preferences = temp.preferences;
            for (var i = 0; i < temp.achivs.length; i++) {
                achivs[i].unlocked = temp.achivs[i].unlocked;
                achivs[i].unlockDate = temp.achivs[i].unlockDate;
            }
    	}
    }
}

// Resets the values saved in localStorage for the Stats and Achievements
// objects by reassigning them to their default values.
function deleteSave() {
	if (confirm("Are you sure? You will lose all the progress made.")) {
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
        // Loops through the Achievements objects and resets it.
        for (var i = 0; i < achivs.length; i++) {
            achivs[i].unlocked = false;
            achivs[i].unlockDate = "";
        }
        save();
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

	if (panel === "statsscreen") updateStatsPage();
	else if (panel === "achievementsscreen") updateAchivsPage();
    else if (panel === "optionsscreen") document.getElementById("txt-area").value = "";

	setTimeout(function () {
		fadeIn(document.getElementById(panel));
	}, 1000);
}

// Disables of enables the card buttons while playing.
function changeCardState(type) {
    var cards = document.getElementsByClassName("card");
    var disabled = false;

    if (type === "disable") {
        disabled = true;
    }

    for (var i = 0; i < cards.length; i++) {
        cards[i].disabled = disabled;
    }
}

// Ticks the proper radio buttons so it will be the same as the ones stored in
// preferences.
function tickRadioButton() {
    var radio = [document.getElementsByName("options-currency"),
        document.getElementsByName("options-delimiter")];
    var compare = [preferences.currency, preferences.delimiter];

    for (var i = 0; i < radio.length; i++) {
        for (var j = 0; j < radio[i].length; j++) {
            if (compare[i] === radio[i][j].value) {
    			radio[i][j].checked = true;
    			console.log("Currency: " + compare[i]);
    			console.log("Value: " + radio[i][j].value);
    			break;
    		}
        }
    }
    updateCurrency();
}

// TODO: Unify setCurrency() and setDelimiter().
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
        if (type === "dec" && preferences.musicVolume >= 0.1) {
            preferences.musicVolume -= 0.1;
        }
        // Workaround for js not being too good with floats.
        preferences.musicVolume = Number(preferences.musicVolume.toFixed(1));
        music.volume = preferences.musicVolume;
    } else if (sound === "effects") {
        if (type === "inc" && preferences.effectsVolume < 1) {
            preferences.effectsVolume += 0.1;
        }
        if (type === "dec" && preferences.effectsVolume >= 0.1) {
            preferences.effectsVolume -= 0.1;
        }
        // Workaround for js not being too good with floats.
        preferences.effectsVolume = Number(preferences.effectsVolume.toFixed(1));
    }
    save();
    updateSoundVolumeText();
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

// Updates the numbers in the gamescreen div.
function updateTableStats() {
	document.getElementById("pot").innerHTML = prettify(game.pot);
	document.getElementById("tablemoney").innerHTML = prettify(stats.money);
	document.getElementById("aiscore").innerHTML = game.aiScore;
	document.getElementById("playerscore").innerHTML = game.playerScore;
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

	// TODO: I didn't declare a var for moneybalance container, and I should.
	if (stats.moneyWon + stats.moneyAchivs - stats.moneyLost < 0) {
		moneybalancecontainer.className = "negative";
	} else if (stats.moneyWon + stats.moneyAchivs - stats.moneyLost === 0) {
        moneybalancecontainer.className = "";
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
	  stats.gamesLost, stats.moneyWon, stats.moneyAchivs, stats.moneyLost,
      stats.money];

	for (var i = 0; i < achivs.length; i++) {
        if (typeof achivs[i].name === "function") {
            name[i].innerHTML = achivs[i].name();
        } else name[i].innerHTML = achivs[i].name;
		reward[i].innerHTML = prettify(achivs[i].reward);
        unlockDate[i].innerHTML = achivs[i].unlockDate;

		if (i < progressArr.length) {
            maxProgress[i].innerHTML = unprettify(maxProgress[i].innerHTML);
			if (progressArr[i] > maxProgress[i].innerHTML) progress[i].innerHTML = prettify(maxProgress[i].innerHTML);
			else progress[i].innerHTML = prettify(progressArr[i]);
            maxProgress[i].innerHTML = prettify(maxProgress[i].innerHTML);
        }
        // If the achievement is unlocked, show it visualy on the achievements
        // screen.
		if (achivs[i].unlocked) {
			achivsCompleted++;
			icon[i].className = "fa fa-check fa-fw achievement-icon positive";
			icon[i].style.opacity = "1";
            achiv[i].className = "achievement achievement-unlocked";
        // Otherwise reset it visualy to the "locked" state.
		} else {
			icon[i].className = "fa fa-remove fa-fw achievement-icon negative";
            icon[i].style.opacity = "0.4";
			achiv[i].className = "achievement achievement-locked";
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

// Updates the text that shows the current volume level on the options screen.
function updateSoundVolumeText() {
  document.getElementById("volume-music").innerHTML = preferences.musicVolume * 100;
  document.getElementById("volume-sfx").innerHTML = preferences.effectsVolume * 100;
}

// Updates the currency symbol everywhere in the html file, based on the one
// selected by the player in Options.
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
