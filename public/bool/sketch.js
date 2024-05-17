let levels
function setup() {
  createCanvas(800, 700);
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  levels = []
  let a = new nodo(100, 50, "a", "switch",true, 0, levels)
  let b = new nodo(220, 50, "b", "switch",true, 0, levels)
  let c = new nodo(220, 50, "c", "and",false, 1, levels)
  let d = new nodo(220, 50, "d", "led",false, 2, levels)
  c.addParent(a)
  c.addParent(b)
  d.addParent(c)
}

function draw() {
  background(220)
  for (let i = 0; i < 7; i++) {
    line(0, i * 100, 800, i * 100)
  }
  showAll()
  for (let i = 0; i < levels.length; i++) {
    for (let j = 0; j < levels[i].length; j++) {
      let current = levels[i][j]
      current.process()
    }
  }

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
      text("ope: " + current.operation, current.x, current.y - 5)
      text("valor:" + current.value, current.x, current.y + 10)
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
  constructor(x, yOff, text, operation,value, generation, levels) {
    this.value = value
    this.operation = operation
    this.x = x
    this.yOff = yOff
    this.y = generation * 100 + yOff//Y OFFSET
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
  process() {
    if (this.operation == "led") {
      this.value = this.parents[0].value
    }
    if (this.operation == "and") {
      for (let i = 0; i < this.parents.length; i++) {
        this.value == this.parents[0]
        if (this.value == this.parents[i].value && this.value == true) {
          this.value = true
        } else {
          this.value = false
        }
      }
      if (this.operation == "or") {
        for (let i = 0; i < this.parents.length; i++) {
          this.value == this.parents[0]
          if (this.value == this.parents[i].value && this.value == false) {
            this.value = false
          } else {
            this.value = false
          }
        }
      }
    }
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
  addChild(x, text, op) {
    let son = new nodo(x, this.yOff, text, op, this.generation + 1, this.levels)
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