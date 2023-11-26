// import * as fs from 'fs'
// import * as path from 'path'

const fs = require('fs')
const path = require('path')

// TODO: Remove default path
function saveSimulation(dirPath: string = 'C:\\users\\benan\\desktop\\physics simulation\\resources', name = 'sim') {
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
  const savedSimUTF16 = JSON.stringify(mainGrid.toJSON())
  fs.writeFileSync(path.join(dirPath, `${name}.simsave`), savedSimUTF16)
}

function loadSimulation(filePath: string) {
  if(fs.existsSync(path.join(filePath))) {
    mainGrid.fromJSON(fs.readFileSync(filePath).toString())
  } else {
    throw new Error(`Save "${filePath}" does not exist`)
  }
}