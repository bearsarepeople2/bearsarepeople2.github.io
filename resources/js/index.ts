import Phaser from 'phaser';
import { ForestScene } from './scenes/ForestScene';
import { LoadingScene } from './scenes/LoadingScene';
import { OpeningScene } from './scenes/OpeningScene';
import { DeathScene } from './scenes/DeathScene';
import { VictoryScene } from './scenes/VictoryScene';
import { ScoreScene } from './scenes/ScoreScene';

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
        default: 'matter',
        matter: {
            gravity: {
                y: 0,
            },
            debug: false
        }
    },
    scene: [LoadingScene, OpeningScene, ForestScene, DeathScene, VictoryScene, ScoreScene],
};

new Phaser.Game(config);