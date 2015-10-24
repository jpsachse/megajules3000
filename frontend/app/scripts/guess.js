var showFunctionTimer;
var solution = "";
var highscore = 0;
var score = 0;
var solutionList = [];
var factList = [];
var gamePosition = 0;

// const
var GUESS_TIME = 5000;


$('input[type=text]').on('keyup', function(e) {
    if (e.which == 13) {
        e.preventDefault();
        $("#guessDiv button").click();
    }
});
initGame(["Wir", "Ihr"], [["echt cool", "und sowieso", "und so"], ["gar nicht", "genau"]]);

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
	score--;
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
	$('#solutionInput').val(solution);
	$('#guessDiv input').attr('disabled', true);
	$('#guessDiv button').attr('disabled', true);
	$("#guessLabel").text("The Answer is");
	$("#highscore").text("Total Score: " + highscore);
	$("#startButton").show();
	if(gamePosition < solutionList.length) {
		$("#startButton").text('Next Round');
	} else {
		$("#startButton").text('Return To World');
		$("#startButton").click(function() { console.log("Return at this point...");});
	}
}

function startRound(sol, fList) {
	$('#factList').empty();
	$('#guessDiv input').attr('disabled', false);
	$('#guessDiv button').attr('disabled', false);
	$('#solutionInput').val("");
	$('#solutionInput').attr('placeholder', "It is...");
	$('#solutionInput').focus();
	$("#guessLabel").text("Enter Your Guess!");
	$("#guessDiv").removeClass("has-error");
	$("#guessDiv").removeClass("has-success");
	startTimer(GUESS_TIME, fList);
	solution = sol;
	score = fList.length;
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

	$('#guessDiv input').attr('disabled', true);
	$('#guessDiv button').attr('disabled', true);
}
