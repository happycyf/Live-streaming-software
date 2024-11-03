<style >
.chat-item{
    display: inline-block;
    margin-top: 10px;
    padding: 5px 10px;
    margin-bottom: 10px;
    line-height: 30px;
    text-align: center;
    height: 30px;
    background-color: rgb(33, 81, 83);
    border-radius: 5%;
    animation: moveRight 2s 1;
    
}
@keyframes moveRight {
  from {
    transform: translateX(-100px);
  }
  to {
    transform: translateX(0px);
  }
}
.chat-item-right{
    margin-top: 10px;
    padding: 5px 10px;
    margin-bottom: 10px;
    line-height: 30px;
    text-align: center;
    /* display: inline-block; */
    float: right;
    height: 30px;
    background-color: rgb(33, 66, 83);
    border-radius: 5%;
    animation: moveLeft 2s 1;
}
@keyframes moveLeft {
  from {
    transform: translateX(100px);
  }
  to {
    transform: translateX(0px);
  }
}
.chat-timeCss{
    color: rgb(226, 223, 4);
    font-size: 18px;
}
.chat-userCss{
    color: red;
    font-size: 18px;
}
.chat-message{
    color: yellowgreen;
    
}
</style>
<template >
   <el-row >
        <el-col :span="14">
            <div style="height: 40px;">
                <el-row>
                    <el-col :span="6">时长:{{ time}}</el-col>
                  <el-col :span="6"><i><el-icon><Avatar /></el-icon></i>热度：{{ people.popularity }}</el-col>
                  <el-col :span="6">粉丝数: {{ people.fans }}</el-col>
                  <el-col :span="6">直播间标题:{{ people.title }}</el-col>
                </el-row>
                
            </div>
            <!-- 直播视频区域 -->
            <div style="height: 500px; width: 100%;">
                <video autoplay ref="liveVideo" muted   style="height: 100%; width: 100%; " ></video>
            </div>
            <!-- 直播下面 -->
             <el-row style="margin-top: 15px;">
                <el-col :span="5" :offset="11" >
                    <label for="isMike"><el-text type="primary">开启录音</el-text></label>
                    <el-switch v-model="isMike" id="isMike"></el-switch>
                </el-col>
                <el-col :span="5"  >
                    <label for="isCamera"><el-text type="primary">开启摄像头</el-text></label>
                    <el-switch v-model="isCamera" id="isCamera"></el-switch>
                </el-col>
                <el-col :span="3" >
                    <el-button :type="floag? 'primary' :'danger'" v-text="floag ? '开启直播' : '暂停直播'"  @Click="floag ? startLiveDialog=true : startLive()"  ></el-button>
                </el-col>
                <el-dialog v-model="startLiveDialog" title="基本配置" width="500" center>
                    <span>
                        
                            <el-form-item label="标题:">
                                <el-input type="text" v-model="upload_anchor.title" maxlength="10" show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item label="开播描述:">
                                <el-input type="textarea" maxlength="40" v-model="upload_anchor.describe" show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item label="封面：" >
                                <el-upload
                                    ref="coverUploadRef"
                                    drag
                                    action="http://localhost:8080/live/uploadAnchorMap"
                                    :data=upload_anchor
                                    :on-success="upload_anchor_success"
                                    :auto-upload="false"
                                    :with-credentials="true"
                                    limit=1
                                    accept=".jpg,.png,.jpeg"
                                    style="width: 100%;"
                                    :on-change="upload_anchor_file_changer"
                                    
                                    :on-error="()=>{ElMessage.error('上传失败') ;startLiveDialog=false}"
                                >
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">
                                        拖入直播封面或<em>点击直接上传</em>
                                    </div>
                                    <template #tip>
                                    <div class="el-upload__tip">
                                        图片格式支持（jpg/png）且大小不超过500kb
                                    </div>
                                    </template>
                                </el-upload>
                            </el-form-item>
                    </span>
                    <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="startLiveDialog= false">关闭</el-button>
                        <el-button type="primary" @click="start_Upload_anchor">
                            开始直播
                        </el-button>
                    </div>
                    </template>
                </el-dialog>
             </el-row>
        </el-col>
        <el-col :span="8" :offset="2">
            <!-- 聊天区头部 -->
            <el-tabs type="border-card" class="demo-tabs" style="border: 1px solid black;height: 35rem;">
                <!-- 聊天室部分 -->
                <el-tab-pane label="聊天室" >
                    <!-- 滚动条 -->
                    <el-scrollbar height="26.8rem" ref="chatRef" >
                        <div ref="chatInnerRef"v-for="item in charList">
                            <!-- 聊天内容 -->
                            <div v-html="item" >
                                
                            </div>
                        </div>
                    </el-scrollbar>
                     <!-- 发送提示部分 -->
                     <el-row style="padding: 13px;" v-if="comment">
                        <el-col :span="16">
                            <el-input v-model="commentText" type="text" placeholder="请输入评论"  show-word-limit maxlength="20"/>
                        </el-col>
                        <el-col :span="8" align="right">
                            <el-button type="primary"  @click="sendChat">发送</el-button>
                        </el-col>
                    </el-row>
                    
                </el-tab-pane>
                <!-- 粉丝榜部分 -->
                <el-tab-pane  >
                    <template #label>
                        <span @click="getFenSi">粉丝榜</span>
                    </template>
                        <el-table :data="FenSiTableData" style="width: 100%" max-height="500px">
                            <el-table-column fixed prop="uName" label="粉丝名"  />
                            <el-table-column prop="monetary" label="总金额"  />
                        </el-table>          
                </el-tab-pane>
                <el-tab-pane  >
                    <template #label>
                        <span @click="getToDayMoney">今日礼物榜</span>
                    </template>
                    <el-table :data="ToDayMoneyData" style="width: 100%" max-height="500px">
                            <el-table-column fixed prop="uName" label="粉丝名"  />
                            <el-table-column prop="giftMoney" label="总金额"  />
                        </el-table> 
                </el-tab-pane>
            </el-tabs>
            
        </el-col>
   </el-row>
   
</template>

<script setup>
import { ElMessage } from 'element-plus';
import {  onMounted, reactive, ref,getCurrentInstance} from 'vue';
import {onBeforeRouteLeave } from 'vue-router';
    let {proxy} =getCurrentInstance()
    let ws =null
    // 是否允许发送消息
    let isSendChat=true
    let people=reactive({
        // 热度
        popularity:0,
        // 粉丝数
        fans:0,
        // 直播间标题
        title:"",
        // 直播描述
        describe:"",
        // 直播间封面
        cover:""
    })
    // 上传主播信息
    let upload_anchor=reactive({
        // 直播间标题
        title:"",
        // 直播描述
        describe:"",
        // 直播间封面
        coverName:"",
        // 推流密钥
        tKey:''
    })
    // 捕获视频播放位置
    let liveVideo=ref()
    // 是否开启麦克风
    let isMike=ref(true)
    // 是否开启摄像头
    let isCamera=ref(true)
    // true为开启直播
    let floag =ref(true)
    // 视频流存放处
    let stream={}
    // 推流地址 测试地址
    let url =""
    // 建立Rtc连接
    let pc = null
    // 直播基本配置的弹窗
    let startLiveDialog=ref(false)
    // 评论
    let commentText=ref("")
    // 评论区部分
    let comment=ref("true")
    // 粉丝榜数据
    let FenSiTableData=ref([])
    // 今日礼物榜数据
    let ToDayMoneyData=ref([])
    
    // 开播时长
    let time =ref("00:00:00");
    // 开播定时器
    let timerInterval;
    // 聊天区滚动条内容
    let chatInnerRef= ref()
    // 聊天区域滚动条
    let chatRef= ref()
    let charList=ref([]);
    // 主播基本信息上传
    let coverUploadRef=ref()
    let sendChatUser=null;
    let startDate=null
    const eventWs=(tKey)=>{
        ws=new WebSocket("ws://localhost:8080/liveWebSocket/"+tKey)
            ws.onopen=(resp)=>{
                console.log("连接成功")
            }
            ws.onmessage=(resp)=>{
            let data=null;
            if (typeof resp.data =='string') {
                data=JSON.parse(resp.data)    
            }else{
                data=resp.data
            }
            console.log(data);
        
            // 如果不是添加与删除的指令那就是聊天信息
            if (data.instruction=="null") {
                let now =new Date(data.sendTime)
                charList.value.push(
                `<div class="chat-item">
                                <span class="chat-timeCss">${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}  </span>  
                                    <span class="chat-userCss">&nbsp; ${data.sendUserName}说：</span>
                                    <span class="chat-message">${data.message}</span> 
                            </div>`)
                // console.log(charList.value);
                
            }else if (data.instruction=='add') {
                people.popularity+=1
            }else if(data.instruction=='sub'){
                if(people.popularity!=0){
                    people.popularity-=1
                }
            }else if(data.instruction=='gift'){
                
                
                let now =new Date(data.sendTime)
                charList.value.push(
                `<div class="chat-item">
                                <span class="chat-timeCss">${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}  </span>  
                                    <span class="chat-userCss">&nbsp; ${data.sendUserName}  :</span>
                                    <span class="chat-message" style="color=green">${data.message}</span> 
                           </div>`)
            }
            }
            
            ws.onerror=(resp)=>{
                    ElMessage.error("系统异常")
                    isSendChat=false
            }
            ws.onsuccess=(resp)=>{
                    isSendChat=true
            }
            ws.onclose=()=>{
                console.log("主播端关闭");
                
            }
    }
    onMounted(()=>{
        proxy.$http({
            url:'/live/getUserFanAndUKey',
            method:'get',
            
        }).then(resp=>{ 
            people.fans=resp.data.fans
            eventWs(resp.data.tKey)
            // 这里更改服务器地址
            url+="https://192.168.10.128:1990/rtc/v1/whip/?app=live&stream="+resp.data.tKey
            
        })
            
    })
    document.addEventListener("beforeunload",()=>{
        ws.close()
    })
    
    // 发送弹幕
    const sendChat=async ()=>{    
        
        if (!isSendChat) {
            ElMessage.error("网络异常")
            return
        }

        
        // // 确定是最后
        // chatRef.value.setScrollTop(chatRef.value.wrap.offsetHeight)
        
        if (sendChatUser==null) {
            // 获取发送者信息
            await proxy.$http({
                method:'get',
                url:"/live/getLoginPojo",
                }).then(resp=>{
                  sendChatUser=resp.data
                }).catch(err=>{
                ElMessage.error("获取用户信息失败")
            })
        }
            sendChatUser.sendTime=new Date().getTime()
        
        if(commentText.value!=""){    
            sendChatUser['message']=commentText.value
            // 发送消息使用
            sendChatUser['instruction']=null
            console.log(sendChatUser);
            
            ws.send(JSON.stringify(sendChatUser))
            let now =new Date()
            charList.value.push(`<div class="chat-item-right">
                               <span class="chat-timeCss">${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()} </span>  
                                <span class="chat-userCss">&nbsp; 我说：</span>
                                <span class="chat-message">${commentText.value}</span> 
                           </div>`
            )



            commentText.value=""
        }
    }
    // 获取前一百费用最高的粉丝
    const getFenSi=()=>{
        FenSiTableData.value=[]
        proxy.$http({
            url:'/live/getFenSi',
            method:'get',
        }).then(resp=>{
            let FensiList = resp.data
            for(let i =0 ;i<FensiList.length;i++){
                // 拿到json对象进行赋值
               let userFenSi= {
                    'uName':FensiList[i]['uName'],
                    'monetary':FensiList[i]['monetary']+"￥"
               }
               FenSiTableData.value.push(userFenSi)
            }   
        })
    }
    // 获取前一百礼物最高榜
    const getToDayMoney=()=>{
        ToDayMoneyData.value=[]
        proxy.$http({
            url:'/live/getTodayMoneyBang',
            method:'get',
        }).then(resp=>{
            let ToDayMoneyList = resp.data
            for(let i =0 ;i<ToDayMoneyList.length;i++){
                // 拿到json对象进行赋值
               let userToDayMoney= {
                    'uName':ToDayMoneyList[i]['uName'],
                    'giftMoney':ToDayMoneyList[i]['giftMoney']+"￥",
               }
               ToDayMoneyData.value.push(userToDayMoney)
            }
        })
    }
    // 停止流
    const stopStream=(e)=>{
        
                e.getTracks().forEach(track => {
                  track.stop(); // 停止所有轨道
                });
                e = null;
        
    }
    // 进行直播时间计时
    const getTimeLive=()=>{
        timerInterval=setInterval(()=>{ 
                // 获取直播时间
                let timer=time.value.split(":")
                let hours=timer[0]
                let minutes=timer[1]
                let seconds=timer[2]
                seconds++
                if (seconds>=60) {
                    seconds=0
                    minutes++
                    if (minutes>=60) {
                        minutes=0
                        hours++
                    }
                }
                time.value=`${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
            },1000)
    }
    // 开启录制
    const startLive=async ()=>{    
          
        // 判断是否是开启直播
        if(floag.value){    
            // 开播情况
            //判断是否开启摄像头
            if (isCamera.value) {
                window.getLive.StartCamera()
            }
            plushLive(isMike.value)
            let date=new Date()
            startDate =date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
        }else{
           if (stream!={}) {
                for(let sm in stream){
                    stopStream(stream[sm])
                }
            if (isCamera.value) {
                window.getLive.closeCamera()              
            }
                stream={}
                pc.close();
                pc=null;
                clearInterval(timerInterval)
                let date=new Date()
                let overTime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+" "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
                // 这里提交直播时长
                proxy.$http({
                    url:'/live/addLiveTime',
                    method:'get',
                    params:{
                        "liveTitle":people.title,
                        "startTime":startDate,
                        "overTime":overTime
                    }
                }).then(resp=>{
                    ElMessage.success("直播结束")
                }).catch(err=>{
                    ElMessage.error("直播结束失败")
                })
           }
           liveVideo.value.srcObject=null
        }
        // 切换直播状态
        floag.value=!floag.value
    }
    
    /**
     * 
     * @param isMike 是否开启麦克风
     */
    // 开始直播
    const plushLive=async (isMike)=>{
        // 整个屏幕的视频源
        const sourceId=await window.getLive.stream()
        // 存放视频流
        let constions={ 
            video: {
                    mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height,
                    },
                },}
      
        
        
        pc=new RTCPeerConnection(null)
          // 开启麦克风的情况下
          if(isMike){
            try{
                // 捕获麦克风
                stream.audioStream=await navigator.mediaDevices.getUserMedia({
                    audio:true
                    })
                      // 添加麦克风音轨
                    stream.audioStream.getTracks().forEach(track=>{
                        pc.addTrack(track)
                    })
            }catch(err){
                // 控制台报错并停止
                console.log(err);
                return   
            }
            
        }else{
            // 麦克风关闭的情况下捕获屏幕+音频
            constions.audio={
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    },
            }
        }
        
        try{
            // 捕获屏幕和立体声
            stream.videoStream = await navigator.mediaDevices.getUserMedia(constions);
            stream.videoStream.getTracks().forEach(track=>{
            pc.addTrack(track)
            })
        }catch(err){
            ElMessage.error("捕获屏幕和立体声出问题了！！")
            return
        }
            // 进行视频预览
            liveVideo.value.srcObject=stream.videoStream

        // 创建offer
        let offer =await pc.createOffer()
        await pc.setLocalDescription(offer)
        // 交换信令 此处借鉴了srs.sdk.js
         // 发送offer
         const answer = await new Promise(function (resolve, reject) {
            // 控制台打印信令offer
            console.log(`Generated offer: ${offer.sdp}`);
            // 建立xhr请求
            const xhr = new XMLHttpRequest();
            // 当xhl读取时进行处理
            xhr.onload = function() {
                if (xhr.readyState !== xhr.DONE) return;
                if (xhr.status !== 200 && xhr.status !== 201) return reject(xhr);
                const data = xhr.responseText;
                console.log("Got answer: ", data);
                return data.code ? reject(xhr) : resolve(data);
            }
            // 发送offer
            xhr.open('POST', url, true);
            // 请求头设置为sdp
            xhr.setRequestHeader('Content-type', 'application/sdp');
            // 发送
            xhr.send(offer.sdp);
        });
        
        // 设置远端描述
        // await pc.setRemoteDescription(
        //     // answer
        //     new RTCSessionDescription({type: 'answer', sdp: answer})
        // );
        
        await pc.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: answer
        }));
        // 开启计时
        getTimeLive();

    }
    // 通过更改拿项目名
    const upload_anchor_file_changer=(file)=>{
        
        upload_anchor.coverName=file.name
    }
    // 上传主播封面成功
    const upload_anchor_success=(res)=>{
                    if (res) { 
                        people.title=upload_anchor.title
                        startLive()                        
                    }else{
                       ElMessage.error('上传失败!!服务器错误')
                       }
                    //    进行隐藏
                        startLiveDialog.value=false
                     }
    
    // 开启直播前先进行基本信息上传上传成功给予开播
    const start_Upload_anchor=()=>{

            if (url=="") {
                return ElMessage.error("直播地址不能为空")
            }
                // 第一次裁切
               let urlSplit1= url.split("/")
            //    第二次裁切获得最后一段的裁切 如 ?app=live,stream=lv
               let urlSplit2= urlSplit1[urlSplit1.length-1].split("&")
            //    最后一次裁切
                let urlSplit3=urlSplit2[urlSplit2.length-1].split("=")
                // 得到地址
                upload_anchor.tKey=urlSplit3[1]     
            // 基础判断
            if(upload_anchor.title==""){
                ElMessage.error("直播标题不能为空")
                return
            }else if(upload_anchor.describe==""){
                ElMessage.error("直播描述不能为空")
                return
            }else if(upload_anchor.cover==""){
                ElMessage.error("直播封面不能为空")
                return
            }
            // 进行页面上传
            coverUploadRef.value.submit()
    }
    // 取消挂载前把最后时长提交上去
    onBeforeRouteLeave(()=>{
        if (stream!={}) {
                for(let sm in stream){
                    stopStream(stream[sm])
                }
                stream={}
                if(pc!=null){
                    pc.close();
                    if (isCamera.value) {
                        window.getLive.closeCamera()              
                    }
                    pc=null;
                    clearInterval(timerInterval)
                }
        }
        // 提交时间
        if (time.value!="00:00:00") {
                console.log(startDate);
            
                let date=new Date()
                let overTime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+" "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
                // 这里提交直播时长
                proxy.$http({
                    url:'/live/addLiveTime',
                    method:'get',
                    params:{
                        "liveTitle":people.title,
                        "startTime":startDate,
                        "overTime":overTime
                    }
                }).then(resp=>{
                    ElMessage.success("直播结束")
                }).catch(err=>{
                    ElMessage.error("直播结束失败")
                })  
        }
    })
</script>
