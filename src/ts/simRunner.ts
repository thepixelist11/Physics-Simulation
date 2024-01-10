async function runSim(simFile: string, timeToRun: number, ts = 0.01667, dataCollectInterval = 100) {
  loadSimulation(simFile)
  let data: { [key: string]: any } = {
    gravity: gravity,
    COR: COR,
    timeStamps: [0]
  }
  for(let i = 0; i < mainGrid.points.length; i++) {
    const p = mainGrid.points[i]
    data[`p${i}`] = {
      x: [p.x / pxPerM],
      y: [p.y / pxPerM],
      xVel: [p.velocity.x / pxPerM],
      yVel: [p.velocity.y / pxPerM],
      radius: p.radius / pxPerM,
      mass: p.mass,
    }
  }

  let totalTime = 0
  let timeSinceCollection = 0
  
  disableMenuFunctionality()
  controller.canPlacePoint = false
  loopPhysics = true
  // Main loop
  //@ts-ignore
  return new Promise((res) => {
    const loop = setInterval(() => {
      if(canDrawScene) ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < Math.ceil((FPS * 1000) / (ts * 1000)); i++) {
        if(!simulationPaused){
          updatePoints(ts / 1000, mainGrid, pxPerM)
          if(timeSinceCollection >= dataCollectInterval) {
            timeSinceCollection = 0
            for(let j = 0; j < mainGrid.points.length; j++) {
              const p = mainGrid.points[j]
              data[`p${j}`].x.push(p.x / pxPerM)
              data[`p${j}`].y.push(p.y / pxPerM)
              data[`p${j}`].xVel.push(p.velocity.x)
              data[`p${j}`].yVel.push(p.velocity.y)
            }
            data.timeStamps.push(totalTime)
          }
          if(totalTime >= timeToRun) {
            loopPhysics = false
            stopPhysics()
            clearInterval(loop)
            res(data)
          }

          // Increment time
          totalTime += ts
          timeSinceCollection += ts
        }
      }
      drawScene(mainGrid, ctx, mainCam, ConfigObject)
    }, FPS)
  })
}

async function runAllSims(dirPath: string, timeToRun: number, ts = 16.67, dataCollectInterval = 10) {
  const dirList = fs.readdirSync(dirPath)
  let data: {[key: string]: any} = {}
  for(let i = 0; i < dirList.length; i++) {
    if(path.extname(dirList[i]) !== '.simsave') continue
    const name = path.basename(dirList[i])
    console.log(name)
    data[name] = await runSim(path.join(dirPath, dirList[i]), timeToRun, ts, dataCollectInterval)
  }
  return data
}

// Data format
// Sim
//   Gravity
//   COR
//   Points
//     Properties

function toCSV(obj: {[key: string]: any}) {
  let csv: Array<string> = []
  let names: Array<string> = []
  for(const simName in obj) {
    const sim = obj[simName]
    const nameMatches = /^(.*)\.simsave$/.exec(simName)
    const name = nameMatches ? nameMatches[1] : ''
    const gravity = sim.gravity.y
    const COR = sim.COR
    names.push(name)
    csv.push(`Name:,${name}\r\nGravity:,${gravity}m/s^2\r\nCOR:,${COR}\r\nPOINTS,TIME (s),X VELOCITY (m/s),Y VELOCITY (m/s),X POSITION (m),Y POSITION (m)\r\n`)
    let lines = []
    for(let i = 0; true; i++) {
      if(!sim[`p${i}`]) break
      lines.push(`P${i},`)
      for(let j = 0; j < sim.timeStamps.length; j++) {
        const time = (sim.timeStamps[j] / 1000).toPrecision(4).toString()
        const xVel = sim[`p${i}`].xVel[j].toPrecision(4).toString()
        const yVel = sim[`p${i}`].yVel[j].toPrecision(4).toString()
        const x = sim[`p${i}`].x[j].toPrecision(4).toString()
        const y = sim[`p${i}`].y[j].toPrecision(4).toString()
        if(j === 0) {
          lines[lines.length - 1] = lines[lines.length - 1].concat(`${time},${xVel},${yVel},${x},${y}\r\n,`)
        } else {
          lines.push(`${time},${xVel},${yVel},${x},${y}\r\n,`)
        }
      }
    }
    for(let i = 0; i < lines.length; i++) {
      csv[csv.length - 1] = csv[csv.length - 1].concat(lines[i])
    }
  }
  return {csv, names}
}

function runFullTest(path: string, timeToRun: number, ts = 16.67, dataCollectInterval = 10) {
  runAllSims(path, timeToRun, ts, dataCollectInterval)
    .then(res => {
      const csvData = toCSV(res)
      for(let i = 0; i < csvData.csv.length; i++) {
        Eclipse.downloadTextFile(csvData.csv[i], `${csvData.names[i]}.csv`)
      }
    })
}
