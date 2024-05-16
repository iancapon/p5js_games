let levels
function setup() {
  createCanvas(800, 700);
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  levels = []
  let zilda = new nodo(100, 50, "zilda", 0, levels)
  let angelo = new nodo(220, 50, "angelo", 0, levels)
  zilda.addChild(160, "katia")
  queryByName("katia").vertex.addParent(angelo)
  let rodo = new nodo(340, 50, "rodo", 0, levels)
  let chana = new nodo(460, 50, "chana", 0, levels)
  let tao = new nodo(400, 50 , "tao", 1, levels)
  tao.addParent(rodo)
  tao.addParent(chana)
  queryByName("tao").vertex.addChild(220, "ian")
  queryByName("tao").vertex.addChild(340, "fer")
  queryByName("ian").vertex.addParent(queryByName("katia").vertex)
  queryByName("fer").vertex.addParent(queryByName("katia").vertex)
}

function draw() {
  background(220)
  for (let i = 0; i < 7; i++) {
    line(0, i * 100, 800, i * 100)
  }
  showAll()

}

function queryByName(name) {
  let found = false
  let current
  for (let i = 0; i < levels.length && !found; i++) {
    for (let j = 0; j < levels[i].length && !found; j++) {
      current = levels[i][j]
      if (current.text === name) {
        found = true
      }
    }
  }
  return { vertex: current, found: found }
}

function showAll() {
  for (let i = 0; i < levels.length; i++) {
    for (let j = 0; j < levels[i].length; j++) {
      let current = levels[i][j]
      for (let k = 0; k < current.children.length; k++) {
        let offspring = current.children[k]
        line(current.x, current.y, offspring.x, offspring.y)
      }
      rect(current.x, current.y, 100, 50)
      text(current.text, current.x, current.y - 15)
      text("gen: " + current.generation, current.x, current.y - 5)
      text("hijo de:" + current.getParent(), current.x, current.y + 10)
    }
  }
}
function levelInspect() {
  for (let i = 0; i < levels.length; i++) {
    let row = ""
    for (let j = 0; j < levels[i].length; j++) {
      row += "; " + levels[i][j].text + " hijo de: " + levels[i][j].getParent()
    }
    console.log(row)
  }
}
class nodo {
  constructor(x, yOff, text, generation, levels) {
    this.x = x
    this.yOff=yOff
    this.y = generation*100+yOff//Y OFFSET
    this.text = text
    this.children = []
    this.parents = []
    this.generation = generation
    this.levels = levels
    if (this.levels.length > this.generation) {
      this.levels[this.generation].push(this)
    }
    if (this.levels.length <= this.generation) {
      let newLevel = []
      newLevel.push(this)
      this.levels.push(newLevel)
    }
  }
  showUp() {
    for (let i = 0; i < this.parents.length; i++) {
      line(this.x, this.y, this.parents[i].x, this.parents[i].y)
      this.parents[i].showUp()
    }
    rect(this.x, this.y, 100, 50)
    text(this.text, this.x, this.y - 15)
    text("gen: " + this.generation, this.x, this.y - 5)
    text("hijo de:" + this.getParent(), this.x, this.y + 10)

  }
  showDown() {
    for (let i = 0; i < this.children.length; i++) {
      line(this.x, this.y, this.children[i].x, this.children[i].y)
      this.children[i].showDown()
    }
    rect(this.x, this.y, 100, 50)
    text(this.text, this.x, this.y - 15)
    text("gen: " + this.generation, this.x, this.y - 5)
    text("hijo de:" + this.getParent(), this.x, this.y + 10)
  }
  addChild(x, text) {
    let son = new nodo(x, this.yOff, text, this.generation + 1, this.levels)
    son.parents.push(this)
    this.children.push(son)
  }
  addParent(parent) {
    parent.children.push(this)
    this.parents.push(parent)
  }
  getParent() {
    let name = ""
    for (let i = 0; i < this.parents.length; i++) {
      name += " " + this.parents[i].text
    }
    return name
  }

}