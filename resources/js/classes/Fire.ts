import { Physics } from 'phaser';

export class Fire extends Physics.Matter.Sprite {
    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, texture: string, frame?: string | number) {
        super(world, x, y, texture, frame, {
            shape: { height: 16, width: 16 }
        });
        world.scene.add.existing(this);
        this.initAnimations()
        this.setSensor(true)
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