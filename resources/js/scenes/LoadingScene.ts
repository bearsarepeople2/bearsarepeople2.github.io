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


        this.load.atlas('dragon',
            'assets/sprites/dragon.png',
            'assets/sprites/dragon.json',
        );
    }
}