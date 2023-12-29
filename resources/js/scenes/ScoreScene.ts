import { Scene } from 'phaser';

export class ScoreScene extends Scene {
    constructor() {
        super('score-scene');
    }

    create(data): void {
        let minutes = Math.floor(data.time / 60)
        let seconds = data.time - minutes * 60

        if (minutes < 1) {
            minutes = '00';
        } else if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (seconds < 10) {
            seconds = '0' + seconds
        }

        this.add.bitmapText(200, 50, 'atariFont', `Time: ${minutes}:${seconds}`, 8).setOrigin(0.5, 0.5);
        this.add.bitmapText(200, 65, 'atariFont', 'Hearts: ' + data.hearts, 8).setOrigin(0.5, 0.5);
        this.add.bitmapText(200, 90, 'atariFont', 'Score: ' + this.score(data.time, data.hearts), 8).setOrigin(0.5, 0.5);
        this.add.bitmapText(200, 200, 'atariFont', '[Space] To Go Again', 8).setOrigin(0.5, 0.5);

        let keySpace = this.input.keyboard?.addKey('SPACE');

        keySpace?.on('down', () => {
            location.reload();
        })
    }

    update(): void {

    }

    preload() {

    }

    score(time: integer, hearts: integer) {
        let timeScore = (5 * 60) - time;

        if (timeScore < 1) {
            timeScore = 1;
        }

        return timeScore * hearts;
    }
}