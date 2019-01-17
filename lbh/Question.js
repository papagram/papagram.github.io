phina.define('Question', {
    init: function (params) {
        this.shuffle();
    },
    
    shuffle: function () {
        this.questions.shuffle();
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
})