export function getVelocityVector(x1, y1, x2, y2, speed) {
    return new Phaser.Math.Vector2().setToPolar(Phaser.Math.Angle.Between(x1, y1, x2, y2), speed);
}

export function angleTowardsPoint(x1, y1, x2, y2): number {
    let angle = Phaser.Math.Angle.Between(x1, y1, x2, y2)
    angle = Phaser.Math.Angle.CounterClockwise(angle)
    angle = Phaser.Math.RadToDeg(angle)
    angle = Math.abs(angle - 360)
    angle = Phaser.Math.DegToRad(angle)
    return angle
}

export function cardinalFromPoints(x1, y1, x2, y2): {
    north: boolean,
    east: boolean,
    south: boolean,
    west: boolean,
} {
    let directions = {
        north: false,
        east: false,
        south: false,
        west: false,
    }

    if (Math.abs(x2 - x1) > y1 - y2) {
        directions = {
            north: false,
            east: true,
            south: false,
            west: false,
        }
    }

    if (Math.abs(y2 - y1) > x2 - x1) {
        directions = {
            north: true,
            east: false,
            south: false,
            west: false,
        }
    }

    if (-(x2 - x1) > Math.abs(y2 - y1)) {
        directions = {
            north: false,
            east: false,
            south: false,
            west: true,
        }
    }

    if (y2 - y1 > Math.abs(x2 - x1)) {
        directions = {
            north: false,
            east: false,
            south: true,
            west: false,
        }
    }

    return directions
}