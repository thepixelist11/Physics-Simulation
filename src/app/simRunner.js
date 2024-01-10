"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function runSim(simFile, timeToRun, ts = 0.01667, dataCollectInterval = 100) {
    return __awaiter(this, void 0, void 0, function* () {
        loadSimulation(simFile);
        let data = {
            gravity: gravity,
            COR: COR,
            timeStamps: [0]
        };
        for (let i = 0; i < mainGrid.points.length; i++) {
            const p = mainGrid.points[i];
            data[`p${i}`] = {
                x: [p.x / pxPerM],
                y: [p.y / pxPerM],
                xVel: [p.velocity.x / pxPerM],
                yVel: [p.velocity.y / pxPerM],
                radius: p.radius / pxPerM,
                mass: p.mass,
            };
        }
        let totalTime = 0;
        let timeSinceCollection = 0;
        disableMenuFunctionality();
        controller.canPlacePoint = false;
        loopPhysics = true;
        // Main loop
        //@ts-ignore
        return new Promise((res) => {
            const loop = setInterval(() => {
                if (canDrawScene)
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < Math.ceil((FPS * 1000) / (ts * 1000)); i++) {
                    if (!simulationPaused) {
                        updatePoints(ts / 1000, mainGrid, pxPerM);
                        if (timeSinceCollection >= dataCollectInterval) {
                            timeSinceCollection = 0;
                            for (let j = 0; j < mainGrid.points.length; j++) {
                                const p = mainGrid.points[j];
                                data[`p${j}`].x.push(p.x / pxPerM);
                                data[`p${j}`].y.push(p.y / pxPerM);
                                data[`p${j}`].xVel.push(p.velocity.x);
                                data[`p${j}`].yVel.push(p.velocity.y);
                            }
                            data.timeStamps.push(totalTime);
                        }
                        if (totalTime >= timeToRun) {
                            loopPhysics = false;
                            stopPhysics();
                            clearInterval(loop);
                            res(data);
                        }
                        // Increment time
                        totalTime += ts;
                        timeSinceCollection += ts;
                    }
                }
                drawScene(mainGrid, ctx, mainCam, ConfigObject);
            }, FPS);
        });
    });
}
function runAllSims(dirPath, timeToRun, ts = 16.67, dataCollectInterval = 10) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirList = fs.readdirSync(dirPath);
        let data = {};
        for (let i = 0; i < dirList.length; i++) {
            if (path.extname(dirList[i]) !== '.simsave')
                continue;
            const name = path.basename(dirList[i]);
            console.log(name);
            data[name] = yield runSim(path.join(dirPath, dirList[i]), timeToRun, ts, dataCollectInterval);
        }
        return data;
    });
}
// Data format
// Sim
//   Gravity
//   COR
//   Points
//     Properties
function toCSV(obj) {
    let csv = [];
    let names = [];
    for (const simName in obj) {
        const sim = obj[simName];
        const nameMatches = /^(.*)\.simsave$/.exec(simName);
        const name = nameMatches ? nameMatches[1] : '';
        const gravity = sim.gravity.y;
        const COR = sim.COR;
        names.push(name);
        csv.push(`Name:,${name}\r\nGravity:,${gravity}m/s^2\r\nCOR:,${COR}\r\nPOINTS,TIME (s),X VELOCITY (m/s),Y VELOCITY (m/s),X POSITION (m),Y POSITION (m)\r\n`);
        let lines = [];
        for (let i = 0; true; i++) {
            if (!sim[`p${i}`])
                break;
            lines.push(`P${i},`);
            for (let j = 0; j < sim.timeStamps.length; j++) {
                const time = (sim.timeStamps[j] / 1000).toPrecision(3).toString();
                const xVel = sim[`p${i}`].xVel[j].toPrecision(3).toString();
                const yVel = sim[`p${i}`].yVel[j].toPrecision(3).toString();
                const x = sim[`p${i}`].x[j].toPrecision(3).toString();
                const y = sim[`p${i}`].y[j].toPrecision(3).toString();
                if (j === 0) {
                    lines[lines.length - 1] = lines[lines.length - 1].concat(`${time},${xVel},${yVel},${x},${y}\r\n,`);
                }
                else {
                    lines.push(`${time},${xVel},${yVel},${x},${y}\r\n,`);
                }
            }
        }
        for (let i = 0; i < lines.length; i++) {
            csv[csv.length - 1] = csv[csv.length - 1].concat(lines[i]);
        }
    }
    return csv.join('\r\n\r\n');
}
function runFullTest(filePath, timeToRun, ts = 16.67, dataCollectInterval = 10) {
    runAllSims(filePath, timeToRun, ts, dataCollectInterval)
        .then(res => {
        const csv = toCSV(res);
        fs.writeFileSync(path.join(__dirname, `Data.csv`), csv);
    });
}
