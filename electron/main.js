
const { app, BrowserWindow,ipcMain,desktopCapturer,screen, dialog,session} = require('electron')
const express = require('express')

const path = require('path')
// 是否是开发环境
const NODE_ENV=false

const appExpress=express()
if(!NODE_ENV){
  appExpress.use((req, res, next) => {
    const userAgent = req.headers['user-agent'];
    if (userAgent && userAgent.includes('Electron')) {
      next(); // 允许请求继续
    } else {
      res.status(403).send('Forbidden'); // 禁止访问
    }
  });
  appExpress.use(express.static(path.join(__dirname, '../dist')))
  appExpress.listen(3001)

  
}
app.on('ready', () => {     
 
      let mainWindow=new BrowserWindow({
        width: screen.getPrimaryDisplay().workAreaSize.width,
        height: screen.getPrimaryDisplay().workAreaSize.height,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          // 允许在页面中使用摄像头等设备
          enableRemoteModule: true,
          preload: path.join(__dirname, 'preload.js')
        }
      })
      
     mainWindow.webContents.session.trustAnonImporters =true
      
       // 清除 DNS 缓存
      mainWindow.webContents.session.clearHostResolverCache(() => {
        console.log('DNS cache cleared');
      });
      // 主窗口开启
      mainWindow.loadURL( 'http://localhost:3001/index.html')
      mainWindow.on('closed',()=>{
        app.quit()
        mainWindow=null
      })
})

// 在主进程中设置
app.commandLine.appendSwitch('ignore-certificate-errors')
// 获取整个屏幕源
    const gsc = async ()=>{ 
      let sources = await desktopCapturer.getSources({ types: ['window', 'screen'] })
      
      for(let source of sources ){
        
        if(source.name === '整个屏幕'){
            return source.id
        }            
      }
    }

    ipcMain.handle('getLive',gsc)
    // 摄像头页面
    let CameraWindow =null;
    // 开启摄像头窗口
    const StartCamera=async ()=>{
      console.log(!CameraWindow);
      
      if(!CameraWindow){
        CameraWindow = new BrowserWindow({
          width: 300,
          height: 400,
          alwaysOnTop:true,
          x:screen.getPrimaryDisplay().workAreaSize.width-300,
          y:screen.getPrimaryDisplay().workAreaSize.height-400,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            // 允许在页面中使用摄像头等设备
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
          },
          frame:false,
          transparent:true,
          
        })
        CameraWindow.on('closed',()=>{
          CameraWindow = null
        })
      }else{
        CameraWindow.show()
      }
      // 避免打包后拿不到
      CameraWindow.loadURL(`file://${path.join(__dirname, '../Camera.html')}`)
    }
    ipcMain.handle('startCamera',StartCamera)
    // 关闭摄像头窗口
    ipcMain.handle('closeCamera',()=>{
      if(CameraWindow){
        CameraWindow.close()

      }
      CameraWindow = null
    })
 