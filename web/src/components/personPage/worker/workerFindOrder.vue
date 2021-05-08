<template>
    <div class="workerFindOrder-page">
        <person-title>当前位置 :: 我的订单 >> <em>查找订单</em></person-title>
        <div class="findOrder-search">
            <el-form :inline="true" :model="findOrderForm" class="user-findOrder">
                <el-form-item label="查询条件">
                    <el-select v-model="findOrderForm.condition" placeholder="选择查询条件">
                    <el-option label="订单号" value="订单号"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入">
                    <el-input v-model="findOrderForm.answers" placeholder="查询条件"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchOrder">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <workerOrderList
            :userOrder='findOrder'
            :rightOptBtn='rightOptBtn'
            :titleList='titleList'
            @completedOrderr='handlecompletedOrder'>
        </workerOrderList>
    </div>
</template>

<script>
import workerOrderList from './workerOrderList'
import axios from 'axios'
export default {
    data(){
        return{
            findOrderForm: {
                condition: '',
                answers: ''
            },
            findOrder : [],
            titleList : [
                {id:1,columnTitle:'接单时间',prop:'receivedDate',sortable:true},
                {id:2,columnTitle:'订单价格(元)',prop:'Price',sortable:true},
                {id:3,columnTitle:'订单状态',prop:'orderState',sortable:false}
            ]
        }
    },
    components:{
        workerOrderList
    },
    computed: {
        rightOptBtn(){
            if(!this.findOrder[0]){
                 return 'receiveOrderBtn'   
            }else{
                if(this.findOrder[0].orderState === '已完成'){
                    return 'historyBtn' 
                }else{
                    return 'receiveOrderBtn' 
                }
            }
            
        }
    },
    methods: {
        searchTest(){  
            let testVal = this.findOrderForm.answers;
            switch(this.findOrderForm.condition){
                case "订单号" :
                    return /^\d{16}$/.test(testVal)
                default : return false
            }
        },
        searchOrder(){
            let flag = this.searchTest();
            if(flag){
                let loading = this.$loading({lock:true,text:'玩命加载中...'});
                axios.post(`/workers/searchOrder`,this.findOrderForm).then(response=>{
                    let res = response.data;
                    loading.close();
                    if(res.status=='0'){
                        this.findOrder = res.result;
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg,
                            showClose:true
                        });  
                    }
                }).catch(err=>{
                    console.log(err);
                    loading.close();
                });
            }else{
                this.$message({
                    type: 'error',
                    message: '订单格式不正确!',
                    showClose:true
                });
            }
        },
        handlecompletedOrder(orderData){
            // 如果已接单接不可以取消
            this.$confirm(`是否配送完成? 申请完成订单(此操作会向客户发起完成请求,
            若客户2天内没有确认则系统自动确认`, 
                '完成订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                let loading = this.$loading({lock:true,text:'玩命加载中...'});
                axios.post(`/workers/completedOrder`,orderData).then(response=>{
                    let res = response.data;
                    loading.close();
                    if(res.status=='0'){
                        this.$message({
                            type: 'success',
                            message: '已向客户发起完成请求!'
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message:res.msg
                        }); 
                    }
                }).catch(err=>{
                    console.log(err);
                    
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                 });          
            });      
        },
        handleDeleteOrder(orderData){
            // 如果已接单接不可以取消
            this.$confirm(`此订单删除无法恢复! 确认删除订单?`, 
                '完成订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                let loading = this.$loading({lock:true,text:'玩命加载中...'});
                axios.post(`/workers/deleteHistoryOrder`,{orderId:orderData.orderId}).then(response=>{
                    let res = response.data;
                    loading.close();
                    if(res.status=='0'){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.gehistoryOrderList();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });   
                    }
                }).catch(err=>{
                    loading.close();
                    console.log(err);
                    
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                 });          
            });      
        }
    },
}
</script>

<style scoped>
.findOrder-search{
    padding-top: 1rem;
}
</style>
