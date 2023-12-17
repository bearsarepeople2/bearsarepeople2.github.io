import { EVENTS_NAME } from '../enums/consts';
import { Actor } from './Actor';
import { Player } from './Player';

export class Dragon extends Actor {
    private player: Player;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'dragon');
        this.player = player
        this.initAnimations()
        this.initAttack()
        this.hitAudio = [
            'dragonHit1',
            'dragonHit2',
            'dragonHit3',
        ]
    }

    update(): void {
        this.getBody().setVelocity(0)

        // this.anims.play('dragonIdle', true);
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
    }

    initAttack(): void {
        setInterval(() => {
            this.anims.play('dragonAttackIndicate', true);

            let rect = new Phaser.GameObjects.Rectangle(this.scene, this.x, this.y, 100, 100, 0xff0000, 0.2).setOrigin(0.5, 0.5)

            this.scene.add.existing(rect);
            this.scene.physics.add.existing(rect, false)

            setTimeout(() => {
                this.scene.game.events.emit(EVENTS_NAME.attack, this, rect);
                this.anims.play('dragonAttackSwing', true);
                rect.destroy()
            }, 1000)
        }, 5000)
    }
}