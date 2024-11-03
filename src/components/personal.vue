<style>
.setPwd{
  margin-top:40px;
  max-width:500px;
  margin: 0 auto;
}
</style>
<template> 
<!-- 基本信息部分 -->
<el-descriptions
    title="基本信息"
    direction="vertical"
    :column="3"
    size="default"
    border
  >
    <el-descriptions-item label="账号">
      <el-tag type="primary">{{people.account}}</el-tag>
    </el-descriptions-item>
    
    
    <el-descriptions-item label="性别" >
      <el-tag :type="people.sex=='男'?'primary':'danger'">{{people.sex}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="昵称">
      <el-tag>{{people.uName}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="粉丝数" :span="2">
      <el-tag type="primary">{{people.fan}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="用户类型">
      <el-tag type="primary">{{people.uTypeId==3?'主播':"普通用户"}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="地址" :span="2">
      <el-tag type="primary">{{people.adress}}</el-tag>
    </el-descriptions-item>
  </el-descriptions>

  <!-- 信息更改部分 -->
  <el-tabs tab-position="top" style="margin-top: 20px" class="demo-tabs">

    <!-- 密码修改部分 -->
    <el-tab-pane label="密码修改" finish-status="success" class="setPwd">
      <div style="height: 80px;">
      <el-steps style="max-width: 600px" :active="active" align-center>
        <el-step title="身份验证"/>
        <el-step title="密码修改" />
        <el-step title="完成"/>
      </el-steps>
    </div>
      <el-form class="setPwd" v-if="active==1" style="padding-left: 60px;" ref="authenticationFrom" :rules="authenticationFromRules" :model="authentication">
        <el-form-item label="手机号:" prop="tel">
            <el-input v-model="authentication.tel" placeholder="请输入手机号"  style="width: 240px" 
              :formatter="(value) => `$ ${value}`.replace(/[^0-9]/g,'')"
              :parser="(value) => value.replace(/[^0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="验证码" prop="telYzm">
            <el-input v-model="authentication.telYzm" placeholder="请输入验证码" style="width: 240px" >
              <template #append>
                <el-button v-if="isSendingflog" @click="sendYzm">发送验证码</el-button>
                <el-button v-else>{{ YzmTime }}s</el-button>
              </template>
            </el-input>

        </el-form-item>
        <el-button type="primary" @click="codePhone(authenticationFrom)">下一步</el-button>
      </el-form>
        <el-form class="setPwd" v-if="active==2" style="padding-left: 60px;" :model="shadow" ref="setPwdForm" :rules="setPwdRules">
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input
              v-model="shadow.oldPwd"
              style="width: 240px"
              type="password"
              placeholder="请输入原密码"
              show-password
            />
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd1">
              <el-input
              v-model="shadow.newPwd1"
              style="width: 240px"
              type="password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
            
          <el-form-item label="确认密码" prop="newPwd2">
            <el-input
              v-model="shadow.newPwd2"
              style="width: 240px"
              type="password"
              placeholder="请再输入一次新密码"
              show-password
            />
          </el-form-item>
          <el-button type="primary" @click="setPwd(setPwdForm)">下一步</el-button>
        </el-form>
        <div v-if="active==3" class="setPwd">
          <el-result
              icon="success"
              title="修改成功"
            >
            <template #sub-title>
              {{ balckTime }}s后回到身份证验证
            </template>
          </el-result>
        </div>
      
    </el-tab-pane>


    <!-- 更改个人信息 -->
    <el-tab-pane label="个人信息更改">
      <el-form :model="people" style="max-width: 600px;margin: 0 auto">
        <el-form-item label="昵称：" >
          <el-input v-model="newPeople.uName" /> 
        </el-form-item>
        <el-form-item label="性别：" >
          <el-radio-group v-model="newPeople.sex" class="ml-4">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" >
          <el-input v-model="newPeople.adress" /> 
        </el-form-item>
        
        <el-form-item label="是否修改手机号">
          <el-switch v-model="peopleConfig.isSettel" />
        </el-form-item>
        <!-- 修改手机号内容区域 -->
        <div v-show="peopleConfig.isSettel">
              <el-form-item label="请输入手机号">
              <el-input v-model="newPeople.oldPhone" placeholder="请输入手机号" minlength="11" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="验证码">
                <el-input v-model="authentication.telYzm" placeholder="请输入验证码" style="width: 240px">
                  <template #append>
                    <el-button v-if="isSendingflog" @click="sendYzm">发送验证码</el-button>
                    <el-button v-else>{{ YzmTime }}s</el-button>
                  </template>
                </el-input>
            </el-form-item>
            <el-form-item label="新手机号">
              <el-input v-model="newPeople.newPhone" placeholder="请输入新手机号" minlength="11" maxlength="11"></el-input>
            </el-form-item>
        </div>
        <el-button type="primary" @click="setPeople">修改</el-button>
      </el-form>
    </el-tab-pane>
  </el-tabs>
   

</template>
<!-- 手机号不能为空   telIsNotNull
      短信验证码不能为空  yzmIsNotNull
      旧密码不能为空   oldPwdIsNotNull
      新密码不能为空  newPwd1IsNotNull
      第二次密码不能为空  newPwd2IsNotNull
      两次密码不一致 newPwd1IsNotNewPwd2
-->
<script setup>
// 在页面引入图片裁剪
import { ElMessage } from 'element-plus';
import { ref ,reactive, getCurrentInstance,onMounted} from 'vue';
  const {proxy}=getCurrentInstance()
// 基本信息
  let people=reactive({
    account:"null",
    sex:'男',
    uName:'null',
    fan:0,
    adress:'null',
    phone:"",
    uTypeId:3
  })

  // 新信息
  let newPeople=reactive({
    account:"",
    sex:'男',
    uName:'',
    adress:'',
    oldPhone:"",
    setPeopleYZM:"",
    newPhone:"",
    uTypeId:3
  })
  // 信息修改配置
  let peopleConfig=reactive({
    isSettel:"false"
  })
  // 身份验证
  let authentication=reactive({
    tel:'',
    telYzm:''
  })
  // 密码框
  let shadow=reactive({
        // 旧密码
      oldPwd:'',
      // 新密码
      newPwd1:'',
      // 确认密码
      newPwd2:''
  })
  
  // 步骤条状态
  let active =ref(1)
  // 手机号验证码
  let isSendingflog=ref(true)
  // 验证码时间
  let YzmTime=ref(60)
  // 返回时间
  let balckTime=ref(5)
  // 手机号验证
  let authenticationFrom=ref()
  // 手机号验证规则
  let authenticationFromRules=reactive({
    tel:[
      {
          required: true, message: '请输入手机号', trigger: 'blur' },
          {
              min: 11, max: 11, message: '手机号长度为11位', trigger: 'blur' 
          }
      ],
      telYzm:[
        {
          required: true, message: '请输入验证码', trigger: 'blur' },
      ]
  })
  let setPwdForm=ref()
  const newPwd1EqNewPwd2=(rule,value,callback)=>{
    console.log(value);
    if(value!=shadow.newPwd1){
      callback(new Error('两次密码不一致'))
    }else{
      callback()
    }
  }

  let setPwdRules=reactive({
    oldPwd:[
      {
        required: true, message: '请输入旧密码', trigger: 'blur' 
      },
        
      ],
      newPwd1:[
        {
          required: true, message: '请输入新密码', trigger: 'blur' },
          {min: 6, max: 30, message: '密码长度最少6位最多30位', trigger: 'blur' }
      ],
      newPwd2:[
        {
          required: true, message:'请输入确认密码', trigger: 'blur' },
          {validate: newPwd1EqNewPwd2,trigger:'blur'
},
      ],
  })
  // 发送验证码
  const sendYzm=()=>{
    proxy.$http({
      url:"/live/sendSetPwdYzm",
      method:"get",
      params:{
        phone:authentication.tel
      }
    }).then((resp)=>{
      let rs =resp.data
      if(rs.SendState=="success"){
        ElMessage.success(rs.SendMessage)
        isSendingflog.value=false
        const in60=setInterval(()=>{
          YzmTime.value--
          if(YzmTime.value==-1){
            clearInterval(in60)
            YzmTime.value=60
            isSendingflog.value=true
          }
        },1000)
      }else{
        ElMessage.error(rs.SendMessage)
      }
    }).catch(error=>{
      ElMessage.error(error)
    })
  }
  // 验证验证码
  const codePhone=async (formEl)=>{
    const flog=await formEl.validate((valid, fields) => {
      console.log(valid,fields);
      return valid
    })
    console.log(flog);
    if (!flog) {
      return
    }
    proxy.$http({
        url:"/live/codePhone",
        method:"get",
        params:{
          Yzm:authentication.telYzm,
          phone:authentication.tel
        }
      }).then((resp)=>{
        let rs =resp.data
        if(rs==200){
          ElMessage.success("验证成功")
          active.value++ 
       }else{
        ElMessage.error("验证失败")
       }
      })
    
  }
  // 修改密码的步骤
   const setPwd=async (formEl)=>  {
    
    const flog=await formEl.validate((valid, fields) => {
      return valid
    })
    if (!flog) {
      return
    }
      proxy.$http({
        url:"/live/setPwd",
        method:"get",
        params:{
          oldPwd:shadow.oldPwd,
          newPwd:shadow.newPwd1
        }
      }).then((resp)=>{
        let rs =resp.data
        if(rs!=null&& rs.state=="200"){
          ElMessage.success(rs.message)
          active.value++
          // 初始化倒计时
          balckTime.value=5 
        // 5s后跳回第一个
        const si= setInterval(()=>{
          balckTime.value--
          if(balckTime.value==0){
            active.value=1
            clearInterval(si);
            balckTime.value=5
            
          }
        },1000)
        }else{
          ElMessage.error(rs.message)
        }
      }).catch(error=>{
        ElMessage.error(error)
    })
  }
  onMounted(()=>{
    proxy.$http('/live/getUserInformation',{}).then(resp=>{ 
      for(let key in resp.data){
        people[key]=resp.data[key]
      }
      }) 
  })
  const setPeople=()=>{ 
      proxy.$http({
          url:"/live/SetAnchorInformation",
          method:"get",
          params:newPeople
        }).then(resp=>{
          resp.data=="修改成功"?ElMessage.success("修改成功"):ElMessage.error("修改失败")
          proxy.$http('/live/getUserInformation',{}).then(resp=>{ 
            for(let key in resp.data){
              people[key]=resp.data[key]
            }
            }) 
          // console.log(resp.data);
        }).catch(error=>{
          ElMessage.error(error)
        })
    }
</script>

  