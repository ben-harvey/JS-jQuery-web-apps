$(function () {
  const templates = {};
  let photos;

  renderTemplatesAndPartials();

  const slideshow = {
    $slideshow: $('#slideshow'),

    duration: 500,

    prev: function (event) {
      event.preventDefault();

      $current = this.$slideshow.find('figure:visible');
      $previous = $current.prev();
      if ($previous.length === 0) { $previous = $current.siblings().last() }
      this.changeSlide($current, $previous);
    },

    next: function () {
      event.preventDefault();

      $current = this.$slideshow.find('figure:visible');
      $next = $current.next();
      if ($next.length === 0) { $next = $current.siblings().first() }
      this.changeSlide($current, $next);
    },

    changeSlide: function ($current, $new) {
      const newId = $new.data().id;

      $current.fadeOut(this.duration);
      $new.fadeIn(this.duration);

      renderPhotoInfo(newId);
      renderComments(newId);
    },

    bind: function () {
      this.$slideshow.on('click', 'a.prev', this.prev.bind(this));
      this.$slideshow.on('click', 'a.next', this.next.bind(this));
    },

    init: function () {
      this.bind();
    },
  }

 $.ajax({      // main page load engine
    url: 'http://localhost:3000/photos',
    success: function (json) {
      photos = json;
      renderPhotos();
      const firstId = photos[0].id;
      renderPhotoInfo(firstId);
      renderComments(firstId);
      slideshow.init();
    }
  });

 $('section > header').on('click', '.actions a', function (event) {
   event.preventDefault();

   var $target = $(event.target);
   const id = $target.data().id;
   const action = $target.data().action;

   $.ajax({
    url: `http://localhost:3000/photos/${action}` ,
    data: {photo_id: id},
    method: "POST",
    success: function (json) {
          // debugger;
        $target.text((_, oldText) => oldText.replace(/\d+/, json.total))
    }
   });
 });

 function renderTemplatesAndPartials () {
  templates['photos'] = Handlebars.compile($('#photos').html());
  templates['photoInfo'] = Handlebars.compile($('#photo_information').html());
  templates['comments'] = Handlebars.compile($('script#comments').html());
  Handlebars.registerPartial('comment', $('#comment').html());
 }

  function renderPhotos () {
    const renderedPhotos = templates.photos({ photos: photos });
    $('#slides').append($(renderedPhotos));
  };

  function renderPhotoInfo (id) {
    const photo = getPhotoById(id);
    const renderedPhotoInfo = templates.photoInfo(photo);
    $('section > header').html($(renderedPhotoInfo));
  };

  function renderComments (id) {
    $.ajax({
      url: 'http://localhost:3000/comments',
      data: { photo_id: id },
      success: function (commentsJson) {
        const renderedComments = templates.comments({ comments: commentsJson });
        $('#comments > ul').html(renderedComments);
      },
    });
  };

  function getPhotoById (id) {
    return photos.filter(photo => photo.id === id)[0];
  };

});

