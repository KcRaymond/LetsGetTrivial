$(document).ready(function () {
  //FUNCTIONS

  let questionsEl = document.getElementById("questions");
  var correctAnswer = "";

  $("#whammies").hide();
  $("#whammies-2").hide();
  $("#whammies-3").hide();
  $("#whammies-4").hide();

  //Pull Trivia questions and answers based on category selected by player
  function getTrivia(category) {
    //Clear the div before displaying the next question/answer set
    $("#questions").empty();
    let requestURL =
      "https://opentdb.com/api.php?amount=15&category=" +
      category +
      "&type=multiple";
    // console.log("URL:", requestURL);
    $.ajax({
      url: requestURL,
      method: "GET",
    }).then(function (data) {
      // console.log("Data: ", data);

      //VARIABLE DECLARATIONS
      //dynamically create div where the HTML will be placed
      let trivia = $("#questions");
      let question = $("<h3>");
      let answers = [];
      let randomIndex = Math.floor(Math.random() * 15);
      // console.log(randomIndex);
      question.html(data.results[randomIndex].question);
      // console.log("Question:", data.results[randomIndex].question);
      trivia.append(question);
      //build array for answers including both incorrect and correct answers
      correctAnswer = data.results[randomIndex].correct_answer;
      // console.log("this is a correct answer", correctAnswer);
      let incorrectAnswers = data.results[randomIndex].incorrect_answers;
      // answers = answers.concat(incorrectAnswers);
      answers = [correctAnswer, ...incorrectAnswers];
      //loop through answers
      for (let i = 0; i < 4; i++) {
        let randomPosition = Math.floor(Math.random() * answers.length);
        let answersBtn = document.createElement("button");
        answersBtn.setAttribute("class", "w3-btn");
        answersBtn.setAttribute("id", i);
        answersBtn.innerHTML = answers[randomPosition];
        //added a random position variable so the answers append to random positions, then spliced that position by one, so the function is forced to put answer elsewhere
        // Append the answersBtn somewhere
        questionsEl.appendChild(answersBtn);
        answers.splice(randomPosition, 1);
        // console.log(answers)
      }
    });
  }
  //Pull random Chuck Norris Joke
  let getChuck = function () {
    let requestURL = "https://api.chucknorris.io/jokes/random";
    $.ajax({
      url: requestURL,
      method: "GET",
    }).then(function (data) {
      // console.log(data.value);
      let trivia = $("#jokes");
      let joke = $("<h3>");
      joke.html(data.value);
      trivia.append(joke);
    });
  };

  //EVENT LISTENERS

  var category;
  $(".w3-btn").on("click", function () {
    switch (this.id) {
      case "art":
        category = 25;
        qCounter++;
        break;
      case "music":
        category = 12;
        qCounter++;
        break;
      case "sports":
        category = 21;
        qCounter++;
        break;
      case "books":
        category = 10;
        qCounter++;
        break;
      case "history":
        category = 23;
        qCounter++;
        break;
    }
    getTrivia(category);
    //clear local storage before the game begins
    localStorage.clear();
  });

  //CLICK EVENTS
  // CHANGE TO CURRENT PAGES
  $("#home").click(function () {
    window.location.href = "./index.html";
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
  // user score
  var historicalCorrect = 0;
  //question counter
  var qCounter = 0;
  //wrong answer score
  var wrongCount = 0;

  //local storage for score of correct answers
  if (localStorage.getItem("historicalCorrect")) {
    historicalCorrect = parseInt(localStorage.getItem("historicalCorrect"));
  }
  //local storage for score of wrong answers
  if (localStorage.getItem("wrongCount")) {
    wrongCount = parseInt(localStorage.getItem("wrongCount"));
  }

  function endGame() {
    //Take player to the End Game page
    window.location.href = "./highscore_win.html";
  }
  $("#questions").on("click", "button", function () {
    // console.log("in function");

    //play the game
    //conditional if answer is correct
    if (qCounter < 11 && this.textContent == correctAnswer) {
      var correctSound = new Audio("./assets/correct.mp3");
      correctSound.play();
      historicalCorrect += 10;
      qCounter++;
      // console.log("qCounter", qCounter);

      // console.log(qCounter);
      // console.log(this.textContent);
      localStorage.setItem("historicalCorrect", historicalCorrect);

      //conditional if answer is wrong
    } else if (
      qCounter < 11 &&
      this.textContent !== correctAnswer &&
      wrongCount < 4
    ) {
      //This is counting but then sending user to home page immediately
      wrongCount++;
      localStorage.setItem("wrongCount", wrongCount);
      qCounter++;
      // console.log("qCounter", qCounter);
      var whammySound = new Audio("./assets/whammy.mp3");
      $("#questions").hide(2000, function () {
        whammySound.play();
        // console.log("Hide Questions");

        if (wrongCount === 1) {
          $("#whammies").show(3000, function () {
            // console.log("show whammies");
            $("#whammies").hide();
            $("#questions").show();
          });
        } else if (wrongCount === 2) {
          $("#whammies-2").show(3000, function () {
            // console.log("show whammies");
            $("#whammies-2").hide();
            $("#questions").show();
          });
        } else if (wrongCount === 3) {
          $("#whammies-3").show(3000, function () {
            // console.log("show whammies");
            $("#whammies-3").hide();
            $("#questions").show();
          });
        } else {
          endGame();
        }
      });
      //condition to end the game
    } else {
      // console.log("Is this working?")
      endGame();
    }

    getTrivia(category);
  });

  //LOCAL STORAGE for username and score
  var userName = document.getElementById("username");
  userName.value = localStorage.getItem("lastUsername") || "";
  // console.log(userName)
  document
    .getElementById("highScoreForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      localStorage.setItem("lastUsername", userName.value);
      localStorage.setItem("historicalCorrect", historicalCorrect);
      getChuck();
      let winnerName = $("#winner");
      winnerName.append(userName.value + " " + historicalCorrect);
    });
});