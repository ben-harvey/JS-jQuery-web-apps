$(function () {
  const $canvas = $('#canvas');

  const consolidateObject = (objArray) => {
    return objArray.reduce((consolidated, current) => {
      consolidated[current.name] = current.value;
      return consolidated;
    }, {});
  };

  const reset = (shape) => {
    const data = shape.data();

    shape.css({
      "top": +data.start_y,
      "left": +data.start_x,
    });
  };

  const animate = (shape) => {
    const data = shape.data();

    shape.animate({
      "top": +data.end_y,
      "left": +data.end_x,
    }, +data.duration);
  };

  const initializeShape = (formValues) => {
    const $shapeDiv = $('<div>');

    $shapeDiv.data(formValues);

    $shapeDiv.css({
      "top": +formValues.start_y,
      "left": +formValues.start_x,
    });

    switch (formValues.shape_type) {
      case "circle":
        $shapeDiv.addClass("circle");
        break
      case "star":
        $shapeDiv.addClass("star");
        break;
      };

    return $shapeDiv;
  };

//----- Listeners

  $('form').submit(function (event) {
    event.preventDefault();

    const $target = $(this);
    const $formValues = consolidateObject($target.serializeArray());
    const shapeDiv = initializeShape($formValues);

    $canvas.append(shapeDiv);
  });

  $('#animate').click(function (event) {
    event.preventDefault();
    const $shapes = $('#canvas > div');

    $shapes.stop();

    $shapes.each(function (index) {
      const $shape = $shapes.eq(index);

      reset($shape);
      animate($shape);
    });
  });

  $('#stop').click(function (event) {
    event.preventDefault();
    const $shapes = $('#canvas > div');

    $shapes.stop();
  })
});
