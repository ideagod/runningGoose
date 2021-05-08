<template>
    <div class="person-worker-page">
        <div class="person-worker-body">
            <div class="worker-left-menu">
                <leftMenu
                :leftMenuData='leftMenuData'
                @isCollapse='handleIsCollapse'></leftMenu>
            </div>
            <div class="worker-router-cont"
            :class="{'isCollapse-w':isCollapse}">
                <transition name='opa-mini' mode='out-in'>
                    <router-view></router-view>
                </transition> 
            </div>
        </div>
        <appFooter></appFooter>
    </div>
</template>

<script>
import leftMenu from '../leftMenu'
import appFooter from '../../appFooter'
import axios from 'axios'
export default {
    components:{
        leftMenu,
        appFooter
    },
    data(){
        return{
            leftMenuData:[
                {
                    index:"1",
                    icon:'el-icon-location',
                    title:'个人中心',
                    menuItem:[
                        {route:'userInformation',listTitle:'我的信息'},
                         {route:'changePassword',listTitle:'修改密码'}
                    ]
                },
                {
                    index:"2",
                    icon:'el-icon-tickets',
                    title:'我的订单',
                    menuItem:[
                        {route:'workerReceivedOrder',listTitle:'已接订单'},
                        {route:'workerHistoryOrder',listTitle:'历史订单'},
                        {route:'workerFindOrder',listTitle:'查找订单'}
                    ]
                },
                {
                    index:"3",
                    icon:'el-icon-circle-plus',
                    title:'接单大厅',
                    menuItem:[
                        {route:'allUserOrderList',listTitle:'订单列表'}
                    ]
                },
                {
                    index:"4",
                    icon:'el-icon-message',
                    title:'我的消息',
                    menuItem:[
                        {route:'myMessage',listTitle:'消息'}
                    ]
                }
            ],
            isCollapse:false
        }
    },
    methods:{
        handleIsCollapse(newVal){
            this.isCollapse = newVal;
        },
        checkLogin(){
            let loading = this.$loading({lock:true,text:'正在加载...'});
            axios.get("/users/checkLogin").then((response)=>{
                    let res = response.data;
                    loading.close();
                    if(res.status==="0"){
                        if(Number.parseInt(res.result.grade) !==1){
                            this.$message({
                                message: '用户权限不够!',
                                type: 'error',
                                showClose:true
                            });
                            this.$router.push({ path: '/person' });
                        }
                    }else{
                        this.$message({
                            message: '当前未登录!',
                            type: 'error',
                            showClose:true
                        });
                        this.$router.push({ path: '/login' });                      
                    }
            }).catch(err=>{
                 loading.close();
                console.log(err);
            })
        }
    },
    created() {
        this.checkLogin();
    },
}
</script>

<style lang='scss'>
.person-worker-page{
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-color: #f7f7f7;
}
.person-worker-body{
    position: relative;
    display: flex;
    width: 80%;
    margin: 0 auto 5rem; 
}
.worker-left-menu{
    background-color: #fff;
}
.worker-router-cont{
    position: relative;
    width: 100%;
    min-height: 35rem;
    width:  calc(100% - 10.1rem);
    background-color: #fff;
    border: 1px solid rgb(236, 236, 236);
    border-top: none;
    transition: all .5s;
    background-color: #f4f9fd;
    padding-bottom: 3rem;
}
.isCollapse-w{
    width:  calc(100% - 3.3rem);
}
.pageination-oder{  //订单页中的分页样式
    position: absolute;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 2rem;
}
@media only screen and (max-width:1200px){
    .person-worker-body{
        width: 90%;
    }
    .worker-router-cont{
        min-height: 45rem;
    }
}
@media only screen and (max-width:992px){
    .person-worker-body{
        width: 100%;
    }
}
</style>
