const copies = 10

class Master extends Layer {
  static useHTML = true

  constructor() {
    super({size: 'fill'})

    for (let i = copies; i > 0; i--) {
      this.addChild(this.main = new Main(i))
    }
  }

  render() {
    this.clear()
  }
}

class Main extends Layer {
  constructor(scale) {
    super({align: 'center', size: [101, 101]})

    this.maxScale = scale
    this.setBaseScale(scale, scale)
  }

  render() {
    console.log('rendering main');
    this.background(102)
    this.fill(255, 255, 153)

    const s = 50
    this.rectMode = 'radius'
    this.lineMode = 'radius'
    this.rect(0, 0, s, s)
    this.noStroke()
    this.fill('red')
    this.ellipse(s / 2, s / 2, s / 2)
    this.strokeWeight(1)
    this.line(0, 0, s, 0)
    this.line(0, 0, 0, s)
  }

  onKey({key}) {
    switch (key) {
      case '.': this.zoom(+1); break;
      case ',': this.zoom(-1); break;
    }
  }

  zoom(dir) {
    this.addBaseScale(dir, dir).capBaseScale(this.maxScale, this.maxScale + copies)
  }
}