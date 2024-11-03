<style>
  .InformationList{
    height: 400px;
  }
</style>
<template>
    <!-- 头部 -->
<el-container>
    <el-header>
        <el-row>
            <el-col :span="8">
            <el-statistic title="今日开播峰值" :value="peakValue" />
        </el-col>
        <el-col :span="8">
            <el-statistic  title="今日开播时长:单位(时)" :value="WorkingHours">
            <!-- <template #suffix></template> -->
            </el-statistic>
        </el-col>
        <el-col :span="8">
            <el-statistic title="粉丝数"  :value="fansNumbers"/>
        </el-col>
    </el-row>
  </el-header>
  <el-main>
    <el-row>
      <el-col :span="10">
        <!-- 月收益图表 -->
        <div id="customerChart" class="InformationList"></div>
      </el-col>
      <!-- 粉丝整体表格 -->
      <el-col :offset="4" :span="10">
         <!-- 粉丝榜 -->
        <el-table :data="tableData" class="InformationList" table-layout="fixed" border >
          <!-- 头像列 -->
          <el-table-column label="头像" >
          <template #default="scope">
            <el-avatar
            :src="scope.row.url"
            @Error="()=> true"
            lazy
          >
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
          </template>
          </el-table-column>
          <!-- 昵称列 -->
          <el-table-column  label="昵称" >
            <template #default="scope">
              <el-tag>{{ scope.row.name }}</el-tag>
            </template>
          </el-table-column>
          <!-- 金额列 -->
          <el-table-column  label="总金额" sortable  prop="countMoney" >
            <template #default="scope">
              <el-tag>{{ scope.row.countMoney }}元</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

   
  </el-main>
</el-container>
</template>
<script setup>
    import { ElMessage } from 'element-plus';
    import { ref,getCurrentInstance,inject,onMounted } from 'vue';
    const {proxy}=getCurrentInstance()
    // 直播峰值人数
    let peakValue=ref(0)
    // 直播时长
    let WorkingHours=ref(0)
    // 粉丝数
    let fansNumbers=ref(0)
     // echarts初始化部分
     let echarts = inject("ec");//引入
    //  月份
     let month=['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月']
    //  月总金额
     let monthMoney
    //  月最高收益
     let monthMaxMoney
    //  月最低收益
     let monthMinMoney

    //  测试数据
    let tableData=ref([])
    onMounted(async () => {//需要获取到element,所以是onMounted的Hook
      // 获得月数据图表区域
      let monthCharts = echarts.init(document.getElementById("customerChart"));
      // 获得图表数据
      await proxy.$http.get("/live/getAnchorData",{}).then(resp=>{ 
        monthMoney=resp.data.MonthlyIncome
        monthMaxMoney=resp.data.maxMonthDayMoney
        monthMinMoney=resp.data.minMonthDayMoney
      }).catch(err=>{
        ElMessage.error(err)
      })
      // 绘制图表
      monthCharts.setOption({
        title: {
        text: '月收益:单位（元）'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['月最高收益', '月最低收益',  '月收益']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: month
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '月最高收益',
          type: 'line',
          stack: 'Total',
          data: monthMaxMoney
        },
        {
          name: '月最低收益',
          type: 'line',
          stack: 'Total',
          data: monthMinMoney
        },
        {
          name: '月收益',
          type: 'line',
          stack: 'Total',
          data: monthMoney
        }
      ]
      })
      
      await proxy.$http.get("/live/getAllGiftMoney",{}).then(resp=>{
        tableData.value=resp.data
        
      }).catch(err=>{
        ElMessage.error(err)
      })
      // 获取主播今日最高人气值总直播时长（分钟）最高观看人数
      await proxy.$http.get("/live/getAnchorBasic",{}).then(resp=>{
        peakValue.value=resp.data.peakValue
        WorkingHours.value=resp.data.WorkingHours
        fansNumbers.value=resp.data.fansNumbers
      }).catch(err=>{
        ElMessage.error(err)
      })
    });      
   
</script>