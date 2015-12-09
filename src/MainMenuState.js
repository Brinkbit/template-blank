/* global EndlessJumper, store */

'use strict';

EndlessJumper.MainMenuState = function MainMenuState() {

};

EndlessJumper.MainMenuState.prototype = {

    preload: function preload() {
        // preload your stuff here
    },

    create: function create() {
        // create your stuff here
        this.add.sprite( 0, 0, 'flappy0', 'FlappyGoat_Assets_Title_screen.png' );

        var aboutBtn = this.add.button( 0, 0, 'flappy0', this.clickAbout, this, 'FlappyGoat_Assets_About_hover.png', 'FlappyGoat_Assets_About_neutral.png', 'FlappyGoat_Assets_About_pressed.png', 'FlappyGoat_Assets_About_neutral.png' );
        aboutBtn.x = this.game.width - aboutBtn.width + 90;
        aboutBtn.y = this.game.height * 0.5 + 30;
        var aboutBtnLabel = this.game.add.bitmapText( 0, 0, 'archery', 'ABOUT', 70 );
        aboutBtnLabel.x = aboutBtn.x + 70;
        aboutBtnLabel.y = aboutBtn.y + 30;

        var startBtn = this.add.button( 0, 0, 'flappy0', this.clickStart, this, 'FlappyGoat_Assets_About_hover.png', 'FlappyGoat_Assets_About_neutral.png', 'FlappyGoat_Assets_About_pressed.png', 'FlappyGoat_Assets_About_neutral.png' );
        startBtn.x = this.game.width - aboutBtn.width;
        startBtn.y = aboutBtn.y + aboutBtn.height + 50;
        var startBtnLabel = this.game.add.bitmapText( 0, 0, 'archery', 'START', 70 );
        startBtnLabel.x = startBtn.x + 110;
        startBtnLabel.y = startBtn.y + 30;

        var appleScoreIcon = this.add.sprite( 5, 8, 'flappy0', 'FlappyGoat_Assets_Apple.png' );
        appleScoreIcon.scale.set( 0.5, 0.5 );

        var scoreText = this.game.add.bitmapText( 50, 0, 'archery', '0', 70 );

        if ( !store.enabled ) alert( 'HIGH SCORE not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.' ); // eslint-disable-line no-alert
        else if ( store.get( 'HIGH_SCORE' )) scoreText.setText( String( store.get( 'HIGH_SCORE' )));
        else scoreText.setText( '0' );
    },

    clickStart: function clickStart() {
        this.game.state.start( 'Game' );
    },

    clickAbout: function clickAbout() {
        this.game.state.start( 'About' );
    },

    update: function update() {
        // do some nice funky main menu stuff here
    }

};
