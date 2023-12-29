import { Physics } from 'phaser';
import { EVENTS_NAME } from '../enums/consts';

export class Actor extends Physics.Matter.Sprite {
    protected maxHp = 3;
    protected hp = 3;
    protected damage = 1;
    protected speed = 2;
    protected attackingMovementSpeedMultiplier = 0.5;
    protected isAttacking = false;
    protected hitAudio: string[] = [];

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, texture: string, frame?: string | number) {
        super(world, x, y, texture, frame);
        this.setCollisionGroup(-1)
        this.setFixedRotation()
        this.depth = 1;
        world.scene.add.existing(this);

        this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
    }

    attackHandler(actor: Actor, damageArea: Phaser.GameObjects.Rectangle) {
        if (this === actor) {
            return // cant hit yourself
        }

        this.scene.matter.overlap(this, [damageArea], () => {
            this.takeDamage(actor.damage)
        })
    }

    takeDamage(damage: integer) {
        this.hp -= damage

        for (let index = 0; index < 3; index++) {
            setTimeout(() => {
                this.setTintFill(0xffffff)
                setTimeout(() => {
                    this.clearTint()
                }, index + 1 * 30)

            }, index * 60);
        }

        if (this.hitAudio.length > 0) {
            let sfx = this.scene.sound.add(this.hitAudio[Phaser.Math.Between(0, this.hitAudio.length - 1)]);
            sfx.play();
        }

        this.postDamageTaken()

        if (this.hp < 1) {
            console.log(this.constructor.name + ' died.');
            this.handleDeath()
        }
    }

    handleDeath(): void { }

    getSpeed(): integer {
        return this.speed;
    }

    getHp(): integer {
        return this.hp;
    }

    postDamageTaken(): void { }

    getBody(): MatterJS.BodyType {
        return this.body as MatterJS.BodyType;
    }
}