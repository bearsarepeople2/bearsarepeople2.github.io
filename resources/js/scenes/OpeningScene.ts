import { Scene } from 'phaser';

export class OpeningScene extends Scene {
    private player: Phaser.Physics.Arcade.Sprite;
    private music: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
    private text: string[]
    private textIndex: integer = 0

    constructor() {
        super('opening-scene');
    }

    create(): void {
        this.music = this.sound.add('bgMusicMagic');
        this.music.loop = true
        this.music.setVolume(0.1).play();

        this.anims.create({
            key: 'playerIdle',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'girl',
                start: 81,
                end: 86,
            }),
            repeat: -1,
            frameRate: 1,
        });

        this.player = new Phaser.Physics.Arcade.Sprite(this, 0, 0, 'girl').setScale(2)
        this.add.existing(this.player);
        this.player.anims.play('playerIdle')

        this.cameras.main.startFollow(this.player);

        this.text = [
            '',
            'Hello.',
            'My name is Ix.',
            'I need your help.',
            'The dragon Snarl destroyed my home.',
            '...',
            'He must die.',
        ];

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

        let keySpace = this.input.keyboard?.addKey('SPACE');

        let bitmapText = this.add.bitmapText(this.player.x, this.player.y + 50, 'atariFont', this.text[this.textIndex], 8).setOrigin(0.5, 0.5);

        keySpace?.on('down', () => {
            if (this.textIndex >= this.text.length - 1) {
                this.sceneTransition()
                return
            }

            this.textIndex++
            bitmapText.setText(this.text[this.textIndex])
            this.sound.add('blips').setVolume(0.01).play();
        });
    }

    sceneTransition(): void {
        this.tweens.add({
            targets: this.player,
            scale: 1,
            ease: 'Linear',
            duration: 1000,
            yoyo: false,
            onStart: () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);

                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.scene.start('forest-scene')
                    }
                });

            }
        });

        this.music.stop();
    }

    update(): void {

    }

    preload() {
        this.load.audio({ key: 'bgMusicMagic', url: ['assets/audio/music/magic-forest.mp3'] });
        this.load.audio({ key: 'blips', url: ['assets/audio/misc/blips.wav'] });
    }
}