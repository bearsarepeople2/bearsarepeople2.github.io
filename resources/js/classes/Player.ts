import { Actor } from './Actor';

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'girl');

        // KEYS
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');

        this.initAnimations()
    }

    update(): void {
        this.getBody().setVelocity(0);

        if (this.keyW?.isDown) {
            this.anims.play('playerUp', true);
            this.body.velocity.y = -110;
        }
        if (this.keyA?.isDown) {
            if (this.keyW?.isUp && this.keyS.isUp) {
                this.anims.play('playerLeft', true);
            }
            this.setFlipX(true);
            this.body.velocity.x = -110;
        }
        if (this.keyS?.isDown) {
            this.anims.play('playerDown', true);
            this.body.velocity.y = 110;
        }
        if (this.keyD?.isDown) {
            if (this.keyW?.isUp && this.keyS.isUp) {
                this.anims.play('playerRight', true);
            }
            this.setFlipX(false);
            this.body.velocity.x = 110;
        }
    }

    initAnimations() {
        this.anims.create({
            key: 'playerLeft',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'sprite',
                start: 31,
                end: 36,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerRight',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'sprite',
                start: 31,
                end: 36,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerDown',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'sprite',
                start: 96,
                end: 101,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerUp',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'sprite',
                start: 15,
                end: 20,
            }),
            frameRate: 16,
        });
    }
}