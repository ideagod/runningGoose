<template>
    <div class="orderStep">
        <div class="o-step-title">
            <h1>下单流程</h1>
            <span></span>
        </div>
        <div class="o-step-main">
            <div class="step-line"></div>
            <div class="step-body">
                <div class="setp-item" 
                v-for='it in orderStepData'
                :key='it.id'>
                    <div class="s-item-head">
                        <div class="h-circle">
                            <h2>{{it.title}}</h2>
                        </div>
                    </div>
                    <div class="s-item-body">
                        <p>{{it.tips}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        orderStepData:Array
    }
}
</script>

<style scoped lang='scss'>
@import "../../style/mixin";
$step-body-w:80%;
$circle-h:2.5rem;
.orderStep{
    width: 100%;
    margin-top: 6rem;
}
.o-step-title{
    width: 100%;
    margin-bottom: 5rem;
    h1{
        margin: 0 auto 1rem;
        font-size: 1.1rem;
        letter-spacing: 4px;
        font-size: 1.5rem;
        color: #ec524b;
        &::after{
            content: '/order step';
            font-size: 0.9rem;
            font-family: '\5FAE\8F6F\96C5\9ED1';
            color: #f3eac2;
        }
    }
    span{
        display: block;
        width: 4rem;
        height: 0.1rem;
        margin: 0 auto;
        background-color:  #ec524b;
        background-image: linear-gradient(-225deg, #9ad3bc 0%, #f3eac2 56%, #f5b461 100%);
    }
}
.o-step-main{
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    .step-line{
        width: $step-body-w - 23%;
        height: 0.1rem;
        background-color:lighten(#f5b461,10%);
    }
}
.step-body{
    display: flex;
    justify-content: space-between;
    width:$step-body-w;
    .setp-item{
        width: 30%;
    }
}
.s-item-head{
    display: flex;
    justify-content: center;
}
.h-circle{
    width: $circle-h;
    height: $circle-h;
    line-height: $circle-h;
    margin-top: -1.5rem;    
    text-align: center;
    border: 0.1rem solid #f5b461;
    @include border-radius(50%);
    background-color: #fff;
    h2{
        font-size: 1rem;
        color: #ec524b;
    }
}
.s-item-body{
    padding: 1rem;
    p{
        font-size: 0.7rem;
        line-height: 1.2rem;
        text-align: center;
        letter-spacing: 0.1rem;
        color: #554343;
    }
}
</style>
