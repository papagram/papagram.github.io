phina.define('Mix', {
    superClass: 'Question',
  
    questions: [],
  
    init: function (params) {
        var additionQuestions = Addition().questions;
        var substractionQuestions = Substraction().questions;
        var multiplicationQuestions = Multiplication().questions;

        var merged = [];
        merged = additionQuestions.concat(substractionQuestions);
        this.questions = merged.concat(multiplicationQuestions);

        this.superInit(params);
    },
  });