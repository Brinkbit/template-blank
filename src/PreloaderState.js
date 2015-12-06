/* global EndlessJumper */

'use strict';

EndlessJumper.PreloaderState = function PreloaderState() {

};

EndlessJumper.PreloaderState.prototype = {

    preload: function preload() {
        // setup the loader image that was loaded in Boot.js
        var background = this.add.sprite( 0, 0, 'preloader', 'preloader_background.jpg' );
        var preloadBar = this.add.sprite( 0, 0, 'preloader', 'preloader_bar.png' );
        preloadBar.x = this.game.width * 0.5 - ( preloadBar.width * 0.5 );
        preloadBar.y = this.game.height * 0.5 - ( preloadBar.height * 0.5 );

        // this sets the preloadBar sprite as a loader sprite.
        // what that does is automatically crop the sprite from 0 to full-width
        // as the files below are loaded in.
        this.load.setPreloadSprite( preloadBar );

        // here we load the rest of the assets our game needs.
        this.load.atlas( 'ta0', 'ta0.png', 'ta0.json' );
        this.load.atlas( 'flappy0', 'flappy0.png', 'flappy0.json' );
        this.load.bitmapFont( 'archery', 'silkscreen.png', 'silkscreen.xml' );
        this.load.image( 'background', 'background.png' );
        this.load.image( 'sideline', 'sideline.png' );
        this.load.image( 'sideline2', 'sideline2.png' );
        this.load.image( 'killzone', 'killzone.png' );
        this.load.spritesheet( 'explosion', 'explosion.png', 224, 152 );
        this.load.spritesheet( 'fireball', 'fireball.png', 160, 68 );
        this.load.spritesheet( 'halo', 'halo.png', 500, 500 );
        this.load.spritesheet( 'player', 'player.png', 140, 176 );
        this.load.spritesheet( 'powerup1', ' powerup1.png', 76, 80 );
    },

    create: function create() {
        this.state.start( 'MainMenu' );
    }

};
