import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super('loading-scene');
    }

    create(): void {
        this.scene.start('forest-scene');
    }

    preload() {
        this.load.atlas('girl',
            'assets/sprites/girl.png',
            'assets/sprites/girl.json',
        );

        this.load.audio({ key: 'girlAttack1', url: ['assets/audio/girl/girl-attack1.wav'] });
        this.load.audio({ key: 'girlAttack2', url: ['assets/audio/girl/girl-attack2.wav'] });


        this.load.atlas('dragon',
            'assets/sprites/dragon.png',
            'assets/sprites/dragon.json',
        );

        this.load.audio({ key: 'dragonHit1', url: ['assets/audio/dragon/dragon-hit1.mp3'] });
        this.load.audio({ key: 'dragonHit2', url: ['assets/audio/dragon/dragon-hit2.mp3'] });
        this.load.audio({ key: 'dragonHit3', url: ['assets/audio/dragon/dragon-hit3.mp3'] });
    }
}