<template>
    <div class="loginBg">
        <!-- 这是一个注册页面 -->
        <el-card style="width: 500px;height: 570px;margin-left: auto; margin-right: auto;margin-top: 5%;"  >
                <template #header>
                <div class="card-header">
                    <h2 style="text-align: center;">注册</h2>
                </div>
                </template>
                <!-- 这是一个注册页面 -->
                <el-form 
                    ref="registerForm"
                    v-show="!isSuceesShow" 
                    :rules="registerRulus"
                    :model="registerUser"
                >
                <el-form-item label="昵称：" prop="uName">
                    <el-input v-model="registerUser.uName" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                    <el-radio-group v-model="registerUser.sex" class="ml-4">
                        <el-radio value="男" size="large">男</el-radio>
                        <el-radio value="女" size="large">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <el-form-item label="地址：" prop="adress">
                    <el-input v-model="registerUser.adress" placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="phone">
                    <el-input v-model="registerUser.phone" placeholder="请输入手机号"
                    :formatter="(value) => value.replace(/[^0-9]/g, '')"
                    :parser="(value) => value.replace(/[^0-9]/g, '')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="验证码：" prop="registerYZM">
                        <el-input v-model="registerUser.registerYZM" placeholder="请输入验证码" >
                        <template #append>
                            <el-button v-if="isSendingflog" @click="sendYzm" :disabled="registerUser.phone.trim() == 0">发送验证码</el-button>
                            <el-button v-else>{{ YzmTime }}s</el-button>
                        </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="pwd">
                        <el-input v-model="registerUser.pwd" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="再输入一次密码：" prop="pwd2">
                        <el-input v-model="pwd2" placeholder="请再输入一次密码"  ></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="isImgShow=true">
                        上传头像
                    </el-button>
                    <el-row>
                        <el-col :span="4" :offset="6"><el-button @click="returnLogin"  type="primary"> 返回登录</el-button></el-col>
                        <el-col :span="4" :offset="2"><el-button type="primary" @click="uploadUser(registerForm)" >注册</el-button></el-col>
                        </el-row>
                    
                </el-form>
                <el-result
                icon="success"
                title="注册成功"
                
                v-show="isSuceesShow"
            >
                <template #sub-title>
                    <i>您的账号为 {{  registerUser.account  }}</i>
                </template>
                <template #extra>
                <el-button type="primary" @click="returnLogin">去登录</el-button>
                </template>
        </el-result>
            </el-card>

        <!-- 上传头像问题 -->
        <el-drawer v-model="isImgShow" direction="btt" size="50%">
                <h4>上传头像</h4>
                    <tl ref="tle"/>
                <!-- <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelClick">完成</el-button>
                    <el-button @click="cancelClick">关闭</el-button>
                </div>
                </template> -->
        </el-drawer>
    </div>
</template>
<script setup>
import {reactive,ref,defineEmits,getCurrentInstance} from 'vue'
 import tl from './Tailoring2.vue'
import { ElMessage} from 'element-plus';
    let {proxy} =getCurrentInstance()
    let registerForm =ref()
// 注册用户信息
    let registerUser=reactive({
        account:"12345678912",
        phone:'',
        pwd:'',
        sex:'男',
        uName:'',
        adress:'',
        img:'',
        registerYZM:''
    })
    // 在输入一次密码密码
    let pwd2=ref()
    // 裁剪的问题
    let tle=ref()
    // 是否显示图片
    let isImgShow=ref(false)
    // 是否成功显示
    let isSuceesShow=ref(false)
    // 是否允许发送验证码
    let isSendingflog=ref(true)
    // 允许发送时间
    let YzmTime=ref(60)
    let userConfig =defineEmits(["userconfig"])
  
    // 注册规则
let registerRulus=reactive({
    uName:[
        {
                required:true,
                trigger:'change',
                message: "昵称不能为空",
                
                informType: 'warning',
        }
    ],
    adress:[
        {
                required:true,
                trigger:'change',
                message: "地址不能为空",
                
                informType: 'warning',
        }
    ],
    phone:[
        {
                required:true,
                trigger:'change',
                message: "手机号不能为空",
                
                informType: 'warning',
        }
    ],
    registerYZM:[
        {
                required:true,
                trigger:'change',
                message: "验证码不能为空",
                
                informType: 'warning',
        }
    ],
    pwd:[
        {
                required:true,
                trigger:'change',
                message: "密码不能为空",
                
                informType: 'warning',
        }
    ],
    pwd2:[
        {
            validator:pwdEqPwd2,
            trigger:'change'
        }
    ]
    
})
// 新密码判断
function pwdEqPwd2(rule, value, callback){
        if(registerUser.pwd !=pwd2.value){
           return callback(new Error('两次密码不一致'))
        }
        callback()
    }

// 返回登录页面
function returnLogin(){
    isSuceesShow.value=false
    userConfig.value='login'
    Object.assign(registerUser,{
        account:"12345678912",
        phone:'',
        pwd:'',
        sex:'男',
        uName:'',
        adress:'',
        img:'',
        registerYZM:''
    })
    pwd2.value=''
    
    proxy.$router.push('/')
}
// 发送验证码
let sendYzm=()=>{
    // 手机号是否正确
    if(registerUser.phone.trim().length!=11){
        ElMessage.error('手机号格式不正确')
        return
    }
    proxy.$http({
        method:'post',
        url:'/login/sendYzm',
        data:{
            phone:registerUser.phone
        }
    }).then((resp)=>{
            let message=resp.data.SendMessage
            if (resp.data.SendState=='success') {
                ElMessage.success(message)
                isSendingflog.value=false
                // 倒计时
                const countdown= setInterval(()=>{
                    YzmTime.value--
                    if(YzmTime.value==-1){
                        isSendingflog.value=true
                        YzmTime.value=60
                        clearInterval(countdown)
                    }
                },1000)
            }else{
                ElMessage.error(message)
            }
        }).catch(()=>{
            ElMessage.error("网络异常")
        })

    
}
    // 上传注册
const uploadUser =async (formEl)=>{
    if(!formEl)return
    await formEl.validate((valid, fields) => {
            if (valid) {
                // 选择头像与否
                if (tle.value.avatar.length==0) {
                    ElMessage.error('请选择头像')    
                }else{
                //    有头像
                    if(!tle.value.avatar){
                        ElMessage.error('请选择头像')
                    }else{
                        // 图片文件
                        let avatar =convertBase64UrlToBlob(tle.value.avatar)
                        let fm =new FormData()
                        for(let key in registerUser){
                            fm.append(key,registerUser[key])
                        }
                        fm.append("avatar",avatar)
                        proxy.$http({
                            method:'post',
                            url:"/login/uploadRegister",
                            headers: {
                                "Content-Type": "multipart/form-data",
                                },
                            data:fm
                        }).then((resp)=>{
                            console.log(resp.data.registerState=='success');
                            // 成功
                            if (resp.data.registerState=='success') {
                                ElMessage.success(resp.data.registerMessage)
                                registerUser.account=resp.data.registerAccount
                                // 显示成功
                                isSuceesShow.value=true
                            }else{
                                ElMessage.error(resp.data.registerMessage)
                            }
                        }).catch(()=>{
                            ElMessage.error("网络异常")
                        })
                    }
                }
            } else {
                ElMessage.error('请输入参数')
            }
        })
        
}
//base64转Blob
function convertBase64UrlToBlob(urlData){
  //去掉url的头，并转换为byte 
  var split = urlData.split(',');
  var bytes=window.atob(split[1]);        
  //处理异常,将ascii码小于0的转换为大于0  
  var ab = new ArrayBuffer(bytes.length);  
  var ia = new Uint8Array(ab);  
  for (var i = 0; i < bytes.length; i++) {  
    ia[i] = bytes.charCodeAt(i);  
  }
  return new Blob( [ab] , {type : split[0]});  
}
</script>
