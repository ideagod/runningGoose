<template>
    <div class="copyRight">
        <h5 class="owner">
            所有方 : <em>小鹅快跑工作室</em> |
             <el-tooltip class="item" effect="dark" 
             content="营业执照" placement="top">
                 <a href="javascript:void(0)">营业执照</a>
             </el-tooltip>         
        </h5>    
        <p>
            <a href="http://www.miibeian.gov.cn" target="_black">粤ICP备20210113号-1 </a>
            | 广东行政管理 
            Copyright @2020-{{new Date().getFullYear()}}
            小鹅快跑 All Rights Reserved
        </p>       
    </div>
</template>

<script>
export default {

}
</script>

<style lang='scss' scoped>
.copyRight{
    position: relative;
    width: 100%;
    padding-bottom: 5rem;
    p{
        color: #666;
        font-size: 0.7rem;
        a{
            color: #666;
            &:hover{
                color: #000;
                text-decoration: underline;
            }
        }
    }
}
.owner{
    display: block;
    margin-bottom: 0.6rem;
    a{
        color: #000;
        &:hover{
            color: red;
        }
    }    
}
</style>
