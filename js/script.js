$(document).ready(function () {
  //FUNCTIONS
  
  let questionsEl = document.getElementById("questions");
  var correctAnswer = "";
  $("#whammies").hide();
  //Pull Trivia questions and answers based on category selected by player
  function getTrivia(category) {
    //Clear the div before displaying the next question/answer set
    $("#questions").empty();
    let requestURL =
      "https://opentdb.com/api.php?amount=15&category=" +
      category +
      "&type=multiple";
      console.log("URL:", requestURL);
      $.ajax({
        url: requestURL,
        method: "GET",
    }).then(function (data) {
      console.log("Data: ", data);
      //VARIABLE DECLARATIONS
      //dynamically create div where the HTML will be placed
      let trivia = $("#questions");
      let question = $("<h3>");
      // let answersEl = $("<h3>");
      let answers = [];
      //get the data into the element that was created above
      let randomIndex = Math.floor(Math.random() * 15);
      // console.log(randomIndex);
      question.html(data.results[randomIndex].question);
      // console.log("Question:", data.results[randomIndex].question);
      trivia.append(question);
      //build array for answers including both incorrect and correct answers
      correctAnswer = data.results[randomIndex].correct_answer; //using the number of the index didn't match
      let incorrectAnswers = data.results[randomIndex].incorrect_answers;
      // answers.push(correctAnswer);
      // answers = answers.concat(incorrectAnswers);
      answers = [correctAnswer, ...incorrectAnswers];
      //loop through answers
      for (let i = 0; i < 4; i++) {
        let randomPosition = Math.floor(Math.random() * answers.length);
        let answersBtn = document.createElement("button");
        answersBtn.setAttribute("class", "w3-btn");
        answersBtn.setAttribute("id", i);
        answersBtn.textContent = answers[randomPosition]; //added a random position variable so the answers append to random postitions,
        // then spliced that position by one, so the function is forced to put answer elsewhere
        // Append the answersBtn somewhere
        questionsEl.appendChild(answersBtn);
        answers.splice(randomPosition, 1);
        // console.log(answers)
      }
      // answersEl.html(answers);
      // console.log("Answers:", answers);
      //Appends array of answers to the page
      // trivia.append(answersEl);
      // trivia.append(answers);
    });
  }
  //Pull random Chuck Norris Joke
  let getChuck = function () {
    let requestURL = "https://api.chucknorris.io/jokes/random";
    $.ajax({
      url: requestURL,
      method: "GET",
    }).then(function (data) {
      console.log(data.value);
      let trivia = $("#jokes");
      let joke = $("<h3>");
      joke.html(data.value);
      trivia.append(joke);
    });
  };
  //EVENT LISTENERS
  // $(".w3-btn").on("click", getTrivia);
  var category;
  $(".w3-btn").on("click", function () {
    switch (this.id) {
      case "art":
        category = 25;
        qCounter++
        break;
        case "music":
          category = 12;
          qCounter++
          break;
      case "sports":
        category = 21;
        qCounter++
        break;
        case "books":
          category = 10;
          qCounter++
          break;
          case "history":
            category = 23;
            qCounter++
            break;
          }
          getTrivia(category);
          localStorage.clear();
  });
  // $("#music").on("click", getTrivia);
  // $("#sports").on("click", getTrivia);
  // $("#books").on("click", getTrivia);
  // $("#history").on("click", getTrivia);
  // $("#chuck").on("click", getChuck);
  //CLICK EVENTS
  $("#home").click(function () {
    window.location.href = "./index.html"; // CHANGE TO CURRENT PAGES
  });
  $("#home-category").click(function () {
    window.location.href = "./index.html";
  });
  $("#play").click(function () {
    window.location.href = "./game.html";
  });
  $("#playAgain").click(function () {
    window.location.href = "./index.html";
  });
  //FUNCTION AND VARIABLES TO KEEP TRACK OF HIGH SCORE AND RANDOMIZE QUESTIONS/ANSWERS
  var historicalCorrect = 0; // user score
  var qCounter = 0;
  var wrongCount = 0; 
  
  
  if (localStorage.getItem("historicalCorrect")) {
    historicalCorrect = parseInt(localStorage.getItem("historicalCorrect"));
  }
  if (localStorage.getItem("wrongCount")) {
    wrongCount = parseInt(localStorage.getItem("wrongCount"));
  }
  
  function endGame(){
    // $("#questions").hide();
    window.location.href = "./highscore_win.html" 
    //show score, and play again btn
  }
  $("#questions").on("click", "button", function () {
    console.log("in function");
    // if (qCounter < 2 || wrongCount < 4) {
      if (qCounter < 11 && this.textContent == correctAnswer) {  //play the game
        var correctSound = new Audio("./assets/correct.mp3")
        correctSound.play();
        historicalCorrect += 10;
        qCounter++;
        console.log("qCounter", qCounter)
        // add set timeout button
        // console.log(qCounter);
        console.log(this.textContent)
        localStorage.setItem("historicalCorrect", historicalCorrect);
      } else if (qCounter < 11 && this.textContent !== correctAnswer && wrongCount < 2) { //This is counting but then sending user to home page immediately
        wrongCount++
        localStorage.setItem("wrongCount", wrongCount);
        qCounter++
        console.log("qCounter", qCounter)
        var whammySound = new Audio("./assets/whammy.mp3")
        $("#questions").hide(2000, function () {
          whammySound.play();
          console.log("Hide Questions");
          $("#whammies").show(3000, function () {
            console.log("show whammies");
            $("#whammies").hide();
            $("#questions").show();
          });
        });
      }else {
        console.log("Is this working?")
        endGame();
      }
      
      getTrivia(category);
  });
  // }
  //LOCAL STORAGE
  var userName = document.getElementById("username");
  userName.value = localStorage.getItem("lastUsername") || "";
  // console.log(userName)
  document
    .getElementById("highScoreForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      localStorage.setItem("lastUsername", userName.value);
      localStorage.setItem("historicalCorrect", historicalCorrect)
      getChuck();
      let winnerName = $("#winner");
      winnerName.append(userName.value + " " + historicalCorrect);
     
    });
});
