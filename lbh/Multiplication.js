phina.define('Multiplication', {
  superClass: 'Question',

  init: function (params) {
    var questions = [];
    var end = 10;

    if (params.level === LEVEL_2) {
        end = 100;
    }
    
    [].range(1, end).each(function (number1) {
        [].range(1, end).each(function (number2) {
            questions.push({ q: number1 + ' × ' + number2, a: number1 * number2 });
        });
    });

    this.questions = questions;

    this.superInit(params);
  },
});