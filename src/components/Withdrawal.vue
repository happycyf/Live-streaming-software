<style>
  .green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
.defaultColor{
  color: #409EFF
}
</style>
<template>
     <div class="common-layout">
        <el-container>
          <!-- 头部数据 -->
            <el-header>
                 <el-row :gutter="16">
                    <el-col :span="8">
                      <div class="statistic-card">
                        <el-statistic :value="IncomeDatas.todayMoney">
                          <template #title>
                            <div style="display: inline-flex; align-items: center">
                              今日收益：单位（元）
                              <el-tooltip
                                effect="dark"
                                content="今天的收益与昨日收益相比较"
                                placement="top"
                              >
                                <el-icon style="margin-left: 4px" :size="12">
                                  <Warning />
                                </el-icon>
                              </el-tooltip>
                            </div>
                          </template>
                        </el-statistic>
                        <div class="statistic-footer">
                          <div class="footer-item">
                            <span>与昨日涨幅：</span>
                            <span :class="(GetDIIP > 0)?'green':(GetDIIP==0)?'defaultColor':'red'">
                              {{ GetDIIP }}%
                              <!-- 上涨的情况 -->
                              <el-icon v-if="GetDIIP > 0">
                                <CaretTop />
                              </el-icon>
                              <!-- 不涨不跌 -->
                              <el-icon v-else-if="GetDIIP == 0">
                                <DCaret />
                              </el-icon>
                              <el-icon v-else><CaretBottom /></el-icon>
                            </span>
                          </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="statistic-card">
                          <el-statistic :value="IncomeDatas.blance">
                            <template #title>
                              <div style="display: inline-flex; align-items: center">
                                余额：单位（元）：
                                <el-tooltip
                                  effect="dark"
                                  content="查看本人所有余额"
                                  placement="top"
                                >
                                  <el-icon style="margin-left: 4px" :size="12">
                                    <Warning />
                                  </el-icon>
                                </el-tooltip>
                              </div>
                            </template>
                          </el-statistic>
                          </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="statistic-card">
                        <el-statistic :value="IncomeDatas.monthlyIncome" title="查看本月收益">
                          <template #title>
                            <div style="display: inline-flex; align-items: center">
                              月收益：单位（元）
                              <el-tooltip
                                effect="dark"
                                content="今天的本月与上一月收益相比较"
                                placement="top"
                              >
                                <el-icon style="margin-left: 4px" :size="12">
                                  <Warning />
                                </el-icon>
                              </el-tooltip>
                            </div>
                          </template>
                        </el-statistic>
                        <div class="statistic-footer">
                          <div class="footer-item">
                            <span>比上一个月涨跌幅度：</span>
                            <span :class="(getMIIP > 0)?'green':(getMIIP==0)?'defaultColor':'red'">
                              {{ getMIIP }}%
                              <!-- 上涨的情况 -->
                              <el-icon v-if="getMIIP > 0">
                                <CaretTop />
                              </el-icon>
                              <!-- 不涨不跌 -->
                              <el-icon v-else-if="getMIIP == 0">
                                <DCaret />
                              </el-icon>
                              <!-- 跌 -->
                              <el-icon v-else><CaretBottom /></el-icon>
                            </span>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
            </el-header>
            <el-main> 
                    <el-tabs type="border-card">
                      <!-- 上边窗口 -->
                      <el-tab-pane label="提现">
                        <el-form 
                          label-position='top'
                          ref="WithdrawalRef"  
                          :rules="WithdrawalRules" 
                          :model="WithdrawalForm"
                          >
                                <!-- 输入金额 -->
                                <el-form-item label="请输入提现金额:" prop="MyMoney">                      
                                      <!-- 金额框 -->
                                    <el-input
                                        v-model="WithdrawalForm.MyMoney"
                                        
                                        :formatter="(value) => {return value.replace(/\D/g, '.')}"
                                        :parser="(value) => {return value.replace(/\D/g, '.')}"
                                      />
                                </el-form-item>
                                <el-form-item label="请输入收款支付宝账号" prop="PayAccount">
                                  <el-input v-model="WithdrawalForm.PayAccount" placeholder="请输入收款支付宝账号" />
                                </el-form-item>
                                <el-form-item label="请输入验证码"  prop="InputCode">
                                    <el-input v-model="WithdrawalForm.InputCode" placeholder="请输入验证码"  >
                                      <template  #append >
                                        <el-button type="primary" @click="GetCode" v-show="IsSendYzm">发送验证码</el-button>
                                        <i v-show="!IsSendYzm">{{ sendTime }}s</i>
                                      </template>
                                    </el-input>
                                    
                                </el-form-item>
                                <!-- 提现按钮 -->
                                <el-button type="primary" style="margin-top: 20px;" @click="SendWithdrawal(WithdrawalRef)">提现</el-button>
                            </el-form>
                      </el-tab-pane>
                      <el-tab-pane >
                        <template #label>
                          <span @click="getWithdrawalData">提现记录 </span>
                        </template>
                        <!-- 提现记录表格 --> 
                          <el-table 
                          :data="WithdrawalRecords"
                          height="250"
                          style="width: 100%"
                          max-height="400"
                          table-layout="fixed"
                          >
                            <el-table-column prop="id" label="编号" sortable />
                            <el-table-column prop="data" label="日期"/>
                            <el-table-column prop="payAccount" label="提现账号"/>
                            <el-table-column prop="money" label="金额"/>
                            <el-table-column prop="state" label="状态" >
                              <template #default="scope">
                                <el-text :type="scope.row.state=='0'?'warning':scope.row.state=='1'?'success':'danger'">{{ scope.row.state=='0'?'申请':scope.row.state=='1'?'成功':'驳回' }}</el-text>
                              </template>
                            </el-table-column>
                          </el-table>
                      </el-tab-pane>
                    </el-tabs>
             
            </el-main>
        </el-container>
        
    </div>
    

</template>
<script setup>
import { ElMessage } from 'element-plus';
import { computed, ref,onMounted,getCurrentInstance, reactive} from 'vue'

  let {proxy}=getCurrentInstance()
  // 收入数据
  let IncomeDatas=reactive({
    todayMoney:0,// 今日收益
    yesterdayMoney:0,// 昨日收益
    monthlyIncome:0,// 本月收益
    lastMonthMoney:0,  // 上月收益
    blance:0,// 余额
  })
  
  
  let WithdrawalForm=reactive({
    // 提现金额
    MyMoney:0,
    // 支付宝账号
    PayAccount:'',
  // 输入验证码
    InputCode:''
  })

    // 验证码是否允许发送
  let IsSendYzm=ref(true)
  // 验证码时间
  let sendTime=ref(60)

// 提现记录
    let WithdrawalRecords=reactive([])
    // 提现表单对象
    let WithdrawalRef=ref()
    // 提现规则
    let WithdrawalRules=reactive({
      "MyMoney":[
        {
        required:true,
        message:'请输入提现金额',
        trigger:'blur',
        }
      ],
      "PayAccount":[
        {
        required:true,
        message:'请输入收款支付宝账号',
        trigger:'blur',
        }
      ],
      "InputCode":[
        {
        required:true,
        message:'请输入验证码',
        trigger:'blur',
        }
      ]
    })
    
// 进行涨幅设置
  const GetDIIP=computed(()=>{
    
    // 如果今日收益大于昨日收益那就是正的
    if (IncomeDatas.todayMoney>IncomeDatas.yesterdayMoney) {
      // 差值
      let Spreads = IncomeDatas.todayMoney-IncomeDatas.yesterdayMoney
      // 避免算数异常
      if (IncomeDatas.yesterdayMoney==0) {
        return (Spreads*100).toFixed(2)
      }else{
       return ((Spreads/IncomeDatas.yesterdayMoney)*100).toFixed(2) 
      }
      // 如果今日收益小于昨日收益那就是负的
    } else if(IncomeDatas.todayMoney<IncomeDatas.yesterdayMoney){
      let Spreads = IncomeDatas.yesterdayMoney-IncomeDatas.todayMoney
      return -((Spreads/IncomeDatas.yesterdayMoney)*100).toFixed(2)
    }else{
      return 0
    } 
  })
  const getMIIP=computed(function(){
    console.log(IncomeDatas.monthlyIncome,IncomeDatas.lastMonthMoney);
    // 本月收益大于上月收益
    if(IncomeDatas.monthlyIncome>IncomeDatas.lastMonthMoney){
      // 差值  
      let Spreads = IncomeDatas.monthlyIncome-IncomeDatas.lastMonthMoney
      // 如果上一月为0 那就直接返回差值
      // 避免算数异常
      if (IncomeDatas.lastMonthMoney==0) {
        return (Spreads*100).toFixed(2)
      }
        return ((Spreads/IncomeDatas.lastMonthMoney)*100).toFixed(2)
    }
    // 如果小于则直接是负
    if(IncomeDatas.monthlyIncome<IncomeDatas.lastMonthMoney){
      let Spreads = IncomeDatas.lastMonthMoney-IncomeDatas.monthlyIncome
      return -((Spreads/IncomeDatas.lastMonthMoney)*100).toFixed(2)
    }
    // 如果相等
    return 0
  })

  onMounted(()=>{
    // 获取收入数据
    proxy.$http({
      method:"get",
      url:"/live/getIncomeData"
    }).then((resp)=>{
      let rs=resp.data
      for(let ele in rs){
        IncomeDatas[ele]=Number(rs[ele])
      }
    } )    
  })
  const GetCode=()=>{
    proxy.$http({
      method:"get",
      url:"/live/getWithdrawalCode"
    }).then((resp)=>{
      let rs=resp.data
      if (rs.code==200) {
        IsSendYzm.value=false
        ElMessage.success("发送成功") 
        let timer=setInterval(()=>{
          sendTime.value--
          if (sendTime.value==0) {
            clearInterval(timer)
          }
        })
      }else{
        ElMessage.error("发送失败")
      }
    })
  }
  const SendWithdrawal=async ( formEl)=>{
    if (!formEl) return
      await formEl.validate((valid, fields) => {
        // 如果非空
        if (valid) {
          if (WithdrawalForm.PayAccount.length!=11) {
            ElMessage.error("请输入正确的支付宝账号")
            return
          }
            
          if (WithdrawalForm.MyMoney<=0) {
            ElMessage.error("提现金额不能小于0")
            return
          }
          console.log(WithdrawalForm.MyMoney,"------"+IncomeDatas.blance);
          
          if(WithdrawalForm.MyMoney>IncomeDatas.blance){
            ElMessage.error("提现金额不能大于余额")
            return
          }
          proxy.$http({
            method:"get",
            url:"/live/SendWithdrawal",
            params:{
              "money":WithdrawalForm.MyMoney,
              "payAccount":WithdrawalForm.PayAccount,
              "code":WithdrawalForm.InputCode
            }
          }).then((resp)=>{
            let rs=resp.data
            if (rs.code==200) {
              ElMessage.success(rs.message)
              IncomeDatas.blance-=WithdrawalForm.MyMoney
              WithdrawalForm.MyMoney=0;
              WithdrawalForm.PayAccount=''
              WithdrawalForm.InputCode=''
            }else{
              ElMessage.error(rs.message)
            }
          }).catch(error =>{
            ElMessage.error("请求失败")
          })

        } else {
          console.log(valid);
        }
      })
      
  }
  const getWithdrawalData=async ()=>{
    WithdrawalRecords.length=0
    await proxy.$http({
      method:"get",
      url:"/live/getWithdrawalData"
    }).then((resp)=>{
      let rs=resp.data.withdrawal
      for(let i=0 ;i<rs.length;i++){
        WithdrawalRecords.push(rs[i])
      }
    })
  }
</script>
