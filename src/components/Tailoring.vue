<template>
	<div>
	  <div>
		<!-- 图片展示 -->
		<img :src="avatar" alt="您未选择图片" style="border-radius: 50%;"/>
		<!-- 修改头像的按钮 -->
      <el-button type="primary" @click="imagecropperShow = true">修改头像</el-button>
	  </div>
	  <div>
		<my-upload
		  v-model="imagecropperShow" 
      url="http://localhost:8080/live/setAnchorImg"
		  lang-type="zh"
		  img-format="png"
      @src-file-set="getImgName"
		  @cropSuccess="cropSuccess"
		  @cropUploadSuccess="cropUploadSuccess"
		  @cropUploadFail="cropUploadFail"
      :withCredentials="true"
		></my-upload>
    
	  </div>
	</div>
  </template>

<script setup>
 // 使用头像上传组件
 import { ElMessage } from "element-plus";
import { ref,defineEmits} from "vue";
import myUpload from "vue-image-crop-upload";
//设置初始值
 let imagecropperShow=ref(false)
 let avatar =ref('')
 let imgName=ref('')
 let uploadImgState=ref(false)
//  选取文件时
 function getImgName(fileName, fileType, fileSize){
  imgName.value=fileName
 }
 function cropSuccess(imgDataUrl, field) {
      
      //把头像设置成上传的图片
      avatar.value = imgDataUrl;
      imagecropperShow.value =false
      
    }
    //上传成功回调
    const cropUploadSuccess =(res, originPicName) =>{
      console.log("开始");
      uploadImgState.value=true
      if (res.data.state=='200') {
        ElMessage.success("上传头像成功")
        emit('update_img',res.data.url)
      }else{
        ElMessage.error("上传头像失败")
      }
    }
    //上传失败回调
    function  cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log("上传失败状态" + status );
      console.log("field: " + field );
    }
    
</script>