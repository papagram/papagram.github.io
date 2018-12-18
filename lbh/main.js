phina.globalize();

const APP_NAME = '答えは待たない';
const QUESTION_TIME = 1.5 * 1000;
const ANSWER_TIME = 1.5 * 1000;
const ADDITION = 0;
const SUBSTRACTION = 1;
const MULTIPLICATION = 2;
const MIX = 3;
const LEVEL_1 = 1;
const LEVEL_2 = 2;
const LEVEL_TEXT_1 = 'Lv1';
const LEVEL_TEXT_2 = 'Lv2';
const BACKGROUND_COLOR = '#F2F2F2';
const COLOR_WHITE = '#ffffff';
const COLOR_BLACK = '#000000';
const COLOR_RED = '#FF3633';
const COLOR_YELLOW = '#FBFF1C';
const COLOR_ADDITION = '#F2E282';
const COLOR_SUBSTRACTION = '#C2F291';
const COLOR_MULTIPLICATION = '#91F2F2';
const COLOR_MIX = '#5C9999';
const COLOR_SELECTED = '#ffffff';
const COLOR_UNSELECTED = '#C0C0C0';
const STROKE_WIDTH = 3;
const CORNER_RADIUS = 10;
const FONT_SIZE_L = 64;
const FONT_SIZE_M = 32;
const FONT_SIZE_S = 24;

phina.define('TitleScene', {
  superClass: 'DisplayScene',

  init: function(params) {
    this.superInit(params);

    this.backgroundColor = BACKGROUND_COLOR;

    this.level = LEVEL_1;
    this.operationType = ADDITION;

    var titleLabel = Label({
      x: this.gridX.center(),
      y: this.gridY.center() / 3,
      text: APP_NAME,
      fontSize: FONT_SIZE_L,
      fill: COLOR_BLACK
    }).addChildTo(this);
    this.titleLabel = titleLabel;

    var levelBtn = Button({
      x: this.gridX.center(),
      y: this.gridY.center() / 1.75,
      width: 420,
      height: 100,
      text: LEVEL_TEXT_1,
      fontSize: FONT_SIZE_L,
      fontColor: COLOR_BLACK,
      cornerRadius: CORNER_RADIUS,
      fill: COLOR_YELLOW,
      stroke: COLOR_BLACK,
      strokeWidth: STROKE_WIDTH,
    }).addChildTo(this);

    var additionBtn = Button({
      x: this.gridX.center() - 110,
      y: this.gridY.center() / 1.15,
      width: 200,
      height: 150,
      text: '＋',
      fontSize: FONT_SIZE_L,
      fontColor: COLOR_BLACK,
      cornerRadius: CORNER_RADIUS,
      fill: COLOR_WHITE,
      stroke: COLOR_BLACK,
      strokeWidth: STROKE_WIDTH,
    }).addChildTo(this);

    var subtractionBtn = Button({
      x: this.gridX.center() + 110,
      y: this.gridY.center() / 1.15,
      width: 200,
      height: 150,
      text: 'ー',
      fontSize: FONT_SIZE_L,
      fontColor: COLOR_BLACK,
      cornerRadius: CORNER_RADIUS,
      fill: COLOR_WHITE,
      stroke: COLOR_BLACK,
      strokeWidth: STROKE_WIDTH,
    }).addChildTo(this);

    var multiplicationBtn = Button({
      x: this.gridX.center() - 110,
      y: this.gridY.center() * 1.25,
      width: 200,
      height: 150,
      text: '×',
      fontSize: FONT_SIZE_L,
      fontColor: COLOR_BLACK,
      cornerRadius: CORNER_RADIUS,
      fill: COLOR_WHITE,
      stroke: COLOR_BLACK,
      strokeWidth: STROKE_WIDTH,
    }).addChildTo(this);

    var mixBtn = Button({
      x: this.gridX.center() + 110,
      y: this.gridY.center() * 1.25,
      width: 200,
      height: 150,
      text: 'MIX',
      fontSize: FONT_SIZE_L,
      fontColor: COLOR_BLACK,
      cornerRadius: CORNER_RADIUS,
      fill: COLOR_WHITE,
      stroke: COLOR_BLACK,
      strokeWidth: STROKE_WIDTH,
    }).addChildTo(this);

    var startBtn = Button({
      x: this.gridX.center(),
      y: this.gridY.center() * 1.55,
      width: 420,
      height: 100,
      text: 'START',
      fontSize: FONT_SIZE_L,
      fontColor: COLOR_BLACK,
      cornerRadius: CORNER_RADIUS,
      fill: COLOR_WHITE,
      stroke: COLOR_BLACK,
      strokeWidth: STROKE_WIDTH,
    }).addChildTo(this);

    var self = this;

    additionBtn.onpointstart = function() {
      self.select(this, COLOR_ADDITION);

      self.unselect(subtractionBtn);
      self.unselect(multiplicationBtn);
      self.unselect(mixBtn);

      self.operationType = ADDITION;
    };

    subtractionBtn.onpointstart = function() {
      self.select(this, COLOR_SUBSTRACTION);

      self.unselect(additionBtn);
      self.unselect(multiplicationBtn);
      self.unselect(mixBtn);

      self.operationType = SUBSTRACTION;
    };

    multiplicationBtn.onpointstart = function() {
      self.select(this, COLOR_MULTIPLICATION);

      self.unselect(additionBtn);
      self.unselect(subtractionBtn);
      self.unselect(mixBtn);

      self.operationType = MULTIPLICATION;
    }

    mixBtn.onpointstart = function() {
      self.select(this, COLOR_MIX);

      self.unselect(additionBtn);
      self.unselect(subtractionBtn);
      self.unselect(multiplicationBtn);

      self.operationType = MIX;
    }

    levelBtn.onpointstart = function() {
      if (self.level === LEVEL_1) {
        self.level = LEVEL_2;
        this.text = LEVEL_TEXT_2;
        this.fill = COLOR_RED;
      } else {
        self.level = LEVEL_1;
        this.text = LEVEL_TEXT_1;
        this.fill = COLOR_YELLOW;
      }
    };

    startBtn.onpointstart = function() {
      self.exit({
        operationType: self.operationType,
        level: self.level
      });
    };
  },

  select: function(btn, fillColor) {
    btn.fill = fillColor;
  },

  unselect: function(btn) {
    btn.fill = COLOR_WHITE;
  }
});

phina.define('MainScene', {
  superClass: 'DisplayScene',

  init: function(params) {
    this.superInit(params);

    this.backgroundColor = COLOR_WHITE;

    this.questionTimer = QUESTION_TIME;
    this.answerTimer = ANSWER_TIME;

    this.count = 0;

    this.operationType = params.operationType;
    this.level = params.level;

    this.multiplication = Multiplication();

    this.setRandomNumber();

    var self = this;

    this.onpointstart = function() {
      self.exit({
        count: self.count,
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
    var min = 1;
    var max = 9;
    if (this.level === LEVEL_2 ) {
      max = 99;
    }

    if (this.operationType === ADDITION) {
      var rnd1 = Random.randint(min, max);
      var rnd2 = Random.randint(min, max);
      var question = rnd1 + ' + ' + rnd2;
      this.answer = rnd1 + rnd2;
    } else if (this.operationType === SUBSTRACTION) {
      var rnd1 = Random.randint(min, max);
      var rnd2 = Random.randint(min, rnd1);
      var question = rnd1 + ' - ' + rnd2;
      this.answer = rnd1 - rnd2;
    } else if (this.operationType === MULTIPLICATION) {
      var choice = this.multiplication.getQuestion();
      var question = choice.q;
      this.answer = choice.a;
    } else if (this.operationType === MIX) {
      var operationType = Random.randint(0, 2);

      var rnd1 = Random.randint(min, max);
      if (operationType === ADDITION) {
        var rnd2 = Random.randint(min, max);
        var question = rnd1 + ' + ' + rnd2;
        this.answer = rnd1 + rnd2;
      } else if (operationType === SUBSTRACTION) {
        var rnd2 = Random.randint(min, rnd1);
        var question = rnd1 + ' - ' + rnd2;
        this.answer = rnd1 - rnd2;
      } else if (operationType === MULTIPLICATION) {
        var rnd2 = Random.randint(min, 9);
        var question = rnd1 + ' × ' + rnd2;
        this.answer = rnd1 * rnd2;
      }
    }

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

    this.backgroundColor = BACKGROUND_COLOR;

    var countLabel = Label(params.count + '問').addChildTo(this);
    countLabel.setPosition(this.gridX.center(), this.gridY.center() / 2);
    countLabel.fontSize = 128;
    this.countLabel = countLabel;

    var messageLabel = Label('答えました\nおつかれさま\n\n＼(^o^)／\n\n何問先に\n答えられたかな？').addChildTo(this);
    messageLabel.setPosition(this.gridX.center(), this.gridY.center() + 100);
    messageLabel.fontSize = 64;
    this.messageLabel = messageLabel;

    var self = this;

    this.onpointstart = function() {
      self.exit();
    };
  }
});

phina.define('Multiplication', {
  init: function () {
    this.questions = [
      { q: '1 × 1', a: 1 }, { q: '1 × 2', a: 2 }, { q: '1 × 3', a: 3 },
      { q: '1 × 4', a: 4 }, { q: '1 × 5', a: 5 }, { q: '1 × 6', a: 6 },
      { q: '1 × 7', a: 7 }, { q: '1 × 8', a: 8 }, { q: '1 × 9', a: 9 },
      { q: '2 × 1', a: 2 }, { q: '2 × 2', a: 4 }, { q: '2 × 3', a: 6 },
      { q: '2 × 4', a: 8 }, { q: '2 × 5', a: 10 }, { q: '2 × 6', a: 12 },
      { q: '2 × 7', a: 14 }, { q: '2 × 8', a: 16 }, { q: '2 × 9', a: 18 },
      { q: '3 × 1', a: 3 }, { q: '3 × 2', a: 6 }, { q: '3 × 3', a: 9 },
      { q: '3 × 4', a: 12 }, { q: '3 × 5', a: 15 }, { q: '3 × 6', a: 18 },
      { q: '3 × 7', a: 21 }, { q: '3 × 8', a: 24 }, { q: '3 × 9', a: 27 },
      { q: '4 × 1', a: 4 }, { q: '4 × 2', a: 8 }, { q: '4 × 3', a: 12 },
      { q: '4 × 4', a: 16 }, { q: '4 × 5', a: 20 }, { q: '4 × 6', a: 24 },
      { q: '4 × 7', a: 28 }, { q: '4 × 8', a: 32 }, { q: '4 × 9', a: 36 },
      { q: '5 × 1', a: 5 }, { q: '5 × 2', a: 10 }, { q: '5 × 3', a: 15 },
      { q: '5 × 4', a: 20 }, { q: '5 × 5', a: 25 }, { q: '5 × 6', a: 30 },
      { q: '5 × 7', a: 35 }, { q: '5 × 8', a: 40 }, { q: '5 × 9', a: 45 },
      { q: '6 × 1', a: 6 }, { q: '6 × 2', a: 12 }, { q: '6 × 3', a: 18 },
      { q: '6 × 4', a: 24 }, { q: '6 × 5', a: 30 }, { q: '6 × 6', a: 36 },
      { q: '6 × 7', a: 42 }, { q: '6 × 8', a: 48 }, { q: '6 × 9', a: 54 },
      { q: '7 × 1', a: 7 }, { q: '7 × 2', a: 14 }, { q: '7 × 3', a: 21 },
      { q: '7 × 4', a: 28 }, { q: '7 × 5', a: 35 }, { q: '7 × 6', a: 42 },
      { q: '7 × 7', a: 49 }, { q: '7 × 8', a: 56 }, { q: '7 × 9', a: 63 },
      { q: '8 × 1', a: 8 }, { q: '8 × 2', a: 16 }, { q: '8 × 3', a: 24 },
      { q: '8 × 4', a: 32 }, { q: '8 × 5', a: 40 }, { q: '8 × 6', a: 48 },
      { q: '8 × 7', a: 56 }, { q: '8 × 8', a: 64 }, { q: '8 × 9', a: 72 },
      { q: '9 × 1', a: 9 }, { q: '9 × 2', a: 18 }, { q: '9 × 3', a: 27 },
      { q: '9 × 4', a: 36 }, { q: '9 × 5', a: 45 }, { q: '9 × 6', a: 54 },
      { q: '9 × 7', a: 63 }, { q: '9 × 8', a: 72 }, { q: '9 × 9', a: 81 },
    ];

    this.shuffle();
  },

  shuffle: function () {
    for (i = this.questions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = this.questions[i];
      this.questions[i] = this.questions[j];
      this.questions[j] = tmp;
    }

    this.pointer = 0;
    this.needShuffle = false;
  },

  getQuestion: function () {
    if (this.needShuffle) {
      this.shuffle();
    }

    var question = this.questions[this.pointer];

    this.next();

    return question;
  },

  next: function () {
    this.pointer++;

    if ((this.pointer % this.questions.length) === 0) {
      this.needShuffle = true;
    }
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
