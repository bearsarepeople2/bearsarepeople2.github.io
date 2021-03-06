import { Scene } from 'phaser';
import { Player } from '../classes/Player';
import { Dragon } from '../classes/Dragon';
import { COLLISION_GROUP, EVENTS_NAME } from '../enums/consts';
import { Timer } from '../classes/Timer';

export class ForestScene extends Scene {
    private player: Player;
    private dragon: Dragon;
    private music: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
    private timer: Timer

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
        upperlayerLayer?.setDepth(2)

        // Player
        this.player = new Player(this.matter.world, 296, 680);

        // Dragons
        this.dragon = new Dragon(this.matter.world, 25 * 16, 27 * 16, this.player).setScale(2).setFixedRotation();

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
            delay: 5500,
            callback: () => {
                this.player.setVelocityY(0)
                this.player.setInputsEnabled(true);
                this.player.anims.play('playerIdle');

                mapLayer?.setCollisionByProperty({ collides: true })
                pathLayer?.setCollisionByProperty({ collides: true })
                overlayerLayer?.setCollisionByProperty({ collides: true })
                upperlayerLayer?.setCollisionByProperty({ collides: true })

                this.matter.world.convertTilemapLayer(mapLayer);
                this.matter.world.convertTilemapLayer(pathLayer);
                this.matter.world.convertTilemapLayer(overlayerLayer);
                this.matter.world.convertTilemapLayer(upperlayerLayer);

                this.matter.getMatterBodies().forEach((body) => {
                    if (!body.gameObject?.tile) {
                        return
                    }

                    body.collisionFilter = {
                        category: COLLISION_GROUP.MAP,
                        mask: COLLISION_GROUP.PLAYER | COLLISION_GROUP.ENEMY,
                        group: 0,
                    }
                })
            }
        });


        this.timer = new Timer(this, 340, 280).setScrollFactor(0, 0).setDepth(10);
        this.add.existing(this.timer)
    }

    death() {
        this.game.events.removeAllListeners(EVENTS_NAME.attack);
        this.music.stop();
        this.scene.start('death-scene');
    }

    victory() {
        this.game.events.removeAllListeners(EVENTS_NAME.attack);
        this.music.stop();
        this.scene.start('victory-scene', {
            hearts: this.player.getHp(),
            time: this.timer.getTime(),
        });
    }

    update(): void {
        this.player.update();
        this.dragon.update();
    }
}