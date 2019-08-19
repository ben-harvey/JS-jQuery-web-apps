$(function () {
  const $guessDiv = $('#guesses');
  const $spaceDiv = $('#spaces');
  const $message = $('#message');

  const randomWord = (function () {
        words = ['tree', 'log'];

        return function () {
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];
        words.splice(randomIndex, 1);

        return word;
      }
  })();

  const Game = {
    totalGuesses: 6,

    createSpaces: function () {
      for (let i = 0; i < this.word.length; i++) {
        $spaceDiv.append('<span>');
      };
    },

    matchingIndexes: (letter, word) => {
      let arr;
      const regex = new RegExp(letter, 'g')
      const indexes = [];

      while ((arr = regex.exec(word)) !== null) {
        indexes.push(regex.lastIndex - 1);
      };
      return indexes;
    },

    bind: function () {
      $(document).on('keypress', this.handleGuess.bind(this));
    },

    unbind: function () {
      $('document').unbind('keypress');
    },

    handleGuess: function (event) {
      const letter =  event.key.toLowerCase();
      const $spaces = $spaceDiv.children('span');

      if (!/[a-z]/.test(letter) || this.guessedLetters.includes(letter)) { return };

      this.guessedLetters.push(letter);
      $guessDiv.append($('<span>').text(letter));

      if (this.word.indexOf(letter) !== -1) { // correct guess
        const indexes = this.matchingIndexes(letter, this.word);
        this.correctGuesses += indexes.length;


        indexes.forEach(index => {
          $spaces.eq(index).text(letter);
        });
      } else { // incorrect guess

        this.incorrectGuesses += 1;
        $('#apples').addClass(`guess_${this.incorrectGuesses}`)
      };


      if (this.correctGuesses === this.word.length) {
        this.unbind();
        $message.text("You guessed the word!");
        $('#replay').show();
        $('document.body').removeClass()
        $('document.body').addClass('win');
      };


      if (this.incorrectGuesses === this.totalGuesses) {
        this.unbind();
        $message.text("Sorry, you're out of guesses!");
        $('#replay').show();
        $('document.body').removeClass()
        $('document.body').addClass('lose');
      };
    },

    resetUI: function () {
      $('#replay').hide();
      $message.text('')
      $guessDiv.children('span').remove();
      $spaceDiv.children('span').remove();
      $('#apples').removeClass();
    },

    init: function () {
        this.word = randomWord();
        this.incorrectGuesses = 0;
        // debugger;
        this.correctGuesses = 0;
        this.guessedLetters = [];

        if (!this.word) {
          $message.text("You guessed all the words. Thanks for playing!");
        } else {
          this.resetUI();
          this.createSpaces();
          this.bind();
        }

         return this;
      },
  };

  // let game = Object.create(Game).init();
  Object.create(Game).init();

  $('#replay').click(function (event) {
    event.preventDefault();

    Object.create(Game).init();
  });
});



