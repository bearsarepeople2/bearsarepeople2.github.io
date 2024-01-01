import { getVelocityVector } from '../helpers/Physics';
import { COLLISION_GROUP, EVENTS_NAME } from '../enums/consts';
import { Actor } from './Actor';
import { Fire } from './Fire';
import { Player } from './Player';

export class Dragon extends Actor {
    private player: Player;
    private hpBar: Phaser.GameObjects.Rectangle;
    protected maxHp = 50;
    protected hp = 50;
    protected speed = 1;
    protected agroRadius = 120;
    protected attackMoveRange = 100;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, player: Player) {
        super(world, x, y, 'dragon');

        this.player = player
        this.initAnimations()
        this.initAgro()
        this.initAttack()

        this.initHealthBar()
        this.hitAudio = [
            'dragonHit1',
            'dragonHit2',
            'dragonHit3',
        ]
    }

    update(): void {
        this.setSize(this.width, this.height)
        this.setVelocity(0)

        let playerDistance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y)

        if (playerDistance < this.attackMoveRange && playerDistance > 40 && !this.isAttacking) {
            if (!this.isAttacking) {
                this.anims.play('dragonWalk', true)
            }

            let { x, y } = getVelocityVector(this.x, this.y, this.player.x, this.player.y, this.speed)

            this.setVelocity(x, y)
        }

        let hpbarPercentage = (this.hp / this.maxHp) * 100
        this.hpBar.width = hpbarPercentage * 1.5

        if (this.hpBar.width < 0) {
            this.hpBar.width = 0;
        }
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

        this.anims.create({
            key: 'dragonWalk',
            frames: this.anims.generateFrameNames('dragonWalk', {
                prefix: 'dragon',
                start: 1,
                end: 6,
            }),
            frameRate: 6,
        });

        this.anims.create({
            key: 'dragonAttackIndicate',
            frames: this.anims.generateFrameNames('dragonAttack', {
                prefix: 'dragon',
                start: 19,
                end: 21,
            }),
            frameRate: 4 * .8,
        });

        this.anims.create({
            key: 'dragonAttackSwing',
            frames: this.anims.generateFrameNames('dragonAttack', {
                prefix: 'dragon',
                start: 22,
                end: 24,
            }),
            frameRate: 1,
        });

        this.anims.create({
            key: 'dragonAttackFire',
            frames: this.anims.generateFrameNames('dragonAttackFire', {
                prefix: 'dragon',
                start: 1,
                end: 8,
            }),
            frameRate: 8,
        });

        this.anims.create({
            key: 'dragonAttackLaunchIndicate',
            frames: this.anims.generateFrameNames('dragonAttackLaunch', {
                prefix: 'dragon',
                start: 1,
                end: 8,
            }),
            frameRate: 4,
        });

        this.anims.play('dragonIdle', true);

        this.on('animationcomplete', function () {
            this.anims.play('dragonIdle', true);
        })
    }

    initAttack(): void {
        this.on('animationcomplete', function (event) {
            if (event.key.includes('Attack') && event.key !== 'dragonAttackIndicate') {
                this.isAttacking = false
            }

            this.anims.play('dragonIdle', false);
        })

        this.scene.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => {
                if (!this.agro) return

                let playerNearby = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) < this.attackMoveRange;
                let rngAttack = Phaser.Math.Between(1, 10);

                this.isAttacking = true

                if ((rngAttack < 8) && playerNearby) {
                    this.flipX = Phaser.Math.Between(1, 2) === 1
                    this.clawAttack()
                } else if (rngAttack < 10) {
                    this.fireAttack()
                } else {
                    this.launchAttack()
                }
            }
        });
    }

    clawAttack() {
        this.anims.play('dragonAttackIndicate', false);
        let cirlce = this.scene.add.circle(this.player.x, this.player.y, 50, 0xff0000, 0.5).setDepth(0);
        let area = this.scene.matter.add.circle(this.player.x, this.player.y, 50, { isSensor: true })

        this.scene.time.addEvent({
            delay: 800,
            loop: false,
            callback: () => {
                this.scene.game.events.emit(EVENTS_NAME.attack, this, area);
                this.anims.play('dragonAttackSwing', true);
                this.scene.matter.world.remove(area)
                cirlce.destroy()
            }
        });
    }

    launchAttack() {
        this.anims.play('dragonAttackLaunchIndicate');

        this.scene.time.addEvent({
            delay: 1000,
            loop: false,
            callback: () => {
                this.player.setInputsEnabled(false)
                let { x, y } = getVelocityVector(this.x, this.y, this.player.x, this.player.y, 4);
                this.player.setVelocity(x, y)
            }
        });

        this.scene.time.addEvent({
            delay: 1700,
            loop: false,
            callback: () => {
                this.player.setInputsEnabled(true)
            }
        });
    }

    fireAttack() {
        this.anims.play('dragonAttackFire', true);

        let line = new Phaser.Geom.Line(this.x, this.y, this.player.x, this.player.y)

        line = Phaser.Geom.Line.Extend(line, 0, 80);

        let points = Phaser.Geom.Line.BresenhamPoints(line, 36);
        points.shift()  // remove the first point becuase it covers the monster

        for (let index = 0; index < points.length; index++) {
            if (points[index].x == undefined) return

            this.scene.time.addEvent({
                delay: index * 100,
                loop: false,
                callback: () => {
                    let fire = new Fire(this.scene.matter.world, points[index].x, points[index].y, 'fireStart', 'fire1')
                        .setCollisionCategory(COLLISION_GROUP.ENEMY_OBJECTS)
                        .setCollidesWith(COLLISION_GROUP.PLAYER);

                    fire.anims.play('fireStart')

                    this.scene.time.addEvent({
                        delay: 1000,
                        loop: false,
                        callback: () => {
                            fire.anims.play('fireLoop');
                            fire.setOnCollideWith(this.player.getBody(), () => {
                                fire.destroy()
                                this.player.takeDamage(1)
                            })

                            this.scene.matter.overlap(this.player, [fire], () => {
                                fire.destroy()
                                this.player.takeDamage(1)
                            })

                            this.scene.time.addEvent({
                                delay: 3000,
                                loop: false,
                                callback: () => {
                                    if (Phaser.Math.Between(1, 2) === 1) {
                                        fire.destroy()
                                    }
                                },
                            });
                        },
                    });
                }
            });
        }
    }

    initAgro() {
        let agroObject = this.scene.matter.add.circle(this.x, this.y, this.agroRadius, {
            isSensor: true,
        })

        agroObject.collisionFilter = {
            category: COLLISION_GROUP.ENEMY_OBJECTS,
            mask: COLLISION_GROUP.PLAYER,
            group: 0,
        }

        agroObject.setOnCollideWith(this.player.getBody(), () => {
            this.agro = true
        })
    }

    initHealthBar() {
        let border = new Phaser.GameObjects.Rectangle(this.scene, 200, 10, 150, 10, 0xD22B2B, 1).setScrollFactor(0, 0)
        this.hpBar = new Phaser.GameObjects.Rectangle(this.scene, 200, 10, 150, 10, 0xD22B2B, 1).setScrollFactor(0, 0)

        border.isFilled = false;
        border.isStroked = true;
        border.lineWidth = 2;
        border.strokeColor = 0x000000;

        this.scene.add.existing(this.hpBar).setDepth(10);
        this.scene.add.existing(border).setDepth(10);

        this.scene.add.bitmapText(145, 18, 'atariFont', 'Snarl The Vile', 8).setScrollFactor(0, 0).setDepth(10);
    }

    handleDeath(): void {
        this.scene.victory();
    }
}