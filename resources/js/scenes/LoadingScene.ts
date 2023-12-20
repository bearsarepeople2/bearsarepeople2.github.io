import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }

    create(): void {
        this.scene.start('opening-scene');
    }

    preload() {
        this.load.bitmapFont('atariFont', 'assets/fonts/atari-classic.png', 'assets/fonts/atari-classic.xml');
        this.load.spritesheet('heart', 'assets/sprites/heart.png', { frameWidth: 16, frameHeight: 16 });

        this.load.atlas('girl',
            'assets/sprites/girl.png',
            'assets/sprites/girl.json',
        );

        this.load.audio({ key: 'girlAttack1', url: ['assets/audio/girl/girl-attack1.wav'] });
        this.load.audio({ key: 'girlAttack2', url: ['assets/audio/girl/girl-attack2.wav'] });
        this.load.audio({ key: 'girlGrunt1', url: ['assets/audio/girl/girl-grunt1.mp3'] });
        this.load.audio({ key: 'girlGrunt2', url: ['assets/audio/girl/girl-grunt2.mp3'] });
        this.load.audio({ key: 'girlGrunt3', url: ['assets/audio/girl/girl-grunt3.mp3'] });
        this.load.audio({ key: 'girlGrunt4', url: ['assets/audio/girl/girl-grunt4.mp3'] });
        this.load.audio({ key: 'girlGrunt5', url: ['assets/audio/girl/girl-grunt5.mp3'] });
        this.load.audio({ key: 'girlGrunt6', url: ['assets/audio/girl/girl-grunt6.mp3'] });
        this.load.audio({ key: 'girlWalk1', url: ['assets/audio/girl/girl-walk1.wav'] });
        this.load.audio({ key: 'girlWalk2', url: ['assets/audio/girl/girl-walk2.wav'] });
        this.load.audio({ key: 'girlWalk3', url: ['assets/audio/girl/girl-walk3.wav'] });


        this.load.atlas('dragon',
            'assets/sprites/dragon.png',
            'assets/sprites/dragon.json',
        );

        this.load.atlas('dragonAttack',
            'assets/sprites/dragon-attack.png',
            'assets/sprites/dragon-attack.json',
        );

        this.load.atlas('dragonAttackFire',
            'assets/sprites/dragon-fire.png',
            'assets/sprites/dragon-fire.json',
        );

        this.load.atlas('dragonAttackLaunch',
            'assets/sprites/dragon-launch.png',
            'assets/sprites/dragon-launch.json',
        );

        this.load.atlas('dragonWalk',
            'assets/sprites/dragon-walk.png',
            'assets/sprites/dragon-walk.json',
        );

        this.load.atlas('fireStart',
            'assets/sprites/fire-start.png',
            'assets/sprites/fire-start.json',
        );

        this.load.atlas('fireLoop',
            'assets/sprites/fire-loop.png',
            'assets/sprites/fire-loop.json',
        );

        this.load.audio({ key: 'dragonHit1', url: ['assets/audio/dragon/dragon-hit1.mp3'] });
        this.load.audio({ key: 'dragonHit2', url: ['assets/audio/dragon/dragon-hit2.mp3'] });
        this.load.audio({ key: 'dragonHit3', url: ['assets/audio/dragon/dragon-hit3.mp3'] });
    }
}