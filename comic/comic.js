// on load, animate
// on click of link,

$(function () {
  const $blinds = $('[id^=blind');
  const speed = 250;
  let delay = 1500;

  const animate = () => {
    $blinds.each(function (index) {
      const $blind = $blinds.eq(index);
      const currentDelay = delay * index;
      // debugger;
      const top = parseInt($blind.css('top'), 10);
      const height = parseInt($blind.css('height'), 10);
      const topTarget = top + height;

      $blind.delay(currentDelay).animate({
        top: topTarget,
        height: 0
      }, speed);
    });
  }

  const reset = () => {
    $blinds.removeAttr('style')
  };

  $('a').click(function (event) {
    event.preventDefault();
    $blinds.finish();
    reset();
    animate();

  })

  animate();
});