export function getVelocityVector(x1, y1, x2, y2, speed) {
    return new Phaser.Math.Vector2().setToPolar(Phaser.Math.Angle.Between(x1, y1, x2, y2), speed);
}