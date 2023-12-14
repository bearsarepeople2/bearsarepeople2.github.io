import { Scene } from 'phaser';
import { Player } from '../classes/Player';

export class ForestScene extends Scene {
    private player: Player;

    constructor() {
        super('forest-scene');
    }

    preload() {
        this.load.image('grassTiles', 'assets/maps/grass.png');
        this.load.image('waterTiles', 'assets/maps/water.png');
        this.load.tilemapTiledJSON('forest', 'assets/maps/forest.json');
    }

    create(): void {
        let forestTiles = this.add.tilemap('forest');
        let grassMap = forestTiles.addTilesetImage('grass', 'grassTiles', 16, 16);
        let waterMap = forestTiles.addTilesetImage('water', 'waterTiles', 16, 16);

        // @ts-ignore
        let mapLayer = forestTiles.createLayer('bottom', [grassMap, waterMap]);

        this.player = new Player(this, 24 * 16, 37 * 16);

        this.physics.add.collider(this.player, mapLayer);
        mapLayer?.setCollisionByProperty({ collides: true });

        // follow
        this.cameras.main.startFollow(this.player);
    }

    update(): void {
        this.player.update();
    }
}