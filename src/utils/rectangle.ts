export class Rectangle {

  public right: number;
  public bottom: number;

  constructor(
    public left: number,
    public top: number,
    public width: number,
    public height: number
  ) {

    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  within(rect: Rectangle) {
    return (
      rect.left <= this.left &&
      rect.right >= this.right &&
      rect.top <= this.top &&
      rect.bottom >= this.bottom
    );
  }

  overlaps(rect: Rectangle) {
    return (
      this.left < rect.right &&
      rect.left < this.right &&
      this.top < rect.bottom &&
      rect.top < this.bottom
    );
  }

  set(left: number, top: number, width?: number, height?: number) {
    this.left = left;
    this.top = top;
    this.width = width || this.width;
    this.height = height || this.height;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }
}
