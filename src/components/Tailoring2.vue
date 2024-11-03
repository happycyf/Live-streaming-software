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
		  :key="imagecropperKey"
		  lang-type="zh"
		  img-format="png"
      @src-file-set="getImgName"
		  @crop-success="cropSuccess"
		  @crop-upload-success="cropUploadSuccess"
		  @crop-upload-fail="cropUploadFail"
		  
		></my-upload>
	  </div>
	</div>
  </template>

<script setup>
 // 使用头像上传组件
 import { ElMessage } from "element-plus";
import { ref,defineExpose} from "vue";
import myUpload from "vue-image-crop-upload";
//设置初始值
 let imagecropperShow=ref(false)
 let imagecropperKey = ref(0)
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
    function cropUploadSuccess(res, originPicName) {
      uploadImgState.value=true
      ElMessage.success("上传头像成功")
    }
    //上传失败回调
    function  cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log("上传失败状态" + status );
      console.log("field: " + field );
    }
    
    defineExpose({avatar,imgName,uploadImgState})
</script>