<template>
    <div class="not-found-page">
        <div class="link">
            <router-link class="home" to="/home">返回主页</router-link>
        </div>
        <div class="lost-cont">
            <h2 class="not-title">404</h2>
            <P class="lost">page not found</P>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.not-found-page{
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.link{
    position: absolute;
    right: 5%;
    top: 5%;
    .home{
        font-size: 18px;
        color: #999;
        &:hover{
            color: #ff0036;
        }
    }
}
.lost-cont{
    position: relative;
    .not-title{
        font-size: 8rem;
        color: #f5b461;
    }
    .lost{
        font-size: 1.5rem;
        color: #777;
    }
}
</style>
