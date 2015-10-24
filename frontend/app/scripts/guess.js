var showFunctionTimer;
var solution = "";

$('input[type=text]').on('keyup', function(e) {
    if (e.which == 13) {
        e.preventDefault();
        $("#guessDiv button").click();
    }
});

function startTimer(time, facts, position) {
	if (typeof position === 'undefined') {
		position = 0;
	}
	showFact(facts[position]);
	if (position < facts.length - 1) {
		showFunctionTimer = window.setTimeout(function() {
			startTimer(time, facts, position + 1);
		}, time);
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
}

function rightAnswer() {
	$("#guessDiv").removeClass("has-error");
	$("#guessDiv").addClass("has-success");
	$("#guessLabel").text("Correct Answer!");
	endTimer();
}

function startGame(sol, factList) {
	startTimer(5000, factList);
	solution = sol;
}

function checkSolution(answer) {
	console.log(answer);
	if (answer.toUpperCase() === solution.toUpperCase()){
		rightAnswer();
	}
	else {
		wrongAnswer();
	}
}


