<template>
    <div class="workerHistoryOrder">
        <person-title>当前位置 :: 我的订单 >> <em>历史订单</em></person-title>
        <div class="workerHistoryOrder-cont">
            <workerOrderList
                :userOrder='historyOrder'
                :rightOptBtn='rightOptBtn'
                :titleList='titleList'
                @deleteOrder='handleDeleteOrder'>
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
export default {
    data(){
        return {
            historyOrder:[],
            currentPage : 1,
            pageSize : 10,
            totalOrder : 0,
            showPagination : true,
            rightOptBtn:'historyBtn',// 'receiveOrderBtn'  // 'historyBtn'    
            titleList:[
                {id:1,columnTitle:'完成时间',prop:'completedData',sortable:true},
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
        this.gehistoryOrderList();
    },
    methods:{
        gehistoryOrderList(){
            let loading = this.$loading({lock:true,text:'玩命加载中...'});
            axios.get(`/workers/historyOrder?size=${this.pageSize}&page=${this.currentPage}`).then(response=>{
                let res = response.data;
                loading.close();
                if(res.status=='0'){
                    this.historyOrder = res.result.historyOrder;
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
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.gehistoryOrderList();
        }
    }
}
</script>

<style>

</style>
