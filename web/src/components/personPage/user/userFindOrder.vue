<template>
    <div class="findOrder-page">
        <person-title>当前位置 :: 我的订单 >> <em>当前订单</em></person-title>
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
        <userOrderList 
        :userOrder='findOrder'
        :listType='listType'
        :titleList='titleList'
        @CancelOrder='handleCancel'
        @completedOrderr='handleCompleted'
        @DeleteOrder='handleDelete'>
        </userOrderList>
    </div>
</template>

<script>
import userOrderList from './userOrderList'
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
                {id:1,columnTitle:'发布时间',prop:'createTime',sortable:true},
                {id:2,columnTitle:'订单价格(元)',prop:'Price',sortable:true},
                {id:3,columnTitle:'订单状态',prop:'orderState',sortable:false}
            ]
        }
    },
    components:{
        userOrderList
    },
    computed: {
        listType(){
            if(!this.findOrder[0]){
                 return { noCompBtn:true } 
            }else{
                if(this.findOrder[0].orderState === '已完成'){
                    return { noCompBtn:false } 
                }else{
                    return { noCompBtn:true } 
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
                axios.post(`/admin/searchOrder`,this.findOrderForm).then(response=>{
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
        handleCancel(data){
            // 如果已接单接不可以取消
            this.$confirm('此操作将取消订单, 是否继续?', 
                '取消订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                let loading = this.$loading({lock:true,text:'正在取消订单...'});
                axios.get(`/users/cancelCurrentOrder?orderId=${data.orderId}`).then(response=>{
                    let res = response.data;
                    loading.close();
                    if(res.status=='0'){
                        this.$message({
                            type: 'success',
                            message: '取消成功!'
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
        handleCompleted(orderData){
            // 完成订单
            this.$confirm(`是否确认送达,完成订单?`, 
                '支付订单', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                let loading = this.$loading({lock:true,text:'正在完成订单...'});
                axios.post(`/users/completedCurrentOrder`,orderData).then(response=>{
                    let res = response.data;
                    loading.close();
                    if(res.status=='0'){
                        this.$message({
                            type: 'success',
                            message: '收货成功!'
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
        handleDelete(data){
            // 删除订单
            this.$confirm('此操作将永久删除该文件, 是否继续?', 
                '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                axios.get(`/users/deleteHistoryOrder?orderId=${data.orderId}`).then(response=>{
                    let res = response.data;
                    if(res.status=='0'){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
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
                    message: '已取消删除'
                 });          
            });  
        },
    }
}
</script>

<style scoped lang='scss'>
.findOrder-search{
    padding-top: 1rem;
}
</style>
