import { Scene } from 'phaser';

export class VictoryScene extends Scene {
    private player: Phaser.Physics.Arcade.Sprite;
    private dragon: Phaser.Physics.Arcade.Sprite;
    private music: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
    private text: string[]
    private textIndex: integer = 0

    constructor() {
        super('victory-scene');
    }

    create(): void {
        this.anims.create({
            key: 'dragonDeath',
            frames: this.anims.generateFrameNames('dragonAttackLaunch', {
                prefix: 'dragon',
                start: 1,
                end: 4,
            }),
            frameRate: 4,
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
            key: 'playerUp',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 7,
                end: 12,
            }),
            frameRate: 16,
        });

        this.player = new Phaser.Physics.Arcade.Sprite(this, 0, 0, 'girl').setScale(2)
        this.add.existing(this.player);
        // this.player.anims.play('playerIdle')

        this.dragon = new Phaser.Physics.Arcade.Sprite(this, 0, 0, 'dragon').setScale(4)
        this.add.existing(this.dragon);
        this.dragon.anims.play('dragonDeath')

        this.cameras.main.startFollow(this.player);

        for (let index = 0; index < 10; index++) {
            setTimeout(() => {
                this.dragon.setTintFill(0xFF3131)
                setTimeout(() => {
                    if (index === 9) return
                    this.dragon.clearTint()
                }, index + 1 * 30)

            }, index * 60);
        }

        setTimeout(() => {
            let sfx1 = this.sound.add('girlGrunt6');
            let sfx2 = this.sound.add('girlAttack1');
            sfx1.setVolume(0.5).play();
            sfx2.setVolume(0.2).play();

            this.tweens.add({
                targets: this.dragon,
                alpha: 0,
                ease: 'Cubic.easeOut',
                duration: 800,
                onComplete: () => {
                    this.dragon.destroy();
                },
            });
        }, 2000);

        setTimeout(() => {
            this.player.anims.play('playerAttackDown')

        }, 1600);

        setTimeout(() => {
            let space = this.add.bitmapText(this.player.x, this.player.y + 120, 'atariFont', '[space]', 8).setOrigin(0.5, 0.5);
            space.tint = 0x878787

            this.tweens.add({
                targets: space,
                alpha: 0.5,
                ease: 'Cubic.easeOut',
                duration: 1000,
                repeat: -1,
                yoyo: true,
            });

            this.text = [
                '',
                'Snarl is dead.',
                'Our time together has come to an end.',
                '...',
                'Farewell.',
            ];

            let keySpace = this.input.keyboard?.addKey('SPACE');

            let bitmapText = this.add.bitmapText(this.player.x, this.player.y + 50, 'atariFont', this.text[this.textIndex], 8).setOrigin(0.5, 0.5);

            this.music = this.sound.add('bgMusicMagic');
            this.music.loop = true
            this.music.setVolume(0.1).play();

            keySpace?.on('down', () => {
                this.player.anims.play('playerIdle')
                if (this.textIndex >= this.text.length - 1) {
                    bitmapText.setText('');
                    space.setText('');

                    this.player.anims.play('playerUp', true)

                    this.tweens.add({
                        targets: this.player,
                        scale: 1,
                        ease: 'Cubic.easeOut',
                        duration: 1000,
                        onComplete: () => {
                            this.tweens.add({
                                targets: this.player,
                                alpha: 0,
                                ease: 'Cubic.easeOut',
                                duration: 1000,
                            });
                        }
                    });

                    return
                }

                this.textIndex++
                bitmapText.setText(this.text[this.textIndex])
                this.sound.add('blips').setVolume(0.01).play();
            });
        }, 3600);
    }

    update(): void {

    }

    preload() {
        this.load.audio({ key: 'bgMusicMagic', url: ['assets/audio/music/magic-forest.mp3'] });
        this.load.audio({ key: 'blips', url: ['assets/audio/misc/blips.wav'] });
    }
}