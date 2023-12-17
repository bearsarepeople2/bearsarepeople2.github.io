import { Physics } from 'phaser';
import { EVENTS_NAME } from '../enums/consts';

export class Actor extends Physics.Arcade.Sprite {
    protected hp = 100;
    protected damage = 10;
    protected speed = 120;
    protected isAttacking = false;
    protected hitAudio: string[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setMaxSpeed(this.speed);

        if (this.constructor.name !== 'Player') {
            this.scene.game.events.on(EVENTS_NAME.playerAttack, this.playerAttackHandler, this);
        }
    }

    playerAttackHandler(player, damageArea) {
        this.scene.physics.overlap(this, damageArea, () => {
            this.takeDamage(player.damage)
        })
    }

    // public getDamage(value?: number): void {
    //     this.scene.tweens.add({
    //         targets: this,
    //         duration: 100,
    //         repeat: 3,
    //         yoyo: true,
    //         alpha: 0.5,
    //         onStart: () => {
    //             if (value) {
    //                 this.hp = this.hp - value;
    //             }
    //         },
    //         onComplete: () => {
    //             this.setAlpha(1);
    //         },
    //     });
    // }

    // public getHPValue(): number {
    //     return this.hp;
    // }

    // protected checkFlip(): void {
    //     if (this.body.velocity.x < 0) {
    //         this.scaleX = -1;
    //     } else {
    //         this.scaleX = 1;
    //     }
    // }

    takeDamage(damage: integer) {
        this.hp -= damage

        this.setTintFill(0xffffff)

        setTimeout(() => { this.clearTint() }, 100);

        let sfx = this.scene.sound.add('dragonHit' + Phaser.Math.Between(1, 3));
        sfx.play();

        if (this.hp < 1) {
            console.log('dragon dead')
        }
    }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}