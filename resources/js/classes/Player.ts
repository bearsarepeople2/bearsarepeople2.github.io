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
        this.initAttack()
    }

    update(): void {
        this.getBody().setVelocity(0);

        if (this.keyW?.isDown) {
            if (!this.isAttacking) {
                this.anims.play('playerUp', true);
            }

            this.body.velocity.y = -this.speed;
            // this.actorState = 'moving'
        }
        if (this.keyA?.isDown) {
            if (this.keyW?.isUp && this.keyS.isUp && !this.isAttacking) {
                this.anims.play('playerLeft', true);
            }

            this.setFlipX(true);
            this.body.velocity.x = -this.speed;
            // this.actorState = 'moving'
        }
        if (this.keyS?.isDown) {
            if (!this.isAttacking) {
                this.anims.play('playerDown', true);
            }

            this.body.velocity.y = this.speed;
            // this.actorState = 'moving'
        }
        if (this.keyD?.isDown) {
            if (this.keyW?.isUp && this.keyS.isUp && !this.isAttacking) {
                this.anims.play('playerRight', true);
            }

            this.setFlipX(false);
            this.body.velocity.x = this.speed;
            // this.actorState = 'moving'
        }

        // if (this.actorState === 'idle') {
        //     this.anims.play('playerIdle', true);
        // }
    }

    initAnimations() {
        this.anims.create({
            key: 'playerIdle',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 81,
                end: 86,
            }),
            frameRate: 1,
        });

        this.anims.create({
            key: 'playerLeft',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 23,
                end: 28,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerRight',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 23,
                end: 28,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerDown',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 87,
                end: 92,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerUp',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 7,
                end: 12,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerAttackDown',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 35,
                end: 43,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerAttackRight',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 99,
                end: 107,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerAttackLeft',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 99,
                end: 107,
            }),
            frameRate: 16,
        });

        this.anims.create({
            key: 'playerAttackUp',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 65,
                end: 73,
            }),
            frameRate: 16,
        });
    }

    initAttack(): void {
        this.on('animationcomplete', function (event) {
            if (event.key.includes('Attack')) {
                this.isAttacking = false
            }
        })

        this.scene.input.on('pointerdown', (pointer) => {
            if (this.isAttacking) {
                return
            }

            let postionFromPlayerX = pointer.position.x - (this.scene.cameras.main.width / 2)
            let postionFromPlayerY = pointer.position.y - (this.scene.cameras.main.height / 2)

            if (Math.abs(postionFromPlayerX) > postionFromPlayerY) {
                this.isAttacking = true
                this.anims.play('playerAttackRight', true);
                this.setFlipX(false);
            }

            if (Math.abs(postionFromPlayerY) > postionFromPlayerX) {
                this.anims.play('playerAttackUp', true);
                this.isAttacking = true
            }

            if (-postionFromPlayerX > Math.abs(postionFromPlayerY)) {
                this.anims.play('playerAttackLeft', true);
                this.isAttacking = true
                this.setFlipX(true);
            }

            if (postionFromPlayerY > Math.abs(postionFromPlayerX)) {
                this.isAttacking = true
                this.anims.play('playerAttackDown', true);
            }
        });
    }
}