<template>
    <div class="allUserOrderList">
        <person-title>当前位置 :: 接单大厅 >> <em>订单列表</em></person-title>
        <div class="allUserOrderList-cont">
                <workerOrderList
                :userOrder='notReceiveOrder'
                :rightOptBtn='rightOptBtn'
                :titleList='titleList'
                @receiveOrder='handleReceiveOrder'>
                </workerOrderList>
        </div>
        <div class="pageination-oder">
            <el-pagination v-if="showPagination"
                background
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :pager-count="5"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalOrder">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import workerOrderList from './workerOrderList'
import axios from 'axios'
import {gotoNewOrder} from './../../../assets/js/gotoNewOrder'
export default {
    data(){
        return {
            notReceiveOrder:[],
            currentPage : 1,
            pageSize : 10,
            totalOrder : 0,
            showPagination : true,
            rightOptBtn:'notReceiveBtn',// 'receiveOrderBtn'  // 'historyBtn'    
            titleList:[
                {id:1,columnTitle:'发布时间',prop:'createTime',sortable:true},
                {id:2,columnTitle:'价格(元)',prop:'Price',sortable:true},
                {id:3,columnTitle:'类型',prop:'goodsTpye',sortable:false},
                {id:4,columnTitle:'数量',prop:'goodsNumber',sortable:true}

            ]
        }
    },
    components:{
        workerOrderList
    },
    mounted() {
        this.getAllUserOrderList();
    },
    methods:{
        getAllUserOrderList(){
            let loading = this.$loading({lock:true,text:'玩命加载中...'});
            axios.get(`/workers/allUserOrder?size=${this.pageSize}&page=${this.currentPage}`).then(response=>{
                let res = response.data;
                loading.close();
                if(res.status=='0'){
                    this.notReceiveOrder = res.result.notReceiveOrder;
                    this.totalOrder = Number.parseInt(res.result.totalOrder);
                    if(this.totalOrder <= this.pageSize){
                        this.showPagination = false
                    }
                }else{
                    console.log(res.msg);    
                }
            }).catch(err=>{
                console.log(err);
                
            });
        },
        handleReceiveOrder(orderData){
            // 接单后不可以取消
            this.$confirm('接收订单后不可取消, 是否接单?', 
                '接收订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let loading = this.$loading({lock:true,text:'玩命加载中...'});
                axios.post(`/workers/receiveOrder`,orderData).then(response=>{
                    let res = response.data;
                   loading.close();
                    if(res.status=='0'){
                        this.$message({
                            type: 'success',
                            message: '接单成功!'
                        });
                        gotoNewOrder.$emit('goNewOrder','workerReceivedOrder',2);
                        this.$router.push({ path: 'workerReceivedOrder' });
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
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
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAllUserOrderList();
        }
    }
}
</script>

<style>

</style>
