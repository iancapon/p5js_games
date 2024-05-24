let levels = []
let switchList = []
///////////////////////
let cursor = 0
let moving = false
///////////////////////
let parent = 0
let plugging = false
///////////////////////
let sw_img_on//=loadImage("icons/switch_on.png")
let sw_img_off
let led_img_on
let led_img_off
let and_img
let or_img
let not_img

function setup() {
  createCanvas(1400, 650);
  rectMode(CENTER)
  imageMode(CENTER)
  textAlign(CENTER, CENTER)
  stroke(100)
  sw_img_on = loadImage("icons/switch_on.png")
  sw_img_off = loadImage("icons/switch_off.png")
  led_img_on = loadImage("icons/led_on.png")
  led_img_off = loadImage("icons/led_off.png")
  and_img = loadImage("icons/and.png")
  or_img = loadImage("icons/or.png")
  not_img = loadImage("icons/not.png")
}

function draw() {
  background(220)
  showAll()
  for (let i = 0; i < levels.length; i++) {
    let current = levels[i]
    current.process()
    moveNode(i)
  }
  connectNodes()
  detectSwitchChange()
  detectAddNode()
}


function addNode(type, x, y) {
  levels.push(new nodo(x, y, type, false))
  switch (type) {
    case "switch":
      document.getElementById("switch-list").innerHTML += '<input type="checkbox" id="switch' + switchList.length + '" name="switch' + switchList.length + '">'
      document.getElementById("switch-list").innerHTML += '<label for="switch' + switchList.length + '">"switch ' + switchList.length + '"</label><br>'
      switchList.push({ index: levels.length - 1, id: 'switch' + switchList.length })
      levels[levels.length - 1].comment = 'sw' + (switchList.length - 1)
      break
  }
}

function detectSwitchChange() {
  for (let i = 0; i < switchList.length; i++) {
    const lever = document.getElementById(switchList[i].id)
    lever.addEventListener("change", () => {
      if (lever.checked) {
        levels[switchList[i].index].value = true
      }
      else {
        levels[switchList[i].index].value = false
      }
    })


  }
}


function moveNode(index) {
  let node = levels[index]
  let dist = sqrt(pow(mouseX - node.x, 2) + pow(mouseY - node.y, 2))
  if (mouseIsPressed && mouseButton === LEFT && dist < 70) {
    if (!moving) {
      cursor = index
      moving = true
    }
    if (moving && cursor == index) {
      node.x = mouseX
      node.y = mouseY
    }
  }
  if (!mouseIsPressed) {
    moving = false
  }
}


function connectNodes() {
  for (let i = 0; i < levels.length; i++) {
    let node1 = levels[i]
    let dist1 = sqrt(pow(mouseX - node1.x, 2) + pow(mouseY - node1.y, 2))
    if (mouseIsPressed && mouseButton === CENTER && dist1 < 70 / 2) {
      if (!plugging) {
        parent = i
        plugging = true
      }
    }
    if (plugging && parent == i) {
      line(node1.x, node1.y, mouseX, mouseY)
    }
    if (!mouseIsPressed && plugging) {
      for (let j = 0; j < levels.length; j++) {
        let node2 = levels[j]
        let dist2 = sqrt(pow(mouseX - node2.x, 2) + pow(mouseY - node2.y, 2))
        if (j != parent && dist2 < 70 / 2 ) {
          levels[parent].addChild(node2)
          break
        }
      }
      plugging = false
    }
  }
}

function showAll() {
  noFill()
  for (let i = 0; i < levels.length; i++) {
    let current = levels[i]
    let numOfParents = current.parents.length
    for (let j = 0; j < numOfParents; j++) {
      let dad = current.parents[j]
      let scale = 20
      let offSet = (numOfParents - 1) * scale / 2
      line(current.x - 70 / 2, current.y + scale * j - offSet, dad.x + 70 / 2, dad.y)
      rect(current.x - 70 / 2, current.y + scale * j - offSet, 5, 5)
      rect(dad.x + 70 / 2, dad.y, 5, 5)
    }
  }
  for (let i = 0; i < levels.length; i++) {
    let current = levels[i]
    rect(current.x, current.y, 70, 70)
    circle(current.x, current.y, 70)
    //text("ope: " + current.operation, current.x, current.y - 5)
    //text("valor:" + current.value, current.x, current.y + 10)
    text(current.comment, current.x, current.y + 25)
    switch (current.operation) {
      case "switch":
        if (current.value) {
          image(sw_img_on, current.x, current.y)
        } else {
          image(sw_img_off, current.x, current.y)
        }
        break
      case "led":
        if (current.value) {
          image(led_img_on, current.x, current.y)
        } else {
          image(led_img_off, current.x, current.y)
        }
        break
      case "and":
        image(and_img, current.x, current.y)
        break
      case "or":
        image(or_img, current.x, current.y)
        break
      case "not":
        image(not_img, current.x, current.y)
        break
    }
  }
}

let aux = true
function detectAddNode() {
  document.getElementById("add-switch").addEventListener("click", _ => {
    if (aux) {
      addNode("switch", 0.5, 0.5)
      aux = false
      setTimeout(() => { aux = true }, 20);
    }
  })
  document.getElementById("add-led").addEventListener("click", _ => {
    if (aux) {
      addNode("led", 0.5, 0.5)
      aux = false
      setTimeout(() => { aux = true }, 20);
    }
  })
  document.getElementById("add-and").addEventListener("click", _ => {
    if (aux) {
      addNode("and", 0.5, 0.5)
      aux = false
      setTimeout(() => { aux = true }, 20);
    }
  })
  document.getElementById("add-or").addEventListener("click", _ => {
    if (aux) {
      addNode("or", 0.5, 0.5)
      aux = false
      setTimeout(() => { aux = true }, 20);
    }
  })
  document.getElementById("add-not").addEventListener("click", _ => {
    if (aux) {
      addNode("not", 0.5, 0.5)
      aux = false
      setTimeout(() => { aux = true }, 20);
    }
  })

  /*
  const sw=document.getElementById("add-switch")
  const and=document.getElementById("add-and")
  const or=document.getElementById("add-or")
  const led=document.getElementById("add-led")
  const not=document.getElementById("add-not")
  */

}


class nodo {
  constructor(x, y, operation, value) {
    this.value = value
    this.operation = operation
    this.x = 100 * x
    this.y = 100 * y
    this.children = []
    this.parents = []
    this.comment = ""
  }

  process() {
    switch (this.operation) {
      case "led":
        if (this.parents.length == 1) {
          this.value = this.parents[0].value
        }
        break
      case "and":
        for (let i = 0; i < this.parents.length - 1 && this.parents.length >= 2; i++) {
          if (this.parents[i].value == this.parents[i + 1].value && this.parents[i].value == true) {
            this.value = true
          } else {
            this.value = false
          }
        }
        break
      case "or":
        for (let i = 0; i < this.parents.length - 1 && this.parents.length >= 2; i++) {
          if (this.parents[i].value == this.parents[i + 1].value && this.parents[i].value == false) {
            this.value = false
          } else {
            this.value = true
          }
        }
        break
      case "not":
        if (this.parents.length == 1) {
          this.value = !this.parents[0].value
        }
        break
    }
  }
  addParent(parent) {
    parent.children.push(this)
    this.parents.push(parent)
  }
  addChild(child) {
    child.parents.push(this)
    this.children.push(child)
  }
}