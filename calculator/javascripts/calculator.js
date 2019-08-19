// A jQuery event to handle form submission.
// When the form is submitted, convert the number input values from strings to numbers and store them
// in variables.
// Store the operator select box's value.
// Write conditional statements to perform an appropriate operation based on the selected operator.
// Output the result of the calculation.

$(function () {
  $result = $('h1');


  $('form').submit(function (event) {
    event.preventDefault();

    $first = +$('#first').val();
    $second = +$('#second').val();
    $operator = $('#operator').val();

    switch ($operator) {
      case '+':
        $result.text(`${$first + $second}`)
        break;
      case '-':
        $result.text(`${$first - $second}`)
        break;
      case '*':
        $result.text(`${$first * $second}`)
        break;
      case '/':
        $result.text(`${$first / $second}`)
        break;
    }

    console.log($first, $second, $operator);
  })
})

obj_1 = {a: 1, b: 2}
obj_2 = {c: 3, d: 4}

const arr = [obj_1, obj_2]
