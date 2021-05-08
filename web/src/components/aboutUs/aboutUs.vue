<template>
    <div class="aboutUs">
        <div class="abt-header">
            <img src="../../../static/img/aboutUs-header-bg.jpg" alt="关于我们背景图片">
        </div>
        <topArticle :topArticle='topArticle'></topArticle>
        <myStory 
        :myStoryBody='myStoryBody'>
        </myStory>
        <advantage
        :advantage='advantage'
        :achievementData='achievementData'></advantage>
        <appFooter></appFooter>        
    </div>
</template>

<script>
import topArticle from './topArticle'
import myStory from './myStory'
import advantage from './advantage'
import appFooter from '../appFooter'
export default {
    data(){
        return{
            topArticle:`
                小鹅快跑为您提供专业设计解决方案。通过研究
                    商业模式提供优秀的品牌整合解决方案来定义品牌模式，
                    令品牌更具竞争力，利于企业长远发展，好的品牌形象，
                	需要有好的标志，有助于提升企业的知名度。
            `,
            myStoryBody:[
                {
                    id:1,contImg:'./static/img/aboutUs-article-pic01.jpg',
                    bindClass:'Purpose',
                    title:'我们的宗旨',
                    article:`公司创意定位 为您提供了众多广告条件，
                    助您快速找准方向运用各种渠道， 量身定制合理的方案.
                    创造有影响力的网站形象与口碑，让我们的创意变得更 
                    具有商业价值，好看+好用+激发消费购买欲望`
                },
                {
                    id:2,contImg:'./static/img/aboutUs-article-pic02.jpg',
                    title:'我们的团队',
                    bindClass:'ourTeam',
                    article:`为客户提供优质的服务，及时快速跟进。
                    好的品牌形象有助于提升企业好的品牌形象 
                    有助于提升企业整体竞争力。使企业形象和产品
                    品牌在消费者脑海中形成一种个性化 的区隔，
                    从而建立起客户的品牌声浪`
                }
            ],
            advantage:{
                title:'平台优势',
                article:`小鹅快跑为您提供专业设计解决方案。通过研究
                    商业模式提供优秀的品牌整合解决方案来定义品牌模式，
                    令品牌更具竞争力，利于企业长远发展，好的品牌形象，
					需要有好的标志，有助于提升企业的知名度。`                               
            },
            achievementData:[
                {title:'成立时间',data:2020},
                {title:'全国站点',data:417},
                {title:'加盟人数',data:2522},
                {title:'成交订单',data:51122}
            ] 

        }
    },
    components:{
        appFooter,
        topArticle,
        myStory,
        advantage
    },
    mounted() {      
        this.$emit('scrollShowComponent',this.$children);
    },
    destroyed(){
        this.$emit('pageDestroyed');
    }
}
</script>

<style  lang='scss'>
.aboutUs{
    position: relative;
    P{
        text-indent: 2rem;
    }
}
.abt-header{
    position: relative;
    img{
        display: block;
        width: 100%;
        height: auto;
        max-height: 100%;
    }

}

</style>
