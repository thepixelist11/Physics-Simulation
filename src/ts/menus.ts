function changeGrav() {
  ipcRenderer.send('disableMenuItem', 'changeGrav')
  ipcRenderer.send('disableMenuItem', 'editWall')
  ipcRenderer.send('disableMenuItem', 'editPoint')
  ipcRenderer.send('disableMenuItem', 'editZoom')
  ipcRenderer.send('disableMenuItem', 'editCOR')

  const menuHeight = 100

  const menuBG = document.createElement('div')
  menuBG.classList.add('menuBoxBack')
  menuBG.style.width = `auto`
  menuBG.style.height = `${menuHeight}px`
  menuBG.style.top = '50%'
  menuBG.style.left = '50%'
  menuBG.style.transform = 'translate(-50%, -50%)'
  document.body.appendChild(menuBG)

  const title = document.createElement('p')
  title.classList.add('menuBoxTitle')
  title.innerHTML = 'Change Acceleration Due To Gravity'
  menuBG.appendChild(title)

  const inputDiv = document.createElement('div')
  menuBG.appendChild(inputDiv)

  const input = document.createElement('input')
  input.type = 'number'
  input.value = gravity.y.toString()
  input.placeholder = gravity.y.toString()
  input.classList.add('menuBoxInput')
  input.title = ''
  inputDiv.appendChild(input)

  const confirm = document.createElement('button')
  confirm.classList.add('menuBoxConfirm')
  confirm.innerHTML = 'OK'
  inputDiv.appendChild(confirm)

  confirm.onclick = () => {
    ipcRenderer.send('enableMenuItem', 'changeGrav')
    ipcRenderer.send('enableMenuItem', 'editWall')
    ipcRenderer.send('enableMenuItem', 'editCOR')
    ipcRenderer.send('enableMenuItem', 'editPoint')
    ipcRenderer.send('enableMenuItem', 'editZoom')
    gravity.y = parseFloat(input.value)
    document.body.removeChild(menuBG)
  }
}

function editWall() {
  ipcRenderer.send('disableMenuItem', 'changeGrav')
  ipcRenderer.send('disableMenuItem', 'editZoom')
  ipcRenderer.send('disableMenuItem', 'editWall')
  ipcRenderer.send('disableMenuItem', 'editCOR')
  ipcRenderer.send('disableMenuItem', 'editPoint')

  const menuHeight = 100

  const menuBG = document.createElement('div')
  menuBG.classList.add('menuBoxBack')
  menuBG.style.width = `auto`
  menuBG.style.height = `${menuHeight}px`
  menuBG.style.top = '50%'
  menuBG.style.left = '50%'
  menuBG.style.transform = 'translate(-50%, -50%)'
  document.body.appendChild(menuBG)

  const title = document.createElement('p')
  title.classList.add('menuBoxTitle')
  title.innerHTML = 'Edit Wall'
  menuBG.appendChild(title)

  const inputDiv = document.createElement('div')
  menuBG.appendChild(inputDiv)

  const input = document.createElement('input')
  input.type = 'number'
  input.value = mainGrid.walls[0].position.toString()
  input.placeholder = mainGrid.walls[0].position.toString()
  input.classList.add('menuBoxInput')
  input.title = 'Wall Position in Pixels'
  inputDiv.appendChild(input)

  const side = document.createElement('select')
  side.classList.add('menuBoxSelect')
  const left = document.createElement('option')
  left.innerHTML = 'left'
  left.value = 'left'
  const right = document.createElement('option')
  right.innerHTML = 'right'
  right.value = 'right'
  const top = document.createElement('option')
  top.innerHTML = 'top'
  top.value = 'top'
  const bottom = document.createElement('option')
  bottom.innerHTML = 'bottom'
  bottom.value = 'bottom'
  side.appendChild(left)
  side.appendChild(right)
  side.appendChild(top)
  side.appendChild(bottom)
  side.value = mainGrid.walls[0].side
  inputDiv.appendChild(side)

  const confirm = document.createElement('button')
  confirm.classList.add('menuBoxConfirm')
  confirm.innerHTML = 'OK'
  inputDiv.appendChild(confirm)

  confirm.onclick = () => {
    ipcRenderer.send('enableMenuItem', 'changeGrav')
    ipcRenderer.send('enableMenuItem', 'editWall')
    ipcRenderer.send('enableMenuItem', 'editCOR')
    ipcRenderer.send('enableMenuItem', 'editPoint')
    ipcRenderer.send('enableMenuItem', 'editZoom')
    mainGrid.walls[0].position = parseFloat(input.value)
    mainGrid.walls[0].side = side.value as Side
    document.body.removeChild(menuBG)
    drawScene(mainGrid, ctx, mainCam, ConfigObject)
  }
}

function editPoint() {
  if(controller.selectedPoint) {
    const p = controller.selectedPoint
    ipcRenderer.send('disableMenuItem', 'editCOR')
    ipcRenderer.send('disableMenuItem', 'changeGrav')
  ipcRenderer.send('disableMenuItem', 'editZoom')
  ipcRenderer.send('disableMenuItem', 'editWall')
    ipcRenderer.send('disableMenuItem', 'editPoint')
    
    const menuHeight = 600
    
    const menuBG = document.createElement('div')
    menuBG.classList.add('menuBoxBack')
    menuBG.style.width = `auto`
    menuBG.style.height = `${menuHeight}px`
    menuBG.style.top = '50%'
    menuBG.style.left = '50%'
    menuBG.style.transform = 'translate(-50%, -50%)'
    document.body.appendChild(menuBG)
    
    const title = document.createElement('p')
    title.classList.add('menuBoxTitle')
    title.innerHTML = 'Edit Selected Point'
    menuBG.appendChild(title)
    
    const inputDiv = document.createElement('div')
    inputDiv.style.display = 'flex'
    inputDiv.style.flexDirection = 'column'
    menuBG.appendChild(inputDiv)
    
    const xPos = document.createElement('div')
    const xInput = document.createElement('input')
    xInput.id = 'xInput'
    xInput.type = 'number'
    xInput.value = (p.position.x / pxPerM).toString()
    xInput.classList.add('menuBoxInput')
    xInput.style.display = 'inline-block'
    xInput.placeholder = (p.position.x / pxPerM).toString()
    const xLabel = document.createElement('label')
    xLabel.classList.add('menuBoxLabel')
    xLabel.htmlFor = 'xInput'
    xLabel.innerHTML = 'X Pos (m) '
    xPos.appendChild(xLabel)
    xPos.appendChild(xInput)
    inputDiv.appendChild(xPos)

    const yPos = document.createElement('div')
    const yInput = document.createElement('input')
    yInput.id = 'yInput'
    yInput.type = 'number'
    yInput.value = (p.position.y / pxPerM).toString()
    yInput.classList.add('menuBoxInput')
    yInput.style.display = 'inline-block'
    yInput.placeholder = (p.position.y / pxPerM).toString()
    const yLabel = document.createElement('label')
    yLabel.classList.add('menuBoxLabel')
    yLabel.htmlFor = 'yInput'
    yLabel.innerHTML = 'Y Pos (m) '
    yPos.appendChild(yLabel)
    yPos.appendChild(yInput)
    inputDiv.appendChild(yPos)

    const xVel = document.createElement('div')
    const xVInput = document.createElement('input')
    xVInput.id = 'xVInput'
    xVInput.type = 'number'
    xVInput.value = (p.velocity.x / pxPerM).toString()
    xVInput.classList.add('menuBoxInput')
    xVInput.style.display = 'inline-block'
    xVInput.placeholder = (p.velocity.x / pxPerM).toString()
    const xVLabel = document.createElement('label')
    xVLabel.classList.add('menuBoxLabel')
    xVLabel.htmlFor = 'xVInput'
    xVLabel.innerHTML = 'X Vel (m) '
    xVel.appendChild(xVLabel)
    xVel.appendChild(xVInput)
    inputDiv.appendChild(xVel)

    const yVel = document.createElement('div')
    const yVInput = document.createElement('input')
    yVInput.id = 'yVInput'
    yVInput.type = 'number'
    yVInput.value = (p.velocity.y / pxPerM).toString()
    yVInput.classList.add('menuBoxInput')
    yVInput.style.display = 'inline-block'
    yVInput.placeholder = (p.velocity.y / pxPerM).toString()
    const yVLabel = document.createElement('label')
    yVLabel.classList.add('menuBoxLabel')
    yVLabel.htmlFor = 'yVInput'
    yVLabel.innerHTML = 'Y Vel (m) '
    yVel.appendChild(yVLabel)
    yVel.appendChild(yVInput)
    inputDiv.appendChild(yVel)

    const radius = document.createElement('div')
    const radiusInput = document.createElement('input')
    radiusInput.id = 'radiusInput'
    radiusInput.type = 'number'
    radiusInput.value = (p.radius / pxPerM).toString()
    radiusInput.classList.add('menuBoxInput')
    radiusInput.style.display = 'inline-block'
    radiusInput.placeholder = (p.radius / pxPerM).toString()
    const radiusLabel = document.createElement('label')
    radiusLabel.classList.add('menuBoxLabel')
    radiusLabel.htmlFor = 'radiusInput'
    radiusLabel.innerHTML = 'Radius (m)'
    radius.appendChild(radiusLabel)
    radius.appendChild(radiusInput)
    inputDiv.appendChild(radius)

    const mass = document.createElement('div')
    const massInput = document.createElement('input')
    massInput.id = 'massInput'
    massInput.type = 'number'
    massInput.value = p.mass.toString()
    massInput.classList.add('menuBoxInput')
    massInput.style.display = 'inline-block'
    massInput.placeholder = p.mass.toString()
    const massLabel = document.createElement('label')
    massLabel.classList.add('menuBoxLabel')
    massLabel.htmlFor = 'massInput'
    massLabel.innerHTML = 'Mass (kg) '
    mass.appendChild(massLabel)
    mass.appendChild(massInput)
    inputDiv.appendChild(mass)

    const isStatic = document.createElement('div')
    const isStaticInput = document.createElement('input')
    isStaticInput.id = 'isStaticInput'
    isStaticInput.type = 'checkbox'
    isStaticInput.checked = p.isStatic
    isStaticInput.style.display = 'inline-block'
    const isStaticLabel = document.createElement('label')
    isStaticLabel.classList.add('menuBoxLabel')
    isStaticLabel.htmlFor = 'isStaticInput'
    isStaticLabel.innerHTML = 'Is Static?'
    isStatic.appendChild(isStaticLabel)
    isStatic.appendChild(isStaticInput)
    inputDiv.appendChild(isStatic)

    const color = document.createElement('div')
    const colorInput = document.createElement('input')
    colorInput.id = 'colorInput'
    colorInput.type = 'color'
    colorInput.value = p.color.toHex()
    colorInput.style.display = 'inline-block'
    const colorLabel = document.createElement('label')
    colorLabel.classList.add('menuBoxLabel')
    colorLabel.htmlFor = 'colorInput'
    colorLabel.innerHTML = 'Color'
    color.appendChild(colorLabel)
    color.appendChild(colorInput)
    inputDiv.appendChild(color)
    
    inputDiv.appendChild(document.createElement('br'))
    const confirm = document.createElement('button')
    confirm.classList.add('menuBoxConfirm')
    confirm.innerHTML = 'OK'
    inputDiv.appendChild(confirm)
    
    confirm.onclick = () => {
      ipcRenderer.send('enableMenuItem', 'changeGrav')
      ipcRenderer.send('enableMenuItem', 'editWall')
      ipcRenderer.send('enableMenuItem', 'editPoint')
      ipcRenderer.send('enableMenuItem', 'editCOR')
      ipcRenderer.send('enableMenuItem', 'editZoom')

      const lastX = p.x
      const lastY = p.y
      p.x = parseFloat(xInput.value) * pxPerM
      p.y = parseFloat(yInput.value) * pxPerM
      p.lastPosition.x -= lastX - p.x
      p.lastPosition.y -= lastY - p.y
      p.velocity = new Eclipse.Vector2(parseFloat(xVInput.value), parseFloat(yVInput.value))
      p.initialVelocity = new Eclipse.Vector2(parseFloat(xVInput.value) * pxPerM, parseFloat(yVInput.value) * pxPerM)
      p.radius = parseFloat(radiusInput.value) * pxPerM
      p.mass = parseFloat(massInput.value)
      p.isStatic = isStaticInput.checked
      p.color = new Eclipse.Color(colorInput.value)
      p.setNewInitialValues()

      document.body.removeChild(menuBG)
      drawScene(mainGrid, ctx, mainCam, ConfigObject)
    }
  }
}

function editCOR() {
  ipcRenderer.send('disableMenuItem', 'changeGrav')
  ipcRenderer.send('disableMenuItem', 'editZoom')
  ipcRenderer.send('disableMenuItem', 'editWall')
  ipcRenderer.send('disableMenuItem', 'editCOR')
  ipcRenderer.send('disableMenuItem', 'editPoint')

  const menuHeight = 100

  const menuBG = document.createElement('div')
  menuBG.classList.add('menuBoxBack')
  menuBG.style.width = `auto`
  menuBG.style.height = `${menuHeight}px`
  menuBG.style.top = '50%'
  menuBG.style.left = '50%'
  menuBG.style.transform = 'translate(-50%, -50%)'
  document.body.appendChild(menuBG)

  const title = document.createElement('p')
  title.classList.add('menuBoxTitle')
  title.innerHTML = 'Edit Coefficient of Restitution'
  menuBG.appendChild(title)

  const inputDiv = document.createElement('div')
  menuBG.appendChild(inputDiv)

  const input = document.createElement('input')
  input.type = 'number'
  input.value = COR.toString()
  input.placeholder = COR.toString()
  input.classList.add('menuBoxInput')
  input.title = 'New Coefficient of Restitution'
  inputDiv.appendChild(input)

  const confirm = document.createElement('button')
  confirm.classList.add('menuBoxConfirm')
  confirm.innerHTML = 'OK'
  inputDiv.appendChild(confirm)

  confirm.onclick = () => {
    ipcRenderer.send('enableMenuItem', 'changeGrav')
    ipcRenderer.send('enableMenuItem', 'editWall')
    ipcRenderer.send('enableMenuItem', 'editCOR')
    ipcRenderer.send('enableMenuItem', 'editPoint')
    ipcRenderer.send('enableMenuItem', 'editZoom')
    COR = parseFloat(input.value)
    document.body.removeChild(menuBG)
    drawScene(mainGrid, ctx, mainCam, ConfigObject)
  }
}

function editZoom() {
  ipcRenderer.send('disableMenuItem', 'changeGrav')
  ipcRenderer.send('disableMenuItem', 'editWall')
  ipcRenderer.send('disableMenuItem', 'editCOR')
  ipcRenderer.send('disableMenuItem', 'editPoint')
  ipcRenderer.send('disableMenuItem', 'editZoom')

  const menuHeight = 100

  const menuBG = document.createElement('div')
  menuBG.classList.add('menuBoxBack')
  menuBG.style.width = `auto`
  menuBG.style.height = `${menuHeight}px`
  menuBG.style.top = '50%'
  menuBG.style.left = '50%'
  menuBG.style.transform = 'translate(-50%, -50%)'
  document.body.appendChild(menuBG)

  const title = document.createElement('p')
  title.classList.add('menuBoxTitle')
  title.innerHTML = 'Edit Camera Zoom'
  menuBG.appendChild(title)

  const inputDiv = document.createElement('div')
  menuBG.appendChild(inputDiv)

  const input = document.createElement('input')
  input.type = 'number'
  input.value = mainCam.zoom.toString()
  input.placeholder = mainCam.zoom.toString()
  input.classList.add('menuBoxInput')
  input.title = 'New Zoom'
  inputDiv.appendChild(input)

  const confirm = document.createElement('button')
  confirm.classList.add('menuBoxConfirm')
  confirm.innerHTML = 'OK'
  inputDiv.appendChild(confirm)

  confirm.onclick = () => {
    ipcRenderer.send('enableMenuItem', 'changeGrav')
    ipcRenderer.send('enableMenuItem', 'editWall')
    ipcRenderer.send('enableMenuItem', 'editCOR')
    ipcRenderer.send('enableMenuItem', 'editZoom')
    ipcRenderer.send('enableMenuItem', 'editPoint')
    mainCam.zoom = parseFloat(input.value)

    if(controller.selectedPoint) {
      mainCam.x = (controller.selectedPoint.x * mainCam.zoom - canvas.width / 2)
      mainCam.y = (controller.selectedPoint.y * mainCam.zoom - canvas.height / 2)
    }

    document.body.removeChild(menuBG)
    drawScene(mainGrid, ctx, mainCam, ConfigObject)
  }
}