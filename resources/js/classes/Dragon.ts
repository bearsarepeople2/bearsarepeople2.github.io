import { EVENTS_NAME } from '../enums/consts';
import { Actor } from './Actor';
import { Player } from './Player';

export class Dragon extends Actor {
    private player: Player;
    private hpBar: Phaser.GameObjects.Rectangle;
    protected maxHp = 10;
    protected hp = 10;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'dragon');
        this.player = player
        this.initAnimations()
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

        this.on('animationcomplete', function (event) {
            this.anims.play('dragonIdle', true);
        })
    }

    initAttack(): void {
        this.scene.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                this.anims.play('dragonAttackIndicate', true);

                let rect = new Phaser.GameObjects.Rectangle(this.scene, this.x, this.y, 100, 100, 0xff0000, 0).setOrigin(0.5, 0.5)

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
        });
    }

    initHealthBar() {
        let border = new Phaser.GameObjects.Rectangle(this.scene, 200, 10, 150, 10, 0xD22B2B, 1).setScrollFactor(0, 0)
        this.hpBar = new Phaser.GameObjects.Rectangle(this.scene, 200, 10, 150, 10, 0xD22B2B, 1).setScrollFactor(0, 0)

        border.isFilled = false;
        border.isStroked = true;
        border.lineWidth = 2;
        border.strokeColor = 0x000000;

        this.scene.add.existing(this.hpBar);
        this.scene.add.existing(border);

        this.scene.add.bitmapText(114, 18, 'atariFont', 'Name, A Title For Boss', 8).setScrollFactor(0, 0);
    }
}