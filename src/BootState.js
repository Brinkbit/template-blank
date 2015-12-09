/* global EndlessJumper, Phaser */

'use strict';

window.EndlessJumper = {

    constants: {
        PLAYER_LIVES: 3,

        SPEED: 1,
        PLAYER_UP_VEL_MAX: 550,
        PLAYER_DOWN_VEL_MAX: 800,
        PLAYER_ACCELERATION: 60,
        PLAYER_GRAVITY: 40,

        SPAWN_ENEMY_DELAY: Phaser.Timer.SECOND * 0.1,
        ENEMY_MIN_X_VELOCITY: -750,
        ENEMY_MAX_X_VELOCITY: -750,
        ENEMY_HEALTH: 1,
        ENEMY_START_COUNT: 5,

        SPAWN_REWARD_DELAY: Phaser.Timer.SECOND * 1,
        REWARD_MIN_X_VELOCITY: -300,
        REWARD_MAX_X_VELOCITY: -450,
        REWARD_HEALTH: 1
    }

};

EndlessJumper.BootState = function BootState() {

};

EndlessJumper.BootState.prototype = {

    init: function init() {
        // Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        // this.stage.disableVisibilityChange = true;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setShowAll();
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize( true );
        this.scale.refresh();
        this.game.stage.backgroundColor = '#000000';
    },

    preload: function preload() {
        // Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.atlas( 'preloader', 'preloader.png', 'preloader.json' );
    },

    create: function create() {
        // By this point the preloader assets have loaded to the cache, we've set the game settings
        // So now let's start the real preloader going
        this.state.start( 'Preloader' );
    }

};
