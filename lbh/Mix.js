phina.define('Mix', {
    superClass: 'Question',
  
    questions: [],
  
    init: function (params) {
        var additionQuestions = Addition(params).questions;
        var substractionQuestions = Substraction(params).questions;
        var multiplicationQuestions = Multiplication(params).questions;

        var merged = [];
        merged = additionQuestions.concat(substractionQuestions);
        this.questions = merged.concat(multiplicationQuestions);

        this.superInit(params);
    },
  });