<!-- 忘记密码组件 -->
<template>
    <div class="loginBg">
        <el-card style="width: 600px;margin-left: auto; margin-right: auto;margin-top:8%;" :style="stepActive==2?'height:600px':'height: 400px'">
                <template #header>
                <div class="card-header">
                    <h2 style="text-align: center;">忘记密码</h2>
                </div>
                </template>
                <!-- 这是一个忘记密码页面 -->
                <div style="width: 600px;margin: auto;">
                    <el-steps :space="200" :active="stepActive" finish-status="success" align-center >
                        <el-step title="验证" />
                        <el-step title="修改密码" />
                        <el-step title="完成" />
                    </el-steps>
                    <!-- 验证 -->
                    <el-form style="width: 550px;margin-top: 40px" 
                        v-show="stepActive==0"
                        ref="forgotPasswordForm"
                        :rules="forgotPasswordPhoneRules"
                        :model="phoneYz"
                    >
                        <el-form-item label="手机号：" prop="phone">
                            <el-input v-model="phoneYz.phone" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码：" prop="forgotPassWordYZM">
                                <el-input v-model="phoneYz.forgotPassWordYZM" placeholder="请输入验证码" >
                                <template #append>
                                    <el-button v-if="isSendingflog" @click="sendYzm">发送验证码</el-button>
                                    <el-button v-else>{{ YzmTime }}s</el-button>
                                </template>
                                </el-input>
                            </el-form-item>
                        <el-row>
                        <el-col :span="4" :offset="6"><el-button @click="returnLogin"  type="primary"> 返回登录</el-button></el-col>
                        <el-col :span="4" :offset="2"><el-button type="primary" @click="forgotPassWordTel(forgotPasswordForm)" >忘记密码</el-button></el-col>
                        </el-row>
                        
                        
                </el-form>
                <!-- 修改密码 -->
                <el-form 
                style="width: 550px;margin-top: 40px" 
                v-show="stepActive==1"
                :rules="setPwdRules"
                ref="setPwdRef"
                :model="newPwd"
                >
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="newPwd.newPwd" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="newPwd1">
                    <el-input v-model="newPwd.newPwd1" placeholder="请再输入新密码"></el-input>
                </el-form-item>
                <el-button type="primary"  @click="forgotPassWordPwd(setPwdRef)" style="margin: 0 250px;padding: 20px;">修改密码</el-button>
                </el-form>
                </div>
                <div style="width: 550px;" v-show="stepActive==2">
                    <el-result
                        icon="success"
                        title="成功"
                        sub-title="更改密码成功"
                    >
                        <template #extra>
                        <el-button type="primary" @click="returnLogin">返回登录页面</el-button>
                        </template>
                    </el-result>
                </div>
            </el-card>
        </div>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { ref,defineEmits, reactive,getCurrentInstance } from 'vue';
// axios属性
let {proxy} =getCurrentInstance()
// 手机号验证form
let forgotPasswordForm=ref()
// 步骤条
let stepActive=ref(0);

// 返回配置属性
let userConfig =defineEmits(["userconfig"])

// 是否允许发送验证码
let isSendingflog=ref(true)
    // 允许发送时间
let YzmTime=ref(60)




// 手机号验证
let phoneYz=reactive({
    phone:'',
    forgotPassWordYZM:''
})
// 手机号规则
const phoneRules=(rules,value,callback)=>{
    if (phoneYz.phone.length!=11) {
       return callback(new Error("手机号格式有误！"))
    }
    callback()
}
// 手机验证匹配规则
let forgotPasswordPhoneRules=reactive({
    phone:[
        {
            required:true,
            validator: phoneRules,
        }
    ],
    forgotPassWordYZM:[
        {
            required:true,
            message: '验证码不能为空',
            trigger: 'change',
        }
    ]
})




// 新密码
let newPwd =reactive({
    newPwd:'',
    newPwd1:""
})

// 修改密码区域表单对象
let setPwdRef =ref()
// 密码比对器
const newPwdEqNewPwd1=(rules,value,callback)=>{
    if (newPwd.newPwd != newPwd.newPwd1) {
        return callback(new Error("两次密码不一致"))
    }
    callback()
}
// 新密码匹配规则
let setPwdRules=reactive({
    newPwd:[
        {
            required:true,
            message: '密码不能为空',
            trigger: 'blur',
        }
    ],
    newPwd1:[
        {
            required:true,
            validator: newPwdEqNewPwd1,
        }
    ]
})

// 忘记密码设置新密码
let forgotPassWordPwd=async (formEl)=>{
    console.log(formEl);
    if (!formEl) return
    let setPwdFlog= ref(true)
     await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            } else {
            console.log('error submit!', fields)
            setPwdFlog.value=false
            }
        })
        console.log(setPwdFlog.value);
        if (setPwdFlog.value) {
            proxy.$http({
                url:"/login/setPassWord",
                method:"get",
                params:{
                    state:"forgotPassword",
                    pwd:newPwd.newPwd
                }
            }).then((resp)=>{
                let rs =resp.data
                if(rs.setPassWordState="success"){
                    ElMessage.success("修改成功")
                    
                }else{
                    ElMessage.error("修改失败")
                }
              
            }).catch(()=>{
                ElMessage.error("系统异常")
            })
            stepActive.value++      
        }
    
}


// 发送验证码
let sendYzm=()=>{
    
    if(!phoneYz.phone){
        ElMessage.error("手机号不能为空")
        return
    }
    isSendingflog.value=false

    const countdown =setInterval(() => {
        YzmTime.value--
        if (YzmTime.value==-1) {
            isSendingflog.value=true
            YzmTime.value=60
            clearInterval(countdown)
        }
    }, 1000);
    proxy.$http({
            method:'get',
            url:"/login/sendForgotPasswordYzm",
            // 验证手机号
            params:{
                "phone":phoneYz.phone
            }
        }).then((resp)=>{
            let message=resp.data.SendMessage
            if (resp.data.SendState=='success') {
                ElMessage.success(message)
                isSendingflog.value=false
            }else{
                ElMessage.error(message)
            }
   }).catch(()=>{
    ElMessage.error("网络异常")
   })
}


// 忘记密码手机号验证进行下一步
let forgotPassWordTel=async (formEl)=>{
    console.log(formEl);
    
    if (!formEl) return
    let forgotPasswordFlog= ref(true)
     await formEl.validate((valid,fields) => {
        console.log(valid);
            if (valid) {
               console.log("success");
                
            }else{
                forgotPasswordFlog.value=false
                return
            }
        })
        console.log(forgotPasswordFlog.value);
        // 忘记密码中属性非空
        if (forgotPasswordFlog.value) {
            proxy.$http({
                method:'get',
                url:"/login/ForgotPasswordPhone",
                params:phoneYz,
            }).then((resp)=>{
                let rs =resp.data
                if(rs.forgotPasswordPhoneState=='success'){
                    ElMessage.success(rs.forgotPasswordPhoneMessage)
                    stepActive.value++   
                }else{
                    ElMessage.error(rs.forgotPasswordPhoneMessage)
                }
            }).catch(()=>{
                ElMessage.error("网络异常")
            })
            
        }

}




// 返回登录
let returnLogin=()=>{
    Object.assign(phoneYz,{
        phone:'',
        forgotPassWordYZM:''
    })
    isSendingflog.value=true
    YzmTime.value=60
    Object.assign(
        {
            newPwd:'',
            newPwd1:""
        }
    )
    stepActive.value=0
    proxy.$router.push('/')
}

</script>