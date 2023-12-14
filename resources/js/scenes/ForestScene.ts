import { Scene } from 'phaser';
import { Player } from '../classes/Player';

export class ForestScene extends Scene {
    private player: Player;

    constructor() {
        super('forest-scene');
    }

    preload() {
        this.load.image('forestTiles', 'assets/maps/Forest Tilesett-E.png');
        this.load.image('waterTiles', 'assets/maps/Water Tileset-E.png');
        this.load.tilemapTiledJSON('forest', 'assets/maps/forest.json');
    }

    create(): void {
        let forestTiles = this.add.tilemap('forest');
        let forestMap = forestTiles.addTilesetImage('Forest Tilesett', 'forestTiles', 16, 16, 1, 2);
        let waterMap = forestTiles.addTilesetImage('Water Tileset', 'waterTiles', 16, 16, 1, 2);

        // @ts-ignore
        let mapLayer = forestTiles.createLayer('map', [forestMap, waterMap]);

        this.player = new Player(this, 100, 100);

        this.physics.add.collider(this.player, mapLayer);
        mapLayer?.setCollisionByProperty({ collides: true });

        // follow
        this.cameras.main.startFollow(this.player);
    }

    update(): void {
        this.player.update();
    }
}