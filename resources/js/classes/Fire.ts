import { Physics } from 'phaser';

export class Fire extends Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.initAnimations()
        scene.add.existing(this);
        this.scene.physics.add.existing(this).setSize(16, 16).setOffset(0, 0);
    }

    initAnimations() {
        this.anims.create({
            key: 'fireStart',
            frames: this.anims.generateFrameNames('fireStart', {
                prefix: 'fire',
                start: 1,
                end: 4,
            }),
            frameRate: 4,
        });

        this.anims.create({
            key: 'fireLoop',
            repeat: -1,
            frames: this.anims.generateFrameNames('fireLoop', {
                prefix: 'fire',
                start: 1,
                end: 8,
            }),
            frameRate: 4,
        });
    }
}