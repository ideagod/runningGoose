<template>
    <div class="userLogin">
        <div class="user-login-cont">
            <div class="left-log-cont">
                <div class="log-body">
                    <h2 class="log-title">小鹅快跑</h2>
                    <span class="log-en">Running Goose</span>
                </div>
                <div class="footTip">
                    <span class="f-tip">
                        一一一 帮您实现蜗居生活~
                    </span>
                </div>
            </div>
            <div class="the-right-cont">
                <i class="goto-homePage"
                @click="goToHomePage"></i>
                <transition name='transX-fast'
                mode="out-in">
                     <router-view></router-view>     
                </transition>
            </div>
        </div>
        <transition name='transX'>
            <div class="login-help-tip" 
            @click="handleShowAccount"
            v-if="showTips">
                <div class="crile-tip">
                    <p class="tips">测试账号</p>   
                </div>
            </div>
        </transition>
        <transition name='moveX'>
            <div class="qq-call-me" v-if="showTips" key='bb'>
                <a target="_blank" class="qq-link" href="http://wpa.qq.com/msgrd?v=3&uin=814233583&site=qq&menu=yes">
                    <img class="qq" :src="img" alt="qq联系">
                </a>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data(){
        return{
            showTips : false,
            img : './static/img/login-qq.png'
        }
    },
    methods:{
        goToHomePage(){
            this.$router.push({path:'/home'});
            
        },
        handleShowAccount(){
            this.$notify({
                message : '普通用户: 13223232323 </br> 工作人员: 13434343434 </br> 密码都是: 123456 </br>',
                dangerouslyUseHTMLString : true,
                showClose : true,
                type : "success",
                duration : 0
            })
        }
    },
    mounted() {
        setTimeout(()=>{
            this.showTips = true;
        },500)
    }
}
</script>

<style lang='scss'>
.userLogin{
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-image: linear-gradient(-225deg, #f5b461 0%, #EACCF8 48%, #9ad3bc 100%);
}
.user-login-cont{
    display: flex;  
    align-items: center;
    justify-content: center;
    width: 60%;
    min-width: 40rem;
    height: 26rem;
}
.left-log-cont{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 55%;
    height: 100%;
    background-color: rgba(165, 167, 172, 0.2);
    .log-body{
        margin-top: -5rem;
    }
    .log-title{
        font-size: 1.5rem;
        color:#555;
    }
    .log-en{
        font-size: 0.8rem;
        color: #777;
    }
    .footTip{
        position: absolute;
        bottom: 2rem;
        right: 3rem;
        .f-tip{
            color: #777;
            letter-spacing: 0.05rem;
        }
    }
}
.the-right-cont{
    position: relative;
    overflow: hidden;
    width: 45%;
    min-width: 17rem;
    height: 100%;
    background-color: #fff;   
    .right-cont-btn{
        margin-top: 2rem;
        .el-button{
            margin: 0 1rem;
        }
    }
    .goto-homePage{
        position: absolute;
        display: block;
        width: 2.5rem;
        height: 2.5rem;
        background-image: url('../../assets/img/loginPage.png');
        background-repeat: no-repeat;
        background-size:1.6rem 1.6rem;
        background-position: right bottom;
        opacity: .3;
        z-index:99;
    }
    .footer{
        position: absolute;
        display: flex;
        justify-content:space-between;
        width: 100%;
        bottom: 0.8rem;
        .link{
            display: block;
            height: 1rem;
            line-height: 1rem;
            font-size: 0.8rem;
            color: #888;
            &:hover{
                color: rgb(238, 138, 138);
            }
        }
        .footer-left{
            margin-left: 1.5rem;
        }
        .footer-right{
            margin-right: 1.5rem;
        }
    }
}
.login-help-tip{
    $tip-width : 5rem;
    position: absolute;
    top: 5%;
    right: 5%;
    width: $tip-width;
    height: $tip-width /2;
    cursor: pointer;
    .crile-tip{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,.1);
        &:hover{
          background-color: rgba(0,0,0,.2);
        }
        .tips{
            font-size: 0.7rem;
            letter-spacing: 0.1rem;
            color: #d8d8d8;
        }
    }
}
.qq-call-me{
    $qq-cont-width : 2rem;
    position: absolute;
    right: 1.5rem;
    .qq-link{
        display: block;
        width: $qq-cont-width;
        height: $qq-cont-width;
        .qq{
            width: 100%;
            height: 100%;
        }
    }

}
@media only screen and (max-width:992px){
    .user-login-cont{
        width: 70%;
    }
    .left-log-cont{
        width: 50%;
    }
    .the-right-cont{
        width: 50%;
    }
}
@media only screen and (max-width:768px){
    .user-login-cont{
        width: 100%;
        height: 100%;
    }
    .left-log-cont{
        display: none;
    }
    .the-right-cont{
        width: 80%;
        height: 70%;
        min-height: 40rem;
    }
}
</style>
