export class Timer extends Phaser.GameObjects.BitmapText {
    protected time: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'atariFont', '00:00', 8);

        this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.time += 1
                let minutes = Math.floor(this.time / 60)
                let seconds = this.time - minutes * 60

                if (minutes < 1) {
                    minutes = '00';
                } else if (minutes < 10) {
                    minutes = '0' + minutes;
                }

                if (seconds < 10) {
                    seconds = '0' + seconds
                }

                this.setText(`${minutes}:${seconds}`)
            }
        })
    }
}