let countspan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");





let curentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestion (){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function (){
        if ( this.readyState ===4 && this.status === 200){
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;
            createBullets(qCount);

            addQuestionData(questionObject[curentIndex],qCount);


            countdown(5, qCount);

            submitButton.onclick = () =>{
                let theRightAnswer = questionObject[curentIndex].right_answer;

                curentIndex++;

                checkAnswer(theRightAnswer,qCount);


                quizArea.innerHTML="";
                answerArea.innerHTML="";

                addQuestionData(questionObject[curentIndex],qCount);

                handleBullets();

                clearInterval(countdownInterval);
                countdown(5,qCount);

                showResults(qCount);

            }

        }
    }

    myRequest.open("GET","html-quistion.json" ,true);
    myRequest.send();
}
getQuestion();






function createBullets (num){
    countspan.innerHTML=num;

    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if( i === 0){
            theBullet.className="on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
}




function addQuestionData(obj , count) {
    if (curentIndex < count){
        let questionTitle = document.createElement("h2");

        let questionText = document.createTextNode(obj['title']);

        questionTitle.appendChild(questionText);

        quizArea.appendChild(questionTitle);

        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");

            mainDiv.className = 'answer';

            let radioInput = document.createElement("input");

            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer= obj[`answer_${i}`];

            if ( i === 1){
                radioInput.checked = true;
            }


            let theLabel = document.createElement("label");

            theLabel.htmlFor = `answer_${i}`;

            let theLabelText = document.createTextNode(obj[`answer_${i}`]);

            theLabel.appendChild(theLabelText);

            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);


            answerArea.appendChild(mainDiv);



        }
    }

}



function checkAnswer(rAnswer,count){
    let answers =document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked){
            theChoosenAnswer=answers[i].dataset.answer;
        }
    }
    if (rAnswer ===  theChoosenAnswer){
        rightAnswers++;
        console.log("Good Answer");
    }
}


function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan =Array.from(bulletsSpans);
    arrayOfSpan.forEach((span,index) => {
        if (curentIndex === index){
            span.className="on";
        }
    })
}




function showResults(count){
    let theResults;
    if ( curentIndex === count){
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();


        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }

        resultsContainer.innerHTML=theResults;


        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";


    }
}






function countdown(duration, count) {
    if (curentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}