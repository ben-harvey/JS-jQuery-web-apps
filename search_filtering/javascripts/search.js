const json = [{
  "title": "The Legend of Zelda: Majora's Mask 3D",
  "id": 1,
  "category": "Nintendo 3DS"
}, {
  "title": "Super Smash Bros.",
  "id": 2,
  "category": "Nintendo 3DS"
}, {
  "title": "Super Smash Bros.",
  "id": 3,
  "category": "Nintendo WiiU"
}, {
  "title": "LEGO Batman 3: Beyond Gotham",
  "id": 4,
  "category": "Nintendo WiiU"
}, {
  "title": "LEGO Batman 3: Beyond Gotham",
  "id": 5,
  "category": "Xbox One"
}, {
  "title": "LEGO Batman 3: Beyond Gotham",
  "id": 6,
  "category": "PlayStation 4"
}, {
  "title": "Far Cry 4",
  "id": 7,
  "category": "PlayStation 4"
}, {
  "title": "Far Cry 4",
  "id": 8,
  "category": "Xbox One"
}, {
  "title": "Call of Duty: Advanced Warfare",
  "id": 9,
  "category": "PlayStation 4"
}, {
  "title": "Call of Duty: Advanced Warfare",
  "id": 10,
  "category": "Xbox One"
}];

$(function () {
  console.log(json);

  const hideRelatedIDs = (callback) => {
    const relatedIDs = json.reduce((ids, game) => {
      if (callback(game)) { ids.push(game.id) };
      return ids;
    }, []);

    relatedIDs.forEach(id => {
      $(`li[data-id=${id}]`).toggle();
    });
  }

  $('input[type="checkbox"]').change(function (event) {
    const $target = $(this);

    const match = (game) => game.category === $target.val();

    hideRelatedIDs(match);
  });

  $('#search').submit(function (event) {
    event.preventDefault();

    const $searchString = $('#search').find('[type=search]').val().toLowerCase();
    const searchRegex = RegExp($searchString, 'gi');

    $('main li').show();

    const notAMatch = (game) => {
      game.title.toLowerCase().indexOf($searchString) === -1;
    }

    hideRelatedIDs(notAMatch);
  })
});