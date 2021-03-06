function GuessMe() {

	var that = {};
	var showFunctionTimer;
	var solution = "";
	var highscore = 0;
	var score = 0;
	var solutionList = [];
	var factList = [];
	var gamePosition = 0;
	var progress;

	// const
	var GUESS_TIME = 15000;
	that.callback = null;


	$('#guessMeSolutionInput').on('keyup', function(e) {
	    if (e.which == 13) {
	        e.preventDefault();
	        $("#guessDiv button").click();
	    }
	});

	function startProgress(){
		window.clearInterval(progress);
		$("#time").text(GUESS_TIME/1000);
	    progress = setInterval(function() {
			if (parseInt($("#time").text(), 10) > 1){
				$("#time").text(parseInt($("#time").text(), 10) - 1);
			}
			else {
				window.clearInterval(progress);
				$("#time").text(0);
			}

		}, 1000);
	}

	function startTimer(time, facts, position) {
		score--;
		if (typeof position === 'undefined') {
			position = 0;
		}
		if (position === facts.length) {
			gameOver();
		}
		else {
			showFact(facts[position]);
			startProgress();
			if (position < facts.length) {
				showFunctionTimer = window.setTimeout(function() {
					startTimer(time, facts, position + 1);
				}, time);

			}
		}

	}

	function showFact(fact) {
		var htmlString = '<li class="list-group-item list-group-item-info text-center"> ' + fact + '</li>';
		$('#factList').append(htmlString);
	}

	function endTimer() {
		window.clearTimeout(showFunctionTimer);
	}

	function wrongAnswer() {
		$("#guessDiv").removeClass("has-success");
		$("#guessDiv").addClass("has-error");
		$("#guessLabel").text("Wrong Answer!");
		highscore--;
		$("#highscore").text("Total Score: " + highscore);
	}

	function rightAnswer() {
		$("#guessDiv").addClass("has-success");
		$("#guessLabel").text("Correct Answer!");
		endTimer();
		gameOver();
	}

	function gameOver() {
		highscore += score;
		$("#guessDiv").removeClass("has-error");
		$('#guessMeSolutionInput').val(solution);
		$('#guessDiv input').attr('disabled', true);
		$('#guessDiv button').attr('disabled', true);
		$("#guessLabel").text("The Answer is");
		$("#highscore").text("Total Score: " + highscore);
		$("#startButton").show();
		$("#time").hide();
		window.clearInterval(progress);
		if(gamePosition < solutionList.length) {
			$("#startButton").text('Next Round');
		} else {
			$("#startButton").text('Return To World');
			$("#startButton").off('click').on('click', function() {
				console.log("Return at this point...");
				that.callback({'highscore': highscore});
			});
		}
	}

	function startRound(sol, fList) {
		resetGUI();
		$('#guessDiv input').attr('disabled', false);
		$('#guessDiv button').attr('disabled', false);
		$('#guessMeSolutionInput').focus();
		$("#guessLabel").text("Enter Your Guess!");
		$("#time").show();
		$("#guessMeHintsHeadline").fadeIn().removeClass('hidden');
		startTimer(GUESS_TIME, fList);
		solution = sol;
		score = fList.length;
	}

	function resetGUI() {
		$('#factList').empty();
		$('#guessMeSolutionInput').val("");
		$('#guessMeSolutionInput').attr('placeholder', "It is...");
		$("#guessLabel").text("Click the button to start the game.");
		$("#guessDiv").removeClass("has-error");
		$("#guessDiv").removeClass("has-success");
		$("#startButton").text('Go!');
	}

	function loadAndCheckSolution() {
		checkSolution($('#guessMeSolutionInput').val());
	}

	function checkSolution(answer) {
		if (answer.toUpperCase() === solution.toUpperCase()){
			rightAnswer();
		}
		else {
			wrongAnswer();
		}
	}

	function startGame() {
		$("#startButton").hide();
		startRound(solutionList[gamePosition], factList[gamePosition]);
		gamePosition++;
	}

	function initGame(solList, factListList) {
		solutionList = solList;
		factList = factListList;
		gamePosition = 0;
		highscore = 0;
		score = 0;

		$("#guessMeHintsHeadline").addClass("hidden");
		$("#highscore").text("Total Score: 0");
		resetGUI();
		$('#guessDiv input').attr('disabled', true);
		$('#guessDiv button').attr('disabled', true);

		$("#startButton").off('click');
		$("#startButton").on('click', startGame);
		$("#guessMeCheckResultBtn").click(loadAndCheckSolution);
	}

	that.initializeGame = function(data, callback) {
		that.callback = callback;
		initGame(data.solutions, data.facts);
	};

	return that;
}