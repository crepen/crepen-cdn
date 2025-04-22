import path from 'path';
import process from 'process';
import fs from 'fs-extra';
import childProcess from 'child_process';

// Project path under packages path

const MAIN_PATH = path.join(process.cwd(), '../../');
const PROJECT_PATH = process.cwd().replace(MAIN_PATH, '');


/**
 * 
 * @param {string | undefined} text 
 * @param {Array | undefined} colorArray 
 * @param {number | undefined} timestamp
 */
const writeConsole = (text, colorArray, isLastReset , timestamp) => {
    const firstArr = (colorArray ?? []).length < 1 ? '0' : colorArray[0];
    const secondArr = (colorArray ?? []).length < 2 ? '0' : colorArray[1];
    process.stdout.write(`\r\x1b[${firstArr}m${text ?? ''}\x1b[${secondArr}m`)
    
    if (typeof isLastReset === 'boolean' && isLastReset === true) {
        colorReset();
    }
    process.stdout.moveCursor(-9999);
    process.stdout.moveCursor(100);
    if(timestamp !== undefined && typeof timestamp === 'number'){
        process.stdout.write(`     \x1b[${34}m${'['+timestamp+'s]'}\x1b[${0}m            `)
        
    }
}

const colorReset = () => { writeConsole() }

const getDistDir = () => {
    const argsDirArray = process.argv.filter(x=>x.match(/--dir=(.*"?)/g));
    const argsDir = argsDirArray.length !== 0 ? argsDirArray[0].replaceAll('--dir=','').replaceAll('\'','')  : undefined;
    return path.join(argsDir === undefined ? process.cwd() : argsDir , 'dist');
}

const helpConsole = () => {
    colorReset();
    const argsArray = process.argv.filter(x=>x.match(/--help/g));

    if(argsArray.length !== 0){
        writeConsole('ℹ️  Command List\n')
        writeConsole('  • --dir=[dist dir]\t\tSet dist directory\n');
    }
    

    return argsArray.length === 0 ? false : true;
    
}

const processPhase = (displayText, runProcess) => new Promise(async (resolve, reject) => {
   
    let loadLoopIndex = 0;
    const loadIcon = ['⋯','⋱','⋮', '⋰'];

    const startTime = Date.now();

    writeConsole(`• ${displayText}`, undefined , undefined , (Date.now() - startTime)/1000)


    const loadInterval = setInterval(() => {
        writeConsole(`\r${loadIcon[loadLoopIndex++]}` , undefined , undefined , (Date.now() - startTime)/1000);
        loadLoopIndex %= loadIcon.length;
    }, 50)

    Promise.allSettled([runProcess])
        .then(res => {
            clearInterval(loadInterval);

            if (res[0].status === 'fulfilled') {
                writeConsole('\r•', [32, 89]);
                colorReset();
                console.log();
                resolve();
            }
            else {
                writeConsole('\r•', [31, 89]);
                colorReset();
                console.log();
                writeConsole(` - ${res[0].reason}`, [31, 89] );
                colorReset();
                reject();
                process.exit(-1);

            }
        })
        .catch(err => {
            writeConsole('\r•', [31, 89]);
            colorReset();
            console.log();
            writeConsole(` - ${res[0].reason}`, [31, 89]);
            colorReset();
            reject();
            process.exit(-1);
        })
});


const Main = async () => {

    writeConsole('\nNextJS Publish\n\n', [32, 89], false);
    


    try {
        if(helpConsole()) return 0;
       
        const nextPath = path.join(process.cwd(), '.next');
        const distPath = getDistDir();

        if (fs.pathExistsSync(nextPath)) {
            await processPhase('🪣  Clean next directory', new Promise(async (resolve, reject) => {
                await fs.rm(nextPath, {
                    recursive: true
                })
                    .then(resolve)
                    .catch(reject)
            }))
        }


        await processPhase('💠 Build Source', new Promise(async (resolve, reject) => {
            const buildCommand = childProcess.spawn('cmd', ['/c', 'next', 'build']);

            let errorMessage = '';
            
            buildCommand.stderr.on('data', (data) => {
                errorMessage += '\n'+data;
            });
            
            buildCommand.on('close', (code) => {
            
                if(code === 0){
                    resolve();
                }
                else{
                    reject(errorMessage);
                }
               
            });
        }))


       



        if (fs.pathExistsSync(distPath)) {
            await processPhase('🪣  Clean dist directory', new Promise(async (resolve, reject) => {
                await fs.rm(distPath, {
                    // force: true,
                    recursive: true
                })
                    .then(resolve)
                    .catch(reject)
                fs.mkdir(distPath, {
                    // force: true,
                    // recursive: true
                })
                    .then(resolve)
                    .catch(reject)
            }))
        }
        else {
            await processPhase('📂 Create dist directory', new Promise(async (resolve, reject) => {
                fs.mkdir(distPath, {
                    // force: true,
                    recursive: true
                })
                    .then(resolve)
                    .catch(reject)
            }))
        }

        await processPhase('📂 Copy standalone server files', new Promise(async (resolve, reject) => {
            const serverSrcPath = path.join(process.cwd(), '.next/standalone/', PROJECT_PATH);

            fs.copy(serverSrcPath, distPath)
                .then(resolve)
                .catch(reject)
        }))

        await processPhase('📂 Copy standalone server modules', new Promise(async (resolve, reject) => {
            const modulePath = path.join(process.cwd(), '.next/standalone/', 'node_modules');

            fs.copy(modulePath, path.join(distPath, 'node_modules'), { dereference: true, overwrite: true })
                .then(resolve)
                .catch(reject)
        }))


        await processPhase('📂 Copy static files', new Promise(async (resolve, reject) => {
            const staticSrcPath = path.join(process.cwd(), '.next/static');
            const staticDistPath = path.join(distPath, '.next/static');

            fs.copy(staticSrcPath, staticDistPath)
                .then(resolve)
                .catch(reject)
            resolve();
        }))


        await processPhase('📂 Copy public files', new Promise(async (resolve, reject) => {
            const staticSrcPath = path.join(process.cwd(), 'public');
            const staticDistPath = path.join(distPath, 'public');

            fs.copy(staticSrcPath, staticDistPath)
                .then(resolve)
                .catch(reject)
            resolve();
        }))

        await processPhase('📂 Copy env files', new Promise(async (resolve, reject) => {

            fs.copy(path.join(process.cwd(), '.env'), path.join(distPath, '.env'))
                .then(res => {
                    if(fs.existsSync(path.join(process.cwd(), '.env.production'))){
                        fs.copy(path.join(process.cwd(), '.env.production'), path.join(distPath, '.env.production'))
                            .then(resolve)
                            .catch(reject)   
                    }
                })
                .catch(reject)
            resolve();
        }))


        console.log(`\n✅ Complete publish. \n - ${distPath}\n`);
    }
    catch (e) {
        console.log();
        writeConsole(`🚨 Error : ${e}\n\n`, [31, 89], true);
    }


}






Main();