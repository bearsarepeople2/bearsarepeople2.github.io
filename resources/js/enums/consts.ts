export enum EVENTS_NAME {
    attack = 'attack',
}

export enum COLLISION_GROUP {
    PLAYER = 0b0010,
    ENEMY = 0b0100,
    MAP = 0b1000,
    PLAYER_OBJECTS = 0b00010000,
    ENEMY_OBJECTS = 0b00100000,
}