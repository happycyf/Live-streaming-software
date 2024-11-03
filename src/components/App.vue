<template>
  <!-- 首页部分 -->
  <div>
    <div >
      <el-container>
        <el-header id="header">
          <el-menu
              class="el-menu-demo"
              mode="horizontal"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :ellipsis="false"
            >
              <el-menu-item index="1" ><RouterLink to="/main/StartLive"><el-icon><VideoCamera /></el-icon>开启直播</RouterLink></el-menu-item>
              <el-menu-item index="2" ><RouterLink to="/main/Withdrawal"><el-icon><Money /></el-icon>提现</RouterLink></el-menu-item>
              <el-menu-item index="3" ><RouterLink to="/main/AnchorData"><el-icon><Histogram /></el-icon>数据中心</RouterLink> </el-menu-item>
              <el-menu-item index="4" ><RouterLink to="/main/personal"><el-icon><User /></el-icon>个人中心</RouterLink></el-menu-item>
                <div style="flex-grow: 0.9;"/>
                <!-- 头像区域 -->
                <el-menu-item index="5">
                  <div style="width: 41px; " @click="optionDrawer">
                  <el-avatar :size="40" style="padding: auto atuo;" 
                      :src="imgSrc"
                    />
                  </div>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
          <RouterView/>
        </el-main>
      </el-container>
    </div>

    <!-- 这是一个修改头像的抽屉 -->
    <el-drawer
      v-model="drawer"
      title="修改头像"
      direction="btt"
      :before-close="handleClose"
    >
      <tl />
    </el-drawer>
  </div>
  </template>
<script setup>
  import {ref,provide,getCurrentInstance, onMounted, watch} from 'vue'
  import tl from './Tailoring.vue'
  import * as echarts from 'echarts'
  import { ElMessage,ElMessageBox } from "element-plus";
  let {proxy}= getCurrentInstance()
    let drawer=ref(false)
    let imgSrc=ref()
    provide('ec',echarts)//provide
    
    const handleClose = () => {
        
        ElMessageBox.confirm('你确认要关闭？')
          .then(() => {
            drawer.value=false
            // done()
            proxy.$http({
              method:"get",
              url:"/login/getImgSrc"
            }).then((resp)=>{
              let rs=resp.data
              if(rs.state=='success'){
                setTimeout(()=>{
                  imgSrc.value=rs.imgSrc
                },2000)
                  
              }else{
                ElMessage.error(rs.message)
              }
            })
          })
          .catch(() => {
            // catch error
            drawer.value=true
          })
}
  onMounted(()=>{
    console.log("进入");
    
    proxy.$http({
      method:"get",
      url:"/login/getImgSrc"
    }).then((resp)=>{
      let rs=resp.data
      if(rs.state=='success'){
          imgSrc.value=rs.imgSrc
      }else{
        ElMessage.error(rs.message)
      }
    })
  })
const optionDrawer=()=>{drawer.value=true}
</script>