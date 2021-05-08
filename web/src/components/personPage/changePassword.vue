<template>
    <div class="changePassword-page">
        <person-title>当前位置 :: 个人中心 >> <em>修改密码</em></person-title>
        <div class="changePassword-cont">
            <div class="form-cont">
                <div class="password-input">
                    <el-input v-model="passwordform.oldPassword" :type='inputType' 
                        placeholder="原密码"></el-input>
                    <i class="toggle el-icon-view"
                        :class="{'color':passwordform.oldPassword ===''}"
                        @click="changeInputType"></i>
                </div>
                <div class="password-input">
                    <el-input v-model="passwordform.newPassword" :type='inputType'  
                        placeholder="新密码"></el-input>
                    <i class="toggle el-icon-view"
                        :class="{'color':passwordform.oldPassword ===''}"
                        @click="changeInputType"></i>
                </div>
                <div class="password-input">
                    <el-input v-model="passwordform.agNewPassword" :type='inputType' 
                        @keydown="handleChangePassword"
                        placeholder="再次输入新密码"></el-input>
                    <i class="toggle el-icon-view"
                        :class="{'color':passwordform.oldPassword ===''}"
                        @click="changeInputType"></i>
                </div>
                <el-button class="change" 
                    type="primary" plain
                    @click="handleChangePassword">确认修改</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import AES from 'aes-js'
import axios from 'axios'
export default {
    data(){
        return{
            inputType:'password',
            passwordform : {
                oldPassword : '',
                newPassword : '',
                agNewPassword : ''
            }
        }
    },
    mounted() {
         window.onkeydown = (e)=>{
            let key = window.event.keyCode;
            if(key==13){
                this.handleChangePassword();
            }
        }
    },
    methods: {
        testform(){
            let form = this.passwordform;
            return (form.oldPassword === "") && '原密码不能为空!' ||
                    (form.newPassword === "") && '新密码不能为空!' ||
                    (form.newPassword.length < 6) && '密码不能少于6位!' ||
                    (form.agNewPassword === "") && '请再次输入新密码!' ||
                    (form.agNewPassword !== form.newPassword) && '两次密码不一样!' || '';
        },
        changeInputType(){
            this.inputType=(this.inputType=='password')?'text':'password';
        },
        handleChangePassword(){
            let tip = this.testform();
            if(tip === ''){
                const key = [4, 9, 16, 14, 3, 6, 2, 8, 4, 5, 8, 2, 7, 9, 4, 5],
                      pwd = this.passwordform.newPassword,
                      pwdBytes = AES.utils.utf8.toBytes(pwd),
                      aesCtr = new AES.ModeOfOperation.ctr(key, new AES.Counter(5)),
                      encryptedBytes = aesCtr.encrypt(pwdBytes),
                      encryptPwd = AES.utils.hex.fromBytes(encryptedBytes),
                      postData ={
                        "oldPassword" : this.passwordform.oldPassword,
                        "newPassword" : encryptPwd
                      };

                axios.post('/users/changePassword',postData).then(response=>{
                    let res = response.data; 
                    if(res.status=='0'){
                        this.$message({
                            message: '修改成功!',
                            type: 'success',
                            showClose : true
                        });
                        this.$router.push({path:'/login'});
                        axios.post("/users/logout").then((response)=>{
                                let res = response.data;
                                if(res.status=="0"){
                                    this.$store.commit("saveUserInfo",{userId:'',userName:''});
                                   // console.log('退出成功');   
                                }else{
                                console.log(res.msg);                      
                                }
                        }).catch(err=>{
                            console.log(err);
                        })
                    }else{
                       this.$message({
                            message: res.msg,
                            type: 'error',
                            showClose : true
                        });
                    }
                }).catch(err=>{
                    console.log(err);
                 }); 
            }else{
                this.$message({
                    message: tip,
                    type: 'error'
                });
            }
            
        }
    },
    destroyed() {
       window.onkeydown = null;
    }
}
</script>

<style lang="scss" scoped>
.changePassword-page{
    position: relative;
}
.changePassword-cont{
    position: relative;
    margin: 5rem auto 0;
    width: 50%;
    .el-input{
        margin-bottom: 1rem;
    }
    .change{
        margin-top: 1.5rem;
    }
}
.form-cont{
    .password-input{
        position: relative;
    }
    .toggle.el-icon-view{
        position: absolute;
        width: 1.5rem;
        height: 1.5rem;
        line-height: 1.5rem;
        top: 35%;
        transform: translate(0,-50%);
        right: 0.2rem;
    }
    .toggle.color{
            color: #ccc;
    }
}
@media only screen and (max-width:768px){
    .changePassword-cont{
        width: 70%;
    }
}
</style>

