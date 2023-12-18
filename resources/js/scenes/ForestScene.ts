import { Scene } from 'phaser';
import { Player } from '../classes/Player';
import { Dragon } from '../classes/Dragon';

export class ForestScene extends Scene {
    private player: Player;
    private dragon: Dragon;

    constructor() {
        super('forest-scene');
    }

    preload() {
        this.load.audio({ key: 'bgMusic1', url: ['assets/audio/music/anomaly-field.mp3'] });
        this.load.image('grassTiles', 'assets/maps/grass.png');
        this.load.image('waterTiles', 'assets/maps/water.png');
        this.load.tilemapTiledJSON('forest', 'assets/maps/forest.json');
    }

    create(): void {
        let music = this.sound.add('bgMusic1');
        music.loop = true
        // music.setVolume(0.01).play();

        let forestTiles = this.add.tilemap('forest');
        let grassMap = forestTiles.addTilesetImage('grass', 'grassTiles', 16, 16);
        let waterMap = forestTiles.addTilesetImage('water', 'waterTiles', 16, 16);

        // @ts-ignore
        let mapLayer = forestTiles.createLayer('bottom', [grassMap, waterMap]);

        // Player
        this.player = new Player(this, 24 * 16, 37 * 16);
        this.physics.add.collider(this.player, mapLayer);
        mapLayer?.setCollisionByProperty({ collides: true });

        // Dragons
        this.dragon = new Dragon(this, 32 * 16, 28 * 16, this.player).setImmovable(true);
        this.physics.add.collider(this.player, this.dragon);

        // follow
        this.cameras.main.startFollow(this.player);
    }

    update(): void {
        this.player.update();
        this.dragon.update();
    }
}