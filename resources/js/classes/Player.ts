import { EVENTS_NAME } from '../enums/consts';
import { Actor } from './Actor';

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private hearts: Phaser.GameObjects.Image[] = []
    private walkSfx1: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    private walkSfx2: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    private walkSfx3: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'girl');
        this.hitAudio = [
            'girlGrunt1',
            'girlGrunt2',
            'girlGrunt3',
            'girlGrunt4',
            'girlGrunt5',
            'girlGrunt6',
        ]

        // KEYS
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');

        this.walkSfx1 = this.scene.sound.add('girlWalk1');
        this.walkSfx2 = this.scene.sound.add('girlWalk2');
        this.walkSfx3 = this.scene.sound.add('girlWalk3');

        this.initAnimations()
        this.initAttack()
        this.initHearts();
    }

    update(): void {
        this.getBody().setVelocity(0);

        if (this.keyW?.isDown) {
            if (!this.isAttacking) {
                this.anims.play('playerUp', true);
            }

            this.getBody().velocity.y = -this.speed;
            this.playWalkSfx()
        }
        if (this.keyA?.isDown) {
            if (this.keyW?.isUp && this.keyS.isUp && !this.isAttacking) {
                this.anims.play('playerLeft', true);
                this.setFlipX(true);
            }

            this.getBody().velocity.x = -this.speed;
            this.playWalkSfx()
        }
        if (this.keyS?.isDown) {
            if (!this.isAttacking) {
                this.anims.play('playerDown', true);
            }

            this.getBody().velocity.y = this.speed;
            this.playWalkSfx()
        }
        if (this.keyD?.isDown) {
            if (this.keyW?.isUp && this.keyS.isUp && !this.isAttacking) {
                this.anims.play('playerRight', true);
                this.setFlipX(false);
            }

            this.getBody().velocity.x = this.speed;
            this.playWalkSfx()
        }
    }

    playWalkSfx() {
        if (this.walkSfx1.isPlaying || this.walkSfx3.isPlaying || this.walkSfx3.isPlaying) return

        switch (Phaser.Math.Between(1, 3)) {
            case 1:
                this.walkSfx1.setVolume(0.02).play();
                break;
            case 1:
                this.walkSfx2.setVolume(0.02).play();
                break;
            case 1:
                this.walkSfx3.setVolume(0.02).play();
                break;
        }

    }

    initHearts() {
        for (let index = 0; index < this.hp; index++) {
            this.hearts.push(this.scene.add.image(20 + index * 20, 280, 'heart', 0));
            this.hearts[index].setScrollFactor(0, 0).setDepth(10);
        }
    }

    postDamageTaken() {
        let heart = this.hearts.pop();

        this.scene.tweens.add({
            targets: heart,
            alpha: 0,
            ease: 'Cubic.easeOut',
            duration: 100,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
                heart?.destroy();
            },
        });
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

            this.anims.play('playerIdle', false);
        })

        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.button !== 0) {
                return
            }

            if (this.isAttacking) {
                return
            }

            let attackAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY)

            let attackingHitboxX = 16 * Math.cos(attackAngle)
            let attackingHitboxY = 16 * Math.sin(attackAngle)

            let rect = new Phaser.GameObjects.Rectangle(this.scene, this.x + attackingHitboxX, this.y + attackingHitboxY, 28, 28, 0xff0000, 0).setOrigin(0.5, 0.5)

            // this.scene.add.existing(rect);
            this.scene.physics.add.existing(rect, false)

            this.scene.game.events.emit(EVENTS_NAME.attack, this, rect);

            rect.destroy()

            let postionFromPlayerX = pointer.position.x - (this.scene.cameras.main.width / 2)
            let postionFromPlayerY = pointer.position.y - (this.scene.cameras.main.height / 2)

            if (Math.abs(postionFromPlayerX) > postionFromPlayerY) {
                this.isAttacking = true
                this.setFlipX(false);
                this.anims.play('playerAttackRight', true);
            }

            if (Math.abs(postionFromPlayerY) > postionFromPlayerX) {
                this.anims.play('playerAttackUp', true);
                this.isAttacking = true
            }

            if (-postionFromPlayerX > Math.abs(postionFromPlayerY)) {
                this.setFlipX(true);
                this.anims.play('playerAttackLeft', true);
                this.isAttacking = true
            }

            if (postionFromPlayerY > Math.abs(postionFromPlayerX)) {
                this.isAttacking = true
                this.anims.play('playerAttackDown', true);
            }

            let sfx1 = this.scene.sound.add('girlAttack' + Phaser.Math.Between(1, 2));
            let sfx2 = this.scene.sound.add('girlGrunt' + Phaser.Math.Between(1, 6));
            sfx1.setVolume(0.05).play();
            sfx2.setVolume(0.2).play();
        });
    }
}