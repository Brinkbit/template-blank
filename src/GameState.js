/* global EndlessJumper, Phaser, store */

'use strict';

EndlessJumper.GameState = function GameState() {

};

EndlessJumper.GameState.prototype = {

    preload: function preload() {
        if ( store.enabled ) {
            if ( store.get( 'HIGH_SCORE' )) EndlessJumper.constants.CURRENT_HIGH_SCORE = store.get( 'HIGH_SCORE' );
            else this.CURRENT_HIGH_SCORE = 0;
        }
        else EndlessJumper.constants.CURRENT_HIGH_SCORE = 0;

        EndlessJumper.constants.alreadyShownNewRecord = false;
    },

    create: function create() {
        this.add.tileSprite( 0, 0, this.game.width, this.game.height, 'background' ).autoScroll( -400, 0 );
        this.add.tileSprite( 0, 0, this.game.width, this.game.height, 'sideline' ).autoScroll( -600, 0 );

        this.score = 0;
        this.enemyCount = EndlessJumper.constants.ENEMY_START_COUNT;
        this.difficultyIncrement = 0;
        this.lives = EndlessJumper.constants.PLAYER_LIVES;

        this.setupRewards();
        this.setupHalos();
        this.setupPlayer();
        this.setupEnemies();
        this.setupSideline2();
        this.setupExplosions();
        this.setupScoreText();
        this.setupKillzone();

        // setup key listen
        this.spaceKey = this.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
    },

    render: function render() {
        // this.game.debug.body(this.bullet);
        // this.enemyPool.forEach(function( enemy ) {
        //     this.game.debug.body( enemy );
        // }.bind( this ));
        // this.game.debug.body(this.player);
        // this.game.debug.body(this.boss);
    },

    update: function update() {
        this.processPlayerInput();
        this.spawnEnemies();
        this.spawnRewards();
        this.checkCollisions();
        if ( this.haloPool ) {
            this.haloPool.forEach( function updateHalo( halo ) {
                halo.angle += 5;
                halo.x = this.player.x;
                halo.y = this.player.y;
                halo.scale.x += 0.07;
                halo.scale.y += 0.07;
                halo.alpha -= 0.015;
                halo.alpha = Math.max( halo.alpha, 0 );
            }.bind( this ));
        }
    },

    setupPlayer: function setupPlayer() {
        this.player = this.add.sprite( this.game.width / 4, this.game.height / 4, 'player' );
        this.player.animations.add( 'fly', [ 0, 1, 2, 1 ], 3, true );
        this.player.anchor.setTo( 0.5, 0.5 );
        this.player.animations.add( 'ghost', [ 3, 3, 2, 2 ], 5, true );
        this.player.play( 'fly' );
        this.player.scale.set( 1, 1 );

        this.physics.enable( this.player, Phaser.Physics.ARCADE );
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize( 24, 24, 52, -64 );
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;
        this.player.anchor.setTo( 0.5, 0.5 );
    },

    setupExplosions: function setupExplosions() {
        this.explosionPool = this.add.group();
        this.explosionPool.createMultiple( 3, 'explosion' );
        this.explosionPool.setAll( 'anchor.x', 0.5 );
        this.explosionPool.setAll( 'anchor.y', 0.5 );
        this.explosionPool.setAll( 'outOfBoundsKill', true );
        this.explosionPool.setAll( 'checkWorldBounds', true );

        this.explosionPool.forEach( function setupExplosion( explosion ) {
            var explodeAnim = explosion.animations.add( 'boom', [0, 1, 2, 3, 4, 5], 10, false, true );
            explodeAnim.killOnComplete = true;
        });
    },

    setupHalos: function setupHalos() {
        this.haloPool = this.add.group();
        this.haloPool.createMultiple( 3, 'halo' );
        this.haloPool.setAll( 'anchor.x', 0.5 );
        this.haloPool.setAll( 'anchor.y', 0.5 );

        this.haloPool.forEach( function setupHalo( halo ) {
            var glowAnim = halo.animations.add( 'glow', [ 0 ], 1, false );
            glowAnim.killOnComplete = true;
        });
    },

    setupKillzone: function setupKillzone() {
        this.killzoneTop = this.add.sprite( 0, 1, 'killzone' );
        this.killzoneTop.enableBody = true;
        this.physics.enable( this.killzoneTop, Phaser.Physics.ARCADE );

        this.killzoneBottom = this.add.sprite( 0, this.game.height - 1, 'killzone' );
        this.killzoneBottom.enableBody = true;
        this.physics.enable( this.killzoneBottom, Phaser.Physics.ARCADE );
    },

    setupEnemies: function setupEnemies() {
        this.enemyPool = this.add.group();
        this.enemyPool.enableBody = true;
        this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyPool.createMultiple( this.enemyCount, 'fireball' );
        this.enemyPool.setAll( 'anchor.x', 0 );
        this.enemyPool.setAll( 'anchor.y', 0 );
        this.enemyPool.setAll( 'outOfBoundsKill', true );
        this.enemyPool.setAll( 'checkWorldBounds', true );
        this.nextEnemyAt = 0;
        this.enemyDelay = EndlessJumper.constants.SPAWN_ENEMY_DELAY;

        this.enemyPool.forEach( function setupEnemy( enemy ) {
            enemy.body.setSize( 48, 48, 8, 8 );
            enemy.animations.add( 'fly', [ 0, 1, 2 ], 4, true );
            enemy.animations.add( 'hit', [ 3, 4 ], 4, false );
            enemy.events.onAnimationComplete.add( function animationComplete( e ) {
                e.play( 'fly' );
            }, this );
        });
    },

    setupRewards: function setupRewards() {
        this.rewardPool = this.add.group();
        this.rewardPool.enableBody = true;
        this.rewardPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.rewardPool.createMultiple( 4, 'powerup1' );
        this.rewardPool.setAll( 'anchor.x', 0.5 );
        this.rewardPool.setAll( 'anchor.y', 0.5 );
        this.rewardPool.setAll( 'outOfBoundsKill', true );
        this.rewardPool.setAll( 'checkWorldBounds', true );
        this.nextRewardAt = 0;
        this.rewardDelay = EndlessJumper.constants.SPAWN_REWARD_DELAY;
        this.rewardPool.forEach( function setupReward( reward ) {
            reward.animations.add( 'fly', [ 0, 1, 2, 1 ], 4, true );
            reward.animations.add( 'hit', [ 3, 4 ], 4, false );
            reward.events.onAnimationComplete.add( function animationComplete( e ) {
                e.play( 'fly' );
            }, this );
        });
    },

    setupSideline2: function setupSideline2() {
        this.city2 = this.add.tileSprite( 0, 0, this.game.width, this.game.height, 'sideline2' );
        this.city2.autoScroll( -900, 0 );
    },

    setupScoreText: function setupScoreText() {
        var rewardScoreIcon = this.add.sprite( 5, 8, 'powerup1' );
        rewardScoreIcon.scale.set( 0.5, 0.5 );
        this.scoreText = this.game.add.bitmapText( 50, 10, 'archery', String( this.score ), 40 );
        this.livesText = this.game.add.bitmapText( this.game.width - 200, 10, 'archery', 'LIVES: ' + ( this.lives ), 40 );
    },

    spawnEnemies: function spawnEnemies() {
        if ( this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0 ) {
            this.nextEnemyAt = this.time.now + this.enemyDelay;
            var enemy = this.enemyPool.getFirstExists( false );
            enemy.name = 'enemy';

            // set spawn location
            enemy.reset(
                this.game.width + 100, this.rnd.integerInRange( 0, this.game.height ),
                EndlessJumper.constants.ENEMY_HEALTH
            );

            // set speed
            enemy.body.velocity.x = this.rnd.integerInRange(
                EndlessJumper.constants.ENEMY_MIN_X_VELOCITY,
                EndlessJumper.constants.ENEMY_MAX_X_VELOCITY
            );
            enemy.play( 'fly' );
        }
    },

    spawnRewards: function spawnRewards() {
        if ( this.nextRewardAt < this.time.now && this.rewardPool.countDead() > 0 ) {
            this.nextRewardAt = this.time.now + this.rewardDelay;
            var reward = this.rewardPool.getFirstExists( false );
            reward.name = 'reward';

            // set spawn location
            reward.reset(
                this.game.width + 100, this.rnd.integerInRange( 100, this.game.height - 100 ),
                EndlessJumper.constants.REWARD_HEALTH
            );

            // reward.frameName = 'reward';
            // set speed
            reward.body.velocity.x = this.rnd.integerInRange(
                EndlessJumper.constants.REWARD_MIN_X_VELOCITY,
                EndlessJumper.constants.REWARD_MAX_X_VELOCITY
            );
            reward.play( 'fly' );
        }
    },

    processPlayerInput: function processPlayerInput() {
        if ( this.game.input.activePointer.isDown || this.spaceKey.isDown ) {
            this.player.body.velocity.y -= EndlessJumper.constants.PLAYER_ACCELERATION;
            this.player.body.velocity.y = Math.max( this.player.body.velocity.y, -EndlessJumper.constants.PLAYER_UP_VEL_MAX );
        }
        else {
            this.player.body.velocity.y += EndlessJumper.constants.PLAYER_GRAVITY;
            this.player.body.velocity.y = Math.min( this.player.body.velocity.y, EndlessJumper.constants.PLAYER_DOWN_VEL_MAX );
        }
    },

    checkCollisions: function checkCollisions() {
        this.physics.arcade.overlap( this.player, this.enemyPool, this.collideEnemy, null, this );
        this.physics.arcade.overlap( this.player, this.rewardPool, this.collideReward, null, this );
        this.physics.arcade.overlap( this.player, this.killzoneTop, this.collideKillzone, null, this );
        this.physics.arcade.overlap( this.player, this.killzoneBottom, this.collideKillzone, null, this );
    },

    shine: function shine() {
        if ( this.haloPool.countDead() === 0 ) return;
        var halo = this.haloPool.getFirstExists( false );
        halo.reset( this.player.x, this.player.y );
        halo.anchor.setTo( 0.5, 0.5 );
        halo.scale.x = 1;
        halo.scale.y = 1;
        halo.alpha = 0.7;
        halo.play( 'glow', 1, false, true );
    },

    collideKillzone: function collideKillzone( player ) {
        this.explode( player );

        this.lives = 0;
        if ( this.lives <= 0 ) {
            this.player.destroy;
            this.state.start( 'MainMenu' );
            this.lives = EndlessJumper.constants.PLAYER_LIVES;
        }
    },

    collideEnemy: function collideEnemy( player, enemy ) {
        this.explode( enemy );
        enemy.kill();
        this.lives --;
        this.livesText.setText( 'LIVES: ' + this.lives );
        if ( this.lives <= 0 ) {
            this.state.start( 'MainMenu' );
            this.lives = EndlessJumper.constants.PLAYER_LIVES;
        }
    },

    explode: function explode( sprite ) {
        if ( this.explosionPool.countDead() === 0 ) return;
        var explosion = this.explosionPool.getFirstExists( false );
        explosion.reset( sprite.x, sprite.y );
        explosion.play( 'boom', 10, false, true );
    },

    collideReward: function collideReward( player, reward ) {
        reward.kill();
        this.shine();

        this.score++;
        this.difficultyIncrement++;
        this.scoreText.setText( String( this.score ));

        if ( this.difficultyIncrement % 5 === 0 ) {
            this.enemyCount++;
            this.setupEnemies();
        }

        if ( store.enabled && this.score > EndlessJumper.constants.CURRENT_HIGH_SCORE ) {
            store.set( 'HIGH_SCORE', this.score );
            if ( this.alreadyShownNewRecord ) this.scoreText.setText( String( this.score ));
            else {
                this.scoreText.setText( String( this.score ) + ' *NEW RECORD*' );
                this.alreadyShownNewRecord = true;
            }
        }
    }

};
