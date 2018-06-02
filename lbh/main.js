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
      var rnd1 = Random.randint(min, max);
      var rnd2 = Random.randint(min, 9);
      var question = rnd1 + ' × ' + rnd2;
      this.answer = rnd1 * rnd2;
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
