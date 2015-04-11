
var game = function() {

	var guess,
		list = [],
		guessesRemain = 5,
		answer = Math.floor(Math.random() * 100) + 1,
		diff,
		temp;

	console.log("answer: " + answer);

/******** Modal Results Window ********/
	var $overlay = $('<div id="overlay"></div>'),
		$modal = $('<div id="modal"></div>'),
		$message = $('<div id="message"></div>'),
		$footer = $('<div id="footer"><div></div></div>'),
		$winMsg = $('<h2>You won!</h2><p class="result">Congratulations, you won the game!</p>'),
		$loseMsg = $('<h2>Game over</h2><p class="result">You\'ve run out of guesses! The answer was ' + answer +'.</p>'),
		$playAgain = $('<button class="btn btn-success btn-lg" id="play-again" type="button">Play again</button>');

	// append modal window components
	$('body').append($overlay);
	$footer.append($playAgain);
	$message.append($footer);
	$modal.append($message);
	$overlay.append($modal);

/****** Modal Results Window End ***********/

	$(document).ready(function() {
		$('#input-text').focus();
	});

	/***** Submit Event ******/

	$('#input').submit(function(event) { // When user submits guess
		event.preventDefault();
		guess = +$('#input-text').val(); //store input and convert to number
		diff = Math.abs(guess - answer);	//get difference btw guess and answer

		var isValid = validate(guess); // validate input

		if (!isValid) {				// if not valid
			return clearInput();	// clear input
		} else {
			compareAnswer(guess, diff); // else compare input with answer, provide feedback
			lowerOrHigher(guess); // indicate whether to guess lower or higher
			calculateTemp(diff);	// animate temperature
			logGuess(guess, diff);	// add to guess history
			showResult(guess);	// show results
		}

	});

	/***Get Hint Click Event ****/

	$("#hint").click(function() {
		$('#feedback').text("Psst...the answer is " + answer + ".");
	});

	/*********FUNCTIONS*********/

	function validate(guess) {

		if (guess < 1 || guess > 100 || isNaN(guess)) {	// if invalid number (NaN, empty, or over/under bounds)
			// alert in feedback box
			$('#feedback').text("Oops! That's an invalid number. Please try again with a number between 1 and 100.");
			return false;

		} else if (list.indexOf(guess) !== -1) { // if repeat guess
			$('#feedback').text("You've already guessed that number! Pick another number.");
			return false;
		}

		return true;
	}


	function clearInput() {
		return $('#input-text').val("");
	}


	function compareAnswer(guess, diff) {
		var prevGuess = list[list.length-1];
		var prevDiff = Math.abs(prevGuess - answer);

		if (prevGuess) {	// if previous Guess exists

			if (prevDiff >= diff && diff >= 25) {
			
				$('#feedback').text("You're getting warmer, but still pretty cold.");

				} else if (prevDiff >= diff && diff > 5) {
				$('#feedback').text("You're getting hotter!");
	 
			} else if (prevDiff < diff && diff > 5) {
		
				$('#feedback').text("You're getting cooler!");

			} else if (diff > 0) {
				$('#feedback').text("You're super hot!");
			}

		} else if (!prevGuess) {	// if this is first guess

			if (diff > 25) {
				$('#feedback').text("You're cold!");
			} else if (diff > 10) {
				$('#feedback').text("You're warm!");
			} else if (diff > 5) {
				$('#feedback').text("You're hot!");
			} else if (diff > 0) {
				$('#feedback').text("You're super hot!");
			}
		}
		
		return true;
	}

	function lowerOrHigher(guess) {
		var $guessLower = $('<span> Guess lower.</span>');
		var $guessHigher = $('<span> Guess higher.</span>');

		if (guess > answer) {
			$('#feedback').append($guessLower);
		} else if (guess < answer) {
			$('#feedback').append($guessHigher);
		}
	}
	
	function calculateTemp(diff) {	// temperature scale within 25 units of proximity to answer
		var prevGuess = list[list.length-1];	//prevGuess is last number in guess array
		var prevDiff = Math.abs(prevGuess - answer);	//previous guess difference
		var prevTemp = 100 - (prevDiff * 4);	// 100%/25 = move 4% per unit change

		if (prevDiff > 25 && diff > 25 || !prevGuess && diff > 25) {
			$('#pointer').effect("shake", "3");

		} else if (prevDiff <= 25 && diff > 25) {
			$('#pointer').animate({left: "-=" + prevTemp + "%"}, 1000);

		} else if (prevDiff <= 25 && diff <= 25) {

			temp = 100 - prevTemp - (diff * 4);
			if (temp === 0) {
				$('#pointer').hide().fadeIn();
			} else {
				$('#pointer').animate({left: "+=" + temp + "%"}, 1000);
			}

		} else if (prevDiff > 25 && diff <= 25) {
			temp = 100 - (diff * 4);
			$('#pointer').animate({left: "+=" + temp + "%"}, 1000);

		} else if (!prevGuess && diff <= 25) {
			temp = 100 - (diff * 4);
			$('#pointer').animate({left: "+=" + temp + "%"}, 1000);
		}
		
	}

	function logGuess(guess, diff) {
		list.push(guess);	// store number in array
		var guessed = "<p>" + guess + "</p>";
		var idNum = list.length;
		var div = '#guess' + idNum;	// store guess in div
		//display color temp of each guess
		if (diff >= 25) {
			$(div).css("background-color", "#337ab7");	//blue if cold

		} else if (diff > 10) {
			$(div).css("background-color", "#f0ad4e");	//yellow if warm

		} else {
			$(div).css("background-color", "#d9534f");	//red if hot
		}

		$('#guess-log').show();
		$(div).append(guessed); //display each guess
		$(div).show("drop"); // animate

		guessesRemain--; // decrement num of remaining guesses
		$('#numGuess').text(guessesRemain + " guesses remaining.");

	}

	function showResult(guess) {

		if (guess === answer) {	// If guessed correctly, show win results
			$message.prepend($winMsg);
			return animateModal();
			
		} else if (guess !== answer && guessesRemain === 0) {	//if no guesses left
			$message.prepend($loseMsg);	// show lose message
			return animateModal();
		}

		else {	// if more guesses remain, guess again
			return clearInput();
		}
	}

	function animateModal() {
		$overlay.show();
		$modal.slideDown();
		$('#input').unbind("submit");
		$("#play-again").click(function() { // When user clicks on "Play Again"
			location.reload();	// reload page	
		});
	}

}();
