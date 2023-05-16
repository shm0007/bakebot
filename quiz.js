document.addEventListener('DOMContentLoaded', function() {
    populateMCQQuiz()
}, false);
let guessCount = []
let answered = []
function populateMCQQuiz(){
    var parent = document.getElementById("mcq");

   for(var i = 0; i< data.questions.length; i++){

    var question = document.createElement("p");
    question.setAttribute("class", "p-question")
    question.textContent = data.questions[i].title;

    parent.appendChild(question);

    for(var j = 0; j< data.questions[i].options.length; j++){
        var radioInput = document.createElement("input");
        radioInput.setAttribute("id","option-" + i+ "-" +j );
        radioInput.setAttribute("type","radio");
        radioInput.setAttribute("name", "option-" + i );
        radioInput.setAttribute("value", "option-" + i+ "-" +j );
        //element.setAttribute("onclick", "checkRadio(this)");
        parent.appendChild(radioInput);
        guessCount.push(0);
        answered.push(0);
        var textRadio = document.createElement("label");
        textRadio.setAttribute("for", "option-" + i+ "-" +j)
        textRadio.textContent = data.questions[i].options[j]
        parent.appendChild(textRadio);
        parent.appendChild(document.createElement("br"));

    }
    var hintP = document.createElement("p")
    hintP.setAttribute("id", "hint-"+ i);
    hintP.setAttribute("class", "hint");
    hintP.style.display = "none";
    parent.appendChild(hintP);

    var guessP = document.createElement("p")
    guessP.setAttribute("id", "guess-"+ i);
    guessP.style.display = "none";
    parent.appendChild(guessP);


    var checkButton = document.createElement("button")
    checkButton.setAttribute("id", "check-" + i);
    checkButton.textContent = "Check";
    checkButton.setAttribute("data-qId", i);
    checkButton.setAttribute("onclick", "checkAnswer(this)");
    parent.appendChild(checkButton)     
   }
   createQuizProgress();

}
function createQuizProgress(){
    var summaryDiv =  document.getElementById("quiz-summary");
    var globalCountP = document.createElement("p");
    globalCountP.setAttribute("id", "global-ct");
    globalCountP.textContent = "You  have made a total of 0 guesses so far";
    summaryDiv.appendChild(globalCountP);
     
    var pbar = document.createElement("div");
    pbar.setAttribute("class", "progress-bar");
    pbar.setAttribute("id", "p-bar");
    pbar.setAttribute("role","progressbar");
    pbar.setAttribute("aria-valuemax","100");
    pbar.style.width = "0%";
    pbar.textContent = "0%"
    summaryDiv.appendChild(pbar);
    
    var correctAnswerP = document.createElement("p");
    correctAnswerP.setAttribute("id", "correct-ct");
    correctAnswerP.textContent = "You  have answered " + answered.filter(x => x === 1).length + " / " + data.questions.length + " questions";
    summaryDiv.appendChild(correctAnswerP);
      
}
function updateQuizProgress(){
    var pbar = document.getElementById("p-bar")

    pbar.style.width  = ( answered.filter(x => x === 1).length * 100 / data.questions.length ) + "%";
    pbar.textContent  = ( answered.filter(x => x === 1).length *100 / data.questions.length) + "%";
    
    var globalCountP = document.getElementById("global-ct");
    globalCountP.textContent = "You  have made a total of " + guessCount.reduce( (sum, val) => sum+val) + " guesses so far"; 
    var correctAnswerP =  document.getElementById("correct-ct");
    correctAnswerP.textContent = "You  have answered " + answered.filter(x => x === 1).length + " / " + data.questions.length + " questions";

}

function checkAnswer(element){
    var questionNo = element.getAttribute("data-qId");
    guessCount[questionNo]++;
    for(var i = 0; i<4; i++){
      var rb =   document.getElementById("option-" + questionNo + "-" +i );
      if(rb.checked){
        var hint = document.getElementById("hint-" + questionNo);
        var guessText = document.getElementById("guess-" + questionNo);
        guessText.style.display = "block";
        hint.textContent = data.questions[questionNo].hints[i];
        hint.style.display = "block";
        if(data.questions[questionNo].correct == i){
            answered[questionNo] = 1;
             guessText.textContent  = " You have solved it in "+ guessCount[questionNo] + " tries.";
            hint.style.backgroundColor = "#19c519";
        }else{
            guessText.textContent =  " You have made " + guessCount[questionNo]+ " guesses so far.";
        }
      }
    }
    updateQuizProgress();
        
}
