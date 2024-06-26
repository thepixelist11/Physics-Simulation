const fs = require('fs')
const path = require('path')

function saveSimulation(dirPath: string, name = 'sim') {
  if(fs.existsSync(path.join(dirPath, `${name}.simsave`))) {
    let count = 1
    while(fs.existsSync(path.join(dirPath, `${name}${count}.simsave`))) {
      count++
      if(count >= 1000) {
        throw new Error('Failed to save simulation')
      }
    }
    name = `${name}${count}`
  }
  const savedSim = JSON.stringify(mainGrid.toJSON())
  fs.writeFileSync(path.join(dirPath, `${name}.simsave`), savedSim)
}

function loadSimulation(filePath: string) {
  if(fs.existsSync(path.join(filePath))) {
    const saveFile = fs.readFileSync(filePath).toString()
    mainGrid.fromJSON(saveFile)
    const parsedGravity = JSON.parse(JSON.parse(saveFile).gravity)
    gravity = new Eclipse.Vector2(parsedGravity.x, parsedGravity.y)
  } else {
    throw new Error(`Save "${filePath}" does not exist`)
  }
}

