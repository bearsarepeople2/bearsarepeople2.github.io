import { Physics } from 'phaser';
import { EVENTS_NAME } from '../enums/consts';

export class Actor extends Physics.Arcade.Sprite {
    protected hp = 3;
    protected damage = 1;
    protected speed = 120;
    protected isAttacking = false;
    protected hitAudio: string[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setMaxSpeed(this.speed);

        this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
    }

    attackHandler(actor: Actor, damageArea: Phaser.GameObjects.Rectangle) {
        if (this === actor) {
            return // cant hit yourself
        }
        this.scene.physics.overlap(this, damageArea, () => {
            this.takeDamage(actor.damage)
        })
    }

    takeDamage(damage: integer) {
        this.hp -= damage

        this.setTintFill(0xffffff)

        setTimeout(() => { this.clearTint() }, 100);

        if (this.hitAudio.length > 0) {
            let sfx = this.scene.sound.add(this.hitAudio[Phaser.Math.Between(0, this.hitAudio.length - 1)]);
            sfx.play();
        }

        this.postDamageTaken()

        if (this.hp < 1) {
            console.log(this.constructor.name + ' died.')
        }
    }

    postDamageTaken(): void { }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}