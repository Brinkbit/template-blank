/* global EndlessJumper */

'use strict';

EndlessJumper.About = function About() {

};

EndlessJumper.About.prototype = {

    preload: function preload() {
        // preload your stuff here
    },

    create: function create() {
        // create your stuff here
        this.add.sprite( 0, 0, 'ta0', 'assets1_bg.png' );
        var backBtn = this.add.button( 0, 0, 'ta0', this.clickBack, this, 'assets1_btn_back.png', 'assets1_btn_back.png', 'assets1_btn_back.png' );
        backBtn.x = 15;
        backBtn.y = 15;
    },

    clickBack: function clickBack() {
        this.game.state.start( 'MainMenu' );
    },

    update: function update() {
        // do some nice funky about stuff here
    }

};
