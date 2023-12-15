import { EVENTS_NAME } from '../enums/consts';
import { Actor } from './Actor';

export class Dragon extends Actor {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'dragon');
        this.initAnimations()
    }

    update(): void {
        this.getBody().setVelocity(0)

        this.anims.play('dragonIdle', true);
    }

    initAnimations() {
        this.anims.create({
            key: 'dragonIdle',
            frames: this.anims.generateFrameNames('dragon', {
                prefix: 'dragon',
                start: 25,
                end: 32,
            }),
            frameRate: 4,
        });
    }
}