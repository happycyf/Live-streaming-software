<style>
.inputMargin{
    margin-top: 30px;
}
</style>
<template>
    <div class="loginBg">
        <!-- 这是一个登录页面</div> -->
        <el-card style="width: 400px;height: 400px;margin-left: auto; margin-right: auto;margin-top: 5%;">
            <template #header>
            <div class="card-header">
                <h2 style="text-align: center;">登录</h2>
            </div>
            </template>
            <!-- 这是一个登录页面 -->
            <el-form
                ref="rulesFromRef"
                :model="user"
                status-icon
                :rules="userRules"
                label-width="auto"
                class="demo-ruleForm"
               
            >
                <el-form-item label="账号" prop="account" class="inputMargin">
                    <el-input v-model="user.account" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item label="密码" prop="pwd" class="inputMargin">
                    <el-input v-model="user.pwd" type="password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
                <el-row class="inputMargin">
                    <el-col :span="4" :offset="16" ><RouterLink to="/forgotPassWord"><el-text type="primary">忘记密码</el-text></RouterLink></el-col>
                    <el-col :span="4"><RouterLink to="/register"><el-text type="primary"> 注册</el-text></RouterLink></el-col>
                </el-row>
                    <br>
                    <div style="height: 40px; width: 150px; margin: 0 auto;">
                        <el-button type="primary" @click="submitForm(rulesFromRef)" style="height: 40px;width: 150px; " round ><span style="font-size: 20px;line-height: 20px;"><el-icon><Unlock /></el-icon>登录</span></el-button>
                    </div>
                
            </el-form>
        </el-card>
    </div>
</template>
<script setup>
import { reactive, ref,defineEmits,getCurrentInstance} from 'vue';
import { ElMessage } from 'element-plus';
import { RouterLink } from 'vue-router';
const {proxy}=getCurrentInstance()
// 用户账号
    let user=reactive({
        account:'',
        pwd:''
    })
    let rulesFromRef =ref()
    let userRules=reactive({
        account:[
            {
                required:true,
                trigger:'changer',
                message: "账号不能为空",
                trigger: 'blur',
                informType: 'warning',
        }],
        pwd: [
                {
                required: true,
                trigger: 'changer',
                message: "密码不能空",
                trigger: 'blur',
                informType: 'warning',
                }
            ],
    })
    // 开始登录
    const submitForm = async (formEl) => {
        
        if (!formEl) return
        const flag=  await formEl.validate((valid, fields) => {
                
                return valid
            })
            if(!flag){
                return
            }
            await proxy.$http.get("/login/getLogin",{
                params:user
            }).then((resp)=>{
               let returnData=resp.data
               console.log(resp);
               if(returnData.loginStatus=='success'){
                ElMessage.success(returnData.LoginMessage)
                proxy.$router.push('/main')
               }else{
                ElMessage.error(returnData.LoginMessage)
               
               }
            }).catch(()=>{
                ElMessage.error("请求失败")
            })
        }
   </script>