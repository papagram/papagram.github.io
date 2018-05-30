phina.globalize();

const QUESTION_TIME = 1.5 * 1000;
const ANSWER_TIME = 1.5 * 1000;

phina.define('TitleScene', {
  superClass: 'DisplayScene',

  init: function(params) {
    this.superInit(params);

    this.backgroundColor = '#93deff';

    var titleLabel = Label('四則計算暗記アプリ').addChildTo(this);
    titleLabel.setPosition(this.gridX.center(), this.gridY.center()/2);
    titleLabel.fontSize = 64;
    this.titleLabel = titleLabel;

    var startBtn = TriangleShape().addChildTo(this);
    startBtn.setPosition(this.gridX.center(), this.gridY.center()*1.5);
    startBtn.setScale(2, 2);
    startBtn.rotation = 90;
    startBtn.fill = '#606470';

    var self = this;

    this.onpointstart = function() {
      self.exit();
    };
  }
});

phina.define('MainScene', {
  superClass: 'DisplayScene',

  init: function(params) {
    this.superInit(params);

    this.backgroundColor = '#f7f7f7';

    this.questionTimer = QUESTION_TIME;
    this.answerTimer = ANSWER_TIME;

    this.count = 0;

    this.setRandomNumber();

    var self = this;

    this.onpointstart = function() {
      self.exit({
        count: this.count,
      });
    };
  },

  update: function(app) {
    this.questionTimer -= app.deltaTime;
    if (this.questionTimer <= 0) {
      this.questionLabel.remove();
      this.answerLabel.setPosition(this.gridX.center(), this.gridY.center());

      this.answerTimer -= app.deltaTime;
      if (this.answerTimer <= 0) {
        this.answerLabel.remove();

        this.questionTimer = QUESTION_TIME;
        this.answerTimer = ANSWER_TIME;

        this.setRandomNumber();
      }
    }
  },

  setRandomNumber: function() {
    var rnd1 = Random.randint(1, 9);
    var rnd2 = Random.randint(1, 9);
    var question = rnd1 + ' + ' + rnd2;
    this.answer = rnd1 + rnd2;

    var questionLabel = Label(question).addChildTo(this);
    questionLabel.setPosition(this.gridX.center(), this.gridY.center());
    questionLabel.fontSize = 128;
    this.questionLabel = questionLabel;

    var answerLabel = Label(this.answer).addChildTo(this);
    answerLabel.y = this.gridY.span(100);
    answerLabel.fontSize = 128;
    answerLabel.fill = 'red';
    this.answerLabel = answerLabel;

    var count = this.count + 1;
    this.count = count;
  }
});

phina.define('ResultScene', {
  superClass: 'DisplayScene',

  init: function(params) {
    this.superInit(params);

    this.backgroundColor = '#93deff';

    var countLabel = Label(params.count + '問').addChildTo(this);
    countLabel.setPosition(this.gridX.center(), this.gridY.center()/2);
    countLabel.fontSize = 128;
    this.countLabel = countLabel;

    var messageLabel = Label('答えました\nおつかれさま\n＼(^o^)／').addChildTo(this);
    messageLabel.setPosition(this.gridX.center(), this.gridY.center());
    messageLabel.fontSize = 64;
    this.messageLabel = messageLabel;

    var self = this;

    this.onpointstart = function() {
      self.exit();
    };
  }
});

phina.main(function() {
  var app = GameApp({
    startLabel: 'title',
    scenes: [
      {
        className: 'TitleScene',
        label: 'title',
        nextLabel: 'main',
      },
      {
        className: 'MainScene',
        label: 'main',
        nextLabel: 'result',
      },
      {
        className: 'ResultScene',
        label: 'result',
        nextLabel: 'title',
      },
    ]
  });

  app.run();
});
