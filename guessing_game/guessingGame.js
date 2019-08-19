document.addEventListener('DOMContentLoaded', function () {
  let answer;
  let numberOfGuesses;

  const form = document.querySelector('form');
  const input = document.querySelector('#guess');
  const messageElement = document.querySelector('#message');
  const newGameLink = document.querySelector('a');
  const guessButton = document.querySelector('#guess-button')

  function newGame() {
    answer = Math.floor(Math.random() * 100) + 1;
    // answer = 50;
    numberOfGuesses = 0;
    messageElement.textContent = 'Guess a number between 1 and 100';
    input.value = '';
    guessButton.disabled = false
  }

  function validGuess(guess) {
    return Number.isInteger(guess) && (guess >= 1 && guess <= 100);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    let message;

    const guess = +input.value
    console.log(guess);
    if (!validGuess(guess)) {
      message = 'Sorry, that guess is not valid'
    } else {
      numberOfGuesses += 1;

      if (guess > answer) {
        message = `My number is lower than ${guess}`
      } else if (guess < answer) {
        message = `My number is greater than ${guess}`
      } else if (guess === answer) {
       message = `You guessed it! It took you ${numberOfGuesses} guesses`
       guessButton.disabled = true;
       guessButton.classList.toggle('disabled');

      };
    }

    messageElement.textContent = message;
  });

  newGameLink.addEventListener('click', function (event) {
    event.preventDefault();
    newGame();
  });

  newGame();
});