<template>
    <div class="sug-title">
        <div class="circle-top"></div>
        <div class="title-cont">  
            <div class="line-y"></div>
            <div class="circle" @click="$emit('cahngeShow')">
                 <h2>OFF</h2>
                 <h2 class="show">ON</h2>
            </div>  
        </div>     
   </div>
</template>

<script>
export default {

}
</script>

<style scoped lang='scss'>
@import '../../style/mixin';
$title-h:10rem; 
$circle-top-h:1rem;
$cicle-h:3rem;
.sug-title{
    display: flex;
    justify-content: center;
    height:$title-h;
}
.circle-top{
    position: absolute;
    width: $circle-top-h;
    height: $circle-top-h;
    @include border-radius(100%);
    border: 0.15rem solid #f5b461;
}
.title-cont{  
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;
    cursor: pointer;
    z-index: 66;
    transform-origin: center top;
    @include transition(.6s);
    animation: rotateline 3s infinite ease-in-out alternate;
    &:hover{
        animation-play-state:paused;
        -webkit-animation-play-state:paused; 
    }
    .line-y{
        width: 0.3rem;
        height: $title-h -$cicle-h;
        background-color: #f5b461;
        @include border-radius(0.3rem);
        background-image: linear-gradient(to top, #f5b461 0%, #9ad3bc 28%, #cd8ad3 42%, #cbff8e 79%, #d4bef3 100%);
    }
    .circle{   
        position: relative;
        overflow: hidden;
        width:$cicle-h;
        height: $cicle-h;
        line-height: $cicle-h;
        margin-top: -0.1rem;
        @include border-radius(100%);
        border: 0.1rem solid #f5b461;
        background-color: #f5b461;
        background-image: linear-gradient(to top, #9ad3bc 0%, #f5b461 100%);
        &:hover{
            background-image: linear-gradient(to top, #9ad3bc 0%, #f5b461 100%);
        }
        .show{
            display: none;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;
        }
        &:hover h2{
            font-size: 0;
        }
        &:hover h2.show{
            display: block;
            font-size: 0.7rem;
        }
        h2{
            width: 100%;
            color: #fff;
            letter-spacing: 0.1rem;
            font-size: 0.6rem;
        }
    }
}
@keyframes rotateline{
    0%{
        @include rotate(-60deg)
    }
    100%{
        @include rotate(60deg)
    }
}
</style>
