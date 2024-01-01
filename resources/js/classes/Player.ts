import { COLLISION_GROUP, EVENTS_NAME } from '../enums/consts';
import { angleTowardsPoint, cardinalFromPoints, getVelocityVector } from '../helpers/Physics';
import { Actor } from './Actor';

export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private hearts: Phaser.GameObjects.Image[] = []
    private dashIcon: Phaser.GameObjects.Image
    private walkSfx1: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    private walkSfx2: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    private walkSfx3: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    private inputsEnabled: boolean = false;
    private dashEnabled: boolean = true;
    protected speed = 1.6;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
        super(world, x, y, 'girl');

        this.setCollisionCategory(COLLISION_GROUP.PLAYER)
        this.setCollidesWith([COLLISION_GROUP.MAP, COLLISION_GROUP.ENEMY_OBJECTS]);

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
        this.initDash()
        this.initHearts();
    }

    update(): void {
        if (!this.inputsEnabled) return

        this.setVelocity(0)

        if (this.keyW?.isDown) {
            if (!this.isAttacking) {
                this.anims.play('playerUp', true);
            }

            this.setVelocityY(-this.speed);
            this.playWalkSfx()
        }
        if (this.keyA?.isDown) {
            if (this.keyW?.isUp && this.keyS.isUp && !this.isAttacking) {
                this.anims.play('playerLeft', true);
                this.setFlipX(true);
            }

            this.setVelocityX(-this.speed);
            this.playWalkSfx()
        }
        if (this.keyS?.isDown) {
            if (!this.isAttacking) {
                this.anims.play('playerDown', true);
            }

            this.setVelocityY(this.speed);
            this.playWalkSfx()
        }
        if (this.keyD?.isDown) {
            if (this.keyW?.isUp && this.keyS.isUp && !this.isAttacking) {
                this.anims.play('playerRight', true);
                this.setFlipX(false);
            }

            this.setVelocityX(this.speed);
            this.playWalkSfx()
        }

        // after we set all the velocities we normalise the diagonal velocity and add the attacking whilst movement penalty
        let { x, y } = this.getVelocity();

        if (x !== 0 && y !== 0) {
            x = x * 1 / Math.sqrt(2);
            y = y * 1 / Math.sqrt(2)
        }

        if (this.isAttacking) {
            x = x * this.attackingMovementSpeedMultiplier
            y = y * this.attackingMovementSpeedMultiplier
        }

        this.setVelocity(x, y)
    }

    playWalkSfx() {
        if (this.walkSfx1.isPlaying || this.walkSfx3.isPlaying || this.walkSfx3.isPlaying) return

        switch (Phaser.Math.Between(1, 3)) {
            case 1:
                this.walkSfx1.setVolume(0.02).play();
                break;
            case 2:
                this.walkSfx2.setVolume(0.02).play();
                break;
            case 3:
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
                heart?.destroy()
            },
        });
    }

    initAnimations() {
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

        this.anims.create({
            key: 'playerBowAttackSide',
            frames: this.anims.generateFrameNames('bowSide', {
                prefix: 'girl',
                start: 1,
                end: 8,
            }),
            frameRate: 8,
        });

        this.anims.create({
            key: 'playerBowAttackFront',
            frames: this.anims.generateFrameNames('bowFront', {
                prefix: 'girl',
                start: 1,
                end: 8,
            }),
            frameRate: 8,
        });

        this.anims.create({
            key: 'playerBowAttackBack',
            frames: this.anims.generateFrameNames('bowBack', {
                prefix: 'girl',
                start: 1,
                end: 8,
            }),
            frameRate: 8,
        });

        this.anims.create({
            key: 'playerDashUp',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 13,
                end: 16,
            }),
            frameRate: 4,
        });

        this.anims.create({
            key: 'playerDashDown',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 51,
                end: 54,
            }),
            frameRate: 4,
        });

        this.anims.create({
            key: 'playerDashSide',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 55,
                end: 58,
            }),
            frameRate: 4,
        });

        this.anims.play('playerIdle', true);
    }

    initAttack(): void {
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (event) {
            if (event.key.includes('Attack')) {
                this.isAttacking = false
            }

            this.anims.play('playerIdle', false);
        })

        this.scene.input.mouse?.disableContextMenu();

        this.scene.input.on('pointerdown', this.attack, this);
    }

    initDash(): void {
        let keySpace = this.scene.input.keyboard?.addKey('SPACE');

        keySpace?.on('down', () => {
            // if (!this.inputsEnabled || !this.dashEnabled || this.isAttacking) return
            if (!this.inputsEnabled || !this.dashEnabled) return

            let { x, y } = this.getVelocity();

            this.inputsEnabled = false;
            this.dashEnabled = false;
            this.dashIcon.destroy()

            this.setVelocity((x || 0) * 3, (y || 0) * 3)

            this.scene.sound.add('girlDash').setVolume(0.3).play();

            if (!this.isAttacking) {
                if (y < 0) {
                    this.anims.play('playerDashUp');
                } else if (y > 0) {
                    this.anims.play('playerDashDown');
                } else if (y == 0 && x > 0) {
                    this.anims.play('playerDashSide');
                } else {
                    this.flipX = true
                    this.anims.play('playerDashSide');
                }
            }

            this.scene.time.addEvent({
                delay: 200,
                loop: false,
                callback: () => {
                    this.setInputsEnabled(true)
                }
            })

            this.scene.time.addEvent({
                delay: 1500,
                loop: false,
                callback: () => {
                    this.dashEnabled = true
                    this.createDashIcon()
                }
            })
        });

        this.createDashIcon()
    }

    createDashIcon() {
        this.dashIcon = this.scene.add.image(20, 260, 'dash', 0).setScrollFactor(0, 0).setDepth(10);
    }

    attack(pointer) {
        if (!this.inputsEnabled) return

        if (this.isAttacking) {
            return
        }

        if (pointer.button === 0) {
            this.meleeAttack(pointer)
        }

        if (pointer.button === 2) {
            this.rangedAttack(pointer)
        }
    }

    meleeAttack(pointer) {
        this.isAttacking = true

        let attackAngle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY)

        let attackingHitboxX = 16 * Math.cos(attackAngle)
        let attackingHitboxY = 16 * Math.sin(attackAngle)

        let rect = this.scene.matter.add.rectangle(this.x + attackingHitboxX, this.y + attackingHitboxY, 28, 28, {
            isSensor: true,
        })

        this.scene.game.events.emit(EVENTS_NAME.attack, this, rect);

        this.scene.matter.world.remove(rect)

        let postionFromPlayerX = pointer.position.x - (this.scene.cameras.main.width / 2)
        let postionFromPlayerY = pointer.position.y - (this.scene.cameras.main.height / 2)

        if (Math.abs(postionFromPlayerX) > postionFromPlayerY) {
            this.setFlipX(false);
            this.anims.play('playerAttackRight', true);
        }

        if (Math.abs(postionFromPlayerY) > postionFromPlayerX) {
            this.anims.play('playerAttackUp', true);
        }

        if (-postionFromPlayerX > Math.abs(postionFromPlayerY)) {
            this.setFlipX(true);
            this.anims.play('playerAttackLeft', true);
        }

        if (postionFromPlayerY > Math.abs(postionFromPlayerX)) {
            this.isAttacking = true
            this.anims.play('playerAttackDown', true);
        }

        let sfx1 = this.scene.sound.add('girlAttack' + Phaser.Math.Between(1, 2));
        let sfx2 = this.scene.sound.add('girlGrunt' + Phaser.Math.Between(1, 6));
        sfx1.setVolume(0.05).play();
        sfx2.setVolume(0.2).play();
    }

    rangedAttack(pointer) {
        this.isAttacking = true

        let pointerX = pointer.worldX;
        let pointerY = pointer.worldY;

        let directions = cardinalFromPoints(this.x, this.y, pointerX, pointerY)

        if (directions.east) {
            this.setFlipX(false);
            this.anims.play('playerBowAttackSide');
        }

        if (directions.north) {
            this.anims.play('playerBowAttackBack');
        }

        if (directions.west) {
            this.setFlipX(true);
            this.anims.play('playerBowAttackSide');
        }

        if (directions.south) {
            this.anims.play('playerBowAttackFront');
        }

        this.scene.time.addEvent({
            delay: 600,
            callback: () => {
                let arrow = this.scene.matter.add.sprite(this.x, this.y, 'arrow', undefined, { isSensor: true, frictionAir: 0 });

                arrow.setCollisionCategory(COLLISION_GROUP.PLAYER_OBJECTS).setCollidesWith(COLLISION_GROUP.ENEMY);

                let arrowAngle = angleTowardsPoint(this.x, this.y, pointerX, pointerY)

                arrow.setOrigin(.5, .5).setRotation(arrowAngle);

                let { x, y } = getVelocityVector(this.x, this.y, pointerX, pointerY, 5)

                arrow.setVelocity(x, y);

                this.scene.sound.add('girlGrunt' + Phaser.Math.Between(1, 3)).setVolume(0.2).play();

                arrow.setOnCollide((a) => {
                    let enemy = a.bodyA.parent.gameObject as Actor;

                    enemy.takeDamage(this.damage)

                    arrow.destroy()
                })

                this.scene.time.addEvent({
                    delay: 4000,
                    callback: () => {
                        arrow.destroy()
                    }
                });
            }
        });
    }

    handleDeath(): void {
        this.scene.death();
    }

    setInputsEnabled(bool: boolean): void {
        this.inputsEnabled = bool;
    }
}