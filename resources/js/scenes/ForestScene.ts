import { Scene } from 'phaser';
import { Player } from '../classes/Player';
import { Dragon } from '../classes/Dragon';

export class ForestScene extends Scene {
    private player: Player;
    private dragon: Dragon;
    private music: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound

    constructor() {
        super('forest-scene');
    }

    preload() {
        this.load.audio({ key: 'bgMusic1', url: ['assets/audio/music/anomaly-field.mp3'] });
        this.load.image('grassTiles', 'assets/maps/grass.png');
        this.load.image('waterTiles', 'assets/maps/water.png');
        this.load.image('propTiles', 'assets/maps/props.png');
        this.load.image('treeTiles', 'assets/maps/trees.png');
        this.load.image('structureTiles', 'assets/maps/structures.png');
        this.load.tilemapTiledJSON('forest', 'assets/maps/forest.json');
    }

    create(): void {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.music = this.sound.add('bgMusic1');
        this.music.loop = true
        this.music.setVolume(0.01).play();

        let forestTiles = this.add.tilemap('forest');
        let grassMap = forestTiles.addTilesetImage('grass', 'grassTiles', 16, 16);
        let waterMap = forestTiles.addTilesetImage('water', 'waterTiles', 16, 16);
        let propMap = forestTiles.addTilesetImage('props', 'propTiles', 16, 16);
        let treeMap = forestTiles.addTilesetImage('trees', 'treeTiles', 16, 16);
        let structureMap = forestTiles.addTilesetImage('structures', 'structureTiles', 16, 16);

        // @ts-ignore
        let mapLayer = forestTiles.createLayer('bottom', [grassMap, waterMap]);
        let pathLayer = forestTiles.createLayer('path', [grassMap]);
        let overlayerLayer = forestTiles.createLayer('overlayer', [propMap, structureMap]);
        let upperlayerLayer = forestTiles.createLayer('upperlayer', [propMap, treeMap]);

        // Player
        this.player = new Player(this, 296, 680);

        this.physics.add.collider(this.player, mapLayer);
        this.physics.add.collider(this.player, pathLayer);
        this.physics.add.collider(this.player, overlayerLayer);
        this.physics.add.collider(this.player, upperlayerLayer);
        upperlayerLayer?.setDepth(1)

        // Dragons
        this.dragon = new Dragon(this, 25 * 16, 27 * 16, this.player).setImmovable(true).setScale(2).setSize(30, 36).setOffset(7, 0).setDepth(1);

        this.physics.add.collider(this.player, this.dragon);

        // follow
        this.cameras.main.centerOn(this.dragon.x, this.dragon.y);

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.cameras.main.pan(this.player.x, this.player.y, 1000)
            }
        });

        this.time.addEvent({
            delay: 4000,
            callback: () => {
                this.cameras.main.startFollow(this.player);
                this.player.anims.play({ key: 'playerUp', repeat: -1, });
                this.player.setVelocityY(-this.player.getSpeed())
            }
        });

        this.time.addEvent({
            delay: 4750,
            callback: () => {
                this.player.setVelocityY(0)
                this.player.setEnabled(true);
                this.player.anims.play('playerIdle');
                mapLayer?.setCollisionByProperty({ collides: true });
                pathLayer?.setCollisionByProperty({ collides: true });
                overlayerLayer?.setCollisionByProperty({ collides: true });
                upperlayerLayer?.setCollisionByProperty({ collides: true });
            }
        });

    }

    restart() {
        this.music.stop();
        this.scene.start('death-scene');
    }

    update(): void {
        this.player.update();
        this.dragon.update();
    }
}