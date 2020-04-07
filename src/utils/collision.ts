export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export function hasRectCollided(rectA: Rect, rectB: Rect): boolean {
  if (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  ) {
    return true;
  } else {
    return false;
  }
}

export function hasCircleCollided(circleA: Circle, circleB: Circle): boolean {
  const dx = circleA.x - circleA.x;
  const dy = circleA.y - circleA.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circleA.radius + circleA.radius) {
    return true;
  } else {
    return false;
  }
}
