import { EVENTS_NAME } from '../enums/consts';
import { Actor } from './Actor';
import { Fire } from './Fire';
import { Player } from './Player';

export class Dragon extends Actor {
    private player: Player;
    private hpBar: Phaser.GameObjects.Rectangle;
    protected maxHp = 10;
    protected hp = 10;
    protected agro: boolean = false;
    protected agroRadius = 120;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'dragon');
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
        this.getBody().setVelocity(0)

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
            key: 'dragonAttackIndicate',
            frames: this.anims.generateFrameNames('dragonAttack', {
                prefix: 'dragon',
                start: 19,
                end: 21,
            }),
            frameRate: 3,
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

        this.anims.play('dragonIdle', true);

        this.on('animationcomplete', function () {
            this.anims.play('dragonIdle', true);
        })
    }

    initAttack(): void {
        this.scene.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => {
                if (!this.agro) return

                if (Phaser.Math.Between(1, 2) == 1) {
                    this.clawAttack()
                } else {
                    this.fireAttack()
                }
            }
        });
    }

    clawAttack() {
        this.anims.play('dragonAttackIndicate', true);

        let rect = new Phaser.GameObjects.Rectangle(this.scene, this.x, this.y, 110, 120, 0xff0000, 0).setOrigin(0.5, 0.5)

        this.scene.add.existing(rect);
        this.scene.physics.add.existing(rect, false)

        this.scene.time.addEvent({
            delay: 1000,
            loop: false,
            callback: () => {
                this.scene.game.events.emit(EVENTS_NAME.attack, this, rect);
                this.anims.play('dragonAttackSwing', true);
                rect.destroy()
            }
        });
    }

    fireAttack() {
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
                    let fire = new Fire(this.scene, points[index].x, points[index].y, 'fireStart', 'fire1');

                    fire.anims.play('fireStart')

                    this.scene.time.addEvent({
                        delay: 1000,
                        loop: false,
                        callback: () => {
                            fire.anims.play('fireLoop');
                            this.scene.physics.add.overlap(this.player, fire, () => {
                                fire.destroy()
                                this.player.takeDamage(1)
                            })

                            this.scene.time.addEvent({
                                delay: 3000,
                                loop: false,
                                callback: () => {
                                    fire.destroy()
                                },
                            });
                        },
                    });
                }
            });
        }
    }

    initAgro() {
        let circle = new Phaser.GameObjects.Arc(this.scene, this.x, this.y, this.agroRadius, 0, 360, false, 0xff0000, 1)

        this.scene.physics.add.existing(circle)

        this.scene.physics.add.overlap(this.player, circle, () => {
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

        this.scene.add.bitmapText(114, 18, 'atariFont', 'Snarl, The Forest Terror', 8).setScrollFactor(0, 0).setDepth(10);
    }
}