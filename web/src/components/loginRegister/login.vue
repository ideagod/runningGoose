<template>
    <div class="right-login-body">
        <div class="top-header-cont">
            <div class="head-pic">
                <img src="../../assets/img/login-head-pic.jpg" alt="头像框">
            </div>
        </div>
        <div class="form-cont">
            <el-form :model="loginForm" :rules="loginRules" 
            ref="loginForm" label-width="7rem"
            
            class="user-loginForm">
                <el-form-item  label="账号" prop="userId">
                    <el-input v-model="loginForm.userId"
                    placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input :type='inputType' 
                    v-model="loginForm.passWord"
                    placeholder="请输入密码"></el-input>
                    <i class="toggle el-icon-view"
                    :class="{'color':loginForm.passWord==''}"
                    @click="changeInputType"></i>
                </el-form-item>
                <el-form-item  label="验证码" 
                    class="code" prop="validateCode">
                    <label>
                        <el-input :disabled='disabled'
                        v-model.trim="loginForm.validateCode">
                        </el-input>
                        <ul class="ul-code" @click="handleEditCode">
                            <li class="square"></li>  <li class="square"></li> 
                            <li class="square"></li>  <li class="square"></li>
                            <li class="square"></li>  <li class="square"></li>
                        </ul>
                    </label>
                </el-form-item>
                <div class="rightCode">
                    <div class="rightCode-cont" @click="handlechangeImg">
                        <img :src="codeImg" 
                        class="Code-bg"
                        alt="验证码图片">
                        <span class="randomCode">{{randomCode}}</span>
                    </div>
                </div>
                <el-form-item label="级别 : " class="grade" prop="grade">
                    <el-radio-group v-model.number="loginForm.grade">
                    <el-radio :label="0">普通用户</el-radio>
                    <el-radio :label="1">工作人员</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form> 
        </div>
        <div class="right-cont-btn">
            <el-button type="primary"
            @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
        </div>
        <div class="footer">
            <router-link class="link footer-left" to="/register">注册</router-link>
            <router-link class="link footer-right" to="/forgotPassword">忘记密码?</router-link>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import AES from 'aes-js'
export default {
  data(){
        let validateCode =(rule, value, callback) => {
            if (this.randomCode!=this.$data.loginForm.validateCode) {
                  callback(new Error('验证码不正确 !'));
            }else{
                 callback();
            }
        };
        return{
            disabled : false,
            inputType:'password',
            randomCode:'',
            codeImg:'',
            loginForm:{
                userId:'',
                passWord:'',
                validateCode:'',
                grade:0
            },
            loginRules:{
				// test
                // userId:[
                //     { required: true, message: '请输入账号', trigger: 'blur' },
                //     { pattern:/^1[3-8][0-9]{9}$/ , message:'手机号格式不正确', trigger: 'blur'}
                // ],
                // passWord:[
                //     { required: true, message: '请输入密码', trigger: 'blur' }
                // ],
                // validateCode:[
                //     { required: true, message: '请输入验证码', trigger: 'blur' },
                //     { validator: validateCode , trigger: 'blur'},
                //     { validator: validateCode , trigger: 'change'}                   
                // ]
            },
            validateCodeImg:[
                './static/img/login-Verification-1.png',
                './static/img/login-Verification-2.png',
                './static/img/login-Verification-3.png',
                './static/img/login-Verification-4.png',
            ]
        }
    },
    watch: {
        "loginForm.validateCode": function(newVal){
            if(newVal.length >=6){
                this.disabled = true;
            }
        }
    },
    mounted() {
        this.randomCode=this.randomNum();
        this.codeImg=this.randomCodeimg();
        window.onkeydown = (e)=>{
            let key = window.event.keyCode;
            if(key==13){
                this.submitForm('loginForm');
            }
        }
    },
    methods: {
        handleEditCode(){
            let code = this.loginForm.validateCode;
            if(this.disabled){
                this.loginForm.validateCode = code.slice(0,-1);
            }
            this.disabled = false;
        },
        randomNum(){
            return Math.random().toString(16).slice(-6);
        },
        randomCodeimg(){
            return this.validateCodeImg[Math.floor(Math.random()*4)]
        },
        changeInputType(){
            this.inputType=(this.inputType=='password')?'text':'password';
        },
        handlechangeImg(){
            this.codeImg=this.randomCodeimg();
            this.randomCode=this.randomNum();
        },
        userLogin(router,data){
            axios.post(router,data).then(response=>{
                let res = response.data;                  
                if(res.status=='0'){
                    this.$notify({
                        title: '登录成功',
                        message: '恭喜你! 登录成功!',
                        duration:2000,
                        type: 'success'
                    });
                    this.$router.push({path:'/home'});
                }else{
                    this.$notify({
                        title: '登录失败',
                        message:res.msg,
                        duration:2000,
                        type: 'error' 
                    });
                }
            }).catch(err=>{
                //console.log(err);               
            }); 
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                const key = [6, 9, 16, 11, 3, 6, 2, 3, 4, 2, 8, 2, 5, 9, 8, 2],
                      pwd = this.loginForm.passWord,
                      pwdBytes = AES.utils.utf8.toBytes(pwd),
                      aesCtr = new AES.ModeOfOperation.ctr(key, new AES.Counter(5)),
                      encryptedBytes = aesCtr.encrypt(pwdBytes),
                      encryptPwd = AES.utils.hex.fromBytes(encryptedBytes);
                const userPost = {
					//test
						userId : this.loginForm.userId,
						passWord : encryptPwd,
						grade : this.loginForm.grade		
                };
                this.userLogin('/users/login',userPost);
            } else {
               // console.log('error submit!!');
                return false;
            }
        });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    destroyed() {
       window.onkeydown = null;
    }
 
}
</script>

<style lang='scss'>
.right-login-body{
    position: relative;
    width: 100%;
    height: 100%;
    .top-header-cont{
        padding-top: 1rem;
        .head-pic{
            overflow: hidden;
            width: 4.5rem;
            height: 4.5rem;
            border-radius: 50%;
            margin: 0 auto;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .form-cont{
        width: 90%;
        margin-top: 1rem;
        .el-form-item{
            margin-bottom: 1rem;
            &.grade{
                margin-bottom: 0.3rem;
            }
        }
        .code{
            .el-input__inner{
                outline: none;
                border: none;
                letter-spacing: 2.4rem;
                text-indent: 0.3rem;
            }
            .ul-code{
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-between;
                .square{
                    width: 14%;
                    border: 1px solid #ccc;
                }
            }
        }
        .rightCode{
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: flex-end;
            text-align: right;
            width: 100%;
            margin-top: 0.2rem;
            margin-bottom: 0.2rem;
            cursor: pointer;
        }
        .rightCode-cont{
            position: relative;
            height: 2rem;
            width: 6.5rem;
            .Code-bg{
                width: 100%;
                height: 100%;
            }
        }
        .randomCode{
            position: absolute;
            display: block;
            height: 100%;
            line-height: 1.5rem;
            right: 0;
            top: 50%;
            font-size: 1.1rem;  
            letter-spacing: 0.1rem;
            color: #555; 
            transform:translate(-20%,-45%) rotate(random()*15deg);      
            transform-origin:center;
        }
        .toggle.el-icon-view{
            position: absolute;
            width: 1.5rem;
            height: 1.5rem;
            line-height: 1.5rem;
            top: 50%;
            transform: translate(0,-50%);
            right: 0.2rem;
        }
        .toggle.color{
             color: #ccc;
        }
        // 登录按钮
        .el-button--primary{
            margin-right: 0.5rem;
        }
    }
}
@media only screen and (max-width:1500px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 2.35rem;
    }
}
@media only screen and (max-width:1400px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 2.25rem;
    }
}
@media only screen and (max-width:1200px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 1.90rem;
    }
}
@media only screen and (max-width:1100px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 1.70rem;
    }
}
@media only screen and (max-width:990px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 2.20rem;
    }
}
@media only screen and (max-width:900px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 1.70rem;
    }
}
@media only screen and (max-width:768px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 5.50rem;
        font-size: 2rem;
    }
    .right-login-body .form-cont .rightCode{
        margin-top: 1rem;
        margin-bottom: 1rem;
        .rightCode-cont{
            height: 3rem;
            width: 9rem;
            .randomCode{
                line-height: 3rem;
                font-size: 3rem;
            }
        }
    }
}
@media only screen and (max-width:700px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 5.00rem;
    }
}
@media only screen and (max-width:650px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 4.50rem;
    }
}
@media only screen and (max-width:600px){
    .right-login-body .form-cont .code .el-input__inner{
        letter-spacing: 3.50rem;
    }
}
</style>
