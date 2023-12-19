import Phaser from 'phaser';
import { ForestScene } from './scenes/ForestScene';
import { LoadingScene } from './scenes/LoadingScene';
import { OpeningScene } from './scenes/OpeningScene';
import { DeathScene } from './scenes/DeathScene';

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 400,
        height: 300
    },
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [LoadingScene, OpeningScene, ForestScene, DeathScene],
};

new Phaser.Game(config);