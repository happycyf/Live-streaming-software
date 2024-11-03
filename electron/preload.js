const {contextBridge,ipcRenderer} =  require('electron')
contextBridge.exposeInMainWorld('getLive', {
  // 获取直播源
    "stream" : async () => {
      
      let sourceId = await ipcRenderer.invoke('getLive')
      return  sourceId
      },
    "StartCamera" : async () => {
      // 开启直播摄像头
      ipcRenderer.invoke('startCamera')
    },
    "closeCamera" : async () => {
      // 关闭直播摄像头
      ipcRenderer.invoke('closeCamera')
    }
})

