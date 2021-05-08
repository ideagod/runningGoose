import Vue from 'vue'
import Router from 'vue-router'

//异步路由
import {loginRegister ,login ,register ,forgotPassword ,changePassword,
  appHeader ,appHome ,aboutUs ,customerService ,suggest ,notFound} from './publicRouter'

import {userPage ,userInformation ,addInformation , choiceOrder,newPicOrder,
  currentOrder ,joinUs ,newOrder ,historyOrder ,myMessage ,userFindOrder} from './userRouter'

import {workerPage ,workerAccount ,workerReceivedOrder ,
  workerHistoryOrder ,allUserOrderList ,workerFindOrder} from './workerRouter'

import {adminLogin ,adminPage ,findPeople ,allUser ,allWorker ,findOneOrder ,allNotReceiveOrder ,
  allReceivedOrder ,allHistoryOrder ,sendMessage ,joinUsApply ,joinUsHistoryApply ,suggestList} from './adminRouter'


// //同步路由
// import loginRegister from '@cpts/loginRegister/loginRegister'
// import login from '@cpts/loginRegister/login'
// import register from '@cpts/loginRegister/register'
// import forgotPassword from '@cpts/loginRegister/forgotPassword'
// import appHeader from '@cpts/appHeader'
// import appHome from '@cpts/home/home'
// import aboutUs from '@cpts/aboutUs/aboutUs'
// import customerService from '@cpts/customerService/customerService'
// import suggest from '@cpts/suggest/suggest'
// import userPage from '@cptsPage/user/user'
// import userInformation from '@cptsPage/userInformation'
// import addInformation from '@cptsPage/user/addInformation'
// import currentOrder from '@cptsPage/user/currentOrder'
// import newOrder from '@cptsPage/user/newOrder'
// import historyOrder from '@cptsPage/user/historyOrder'
// import myMessage from '@cptsPage/myMessage'
// import workerPage from '@cptsPage/worker/worker'
// import workerAccount from '@cptsPage/worker/workerAccount'  
// import workerReceivedOrder from '@cptsPage/worker/workerReceivedOrder' 
// import workerHistoryOrder from '@cptsPage/worker/workerHistoryOrder' 
// import allUserOrderList from '@cptsPage/worker/allUserOrderList' 

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'home'
    },
    {
      path: '/home',
      name:'appHome',
      components:{
        default:appHome,
        header:appHeader
      }
    },
    {
      path: '/login',
      component:loginRegister,
      children:[
          { 
            path:'/',
            component:login
          }
      ]  
    },
    {
      path: '/register',
      component:loginRegister,
      children:[
        { 
          path:'/',
          component:register
        }
      ] 
    },
    {
      path: '/forgotPassword',
      component:loginRegister,
      children:[
        { 
          path:'/',
          component:forgotPassword
        }
      ] 
    },
    {
      path: '/person',
      components:{
        default:userPage,
        header:appHeader
      },
      children:[
        {
          path:'/',
          redirect:'userInformation'  
        },
        {
          path:'userInformation',
          component:userInformation 
        },
        {
          path:'addInformation',
          component:addInformation  
        },
        {
          path:'changePassword',
          component:changePassword
        },
        {
          path:'currentOrder',
          component:currentOrder
        },
		{
		  path:'choiceOrder',
		  component:choiceOrder
		},
		{
		  path:'newPicOrder',
		  component:newPicOrder
		},
        {
          path:'newOrder',
          component:newOrder,
          meta: {
            keepAlive: true 
          } 
        },
        {
          path:'historyOrder',
          component:historyOrder
        },
        {
          path:'userFindOrder',
          component:userFindOrder
        },
        {
          path:'myMessage',
          component:myMessage
        }, 
        {
          path:'joinUs',
          component:joinUs
        }
      ] 
    },
    {
      path: '/workerPerson',
      components:{
        default:workerPage,
        header:appHeader
      },
      children:[
        {
          path:'/',
          redirect:'userInformation'  
        },
        {
          path:'userInformation',
          component:userInformation  
        },
        {
          path:'changePassword',
          component:changePassword 
        },
        {
          path:'workerAccount',
          component:workerAccount  
        },
        {
          path:'workerReceivedOrder',
          component:workerReceivedOrder  
        }, 
        {
          path:'workerHistoryOrder',
          component:workerHistoryOrder  
        },
        {
          path:'workerFindOrder',
          component:workerFindOrder  
        },
        {
          path:'allUserOrderList',
          component:allUserOrderList
        },
        {
          path:'myMessage',
          component:myMessage
        }
      ] 
    },
    {
      path: '/adminLogin',
      component:adminLogin  
    },
    {
      path: '/admin',
      component:adminPage,
      children:[
        {
          path:'/',
          redirect:'allUser'  
        },
        {
          path:'allUser',
          component:allUser  
        },
        {
          path:'allWorker',
          component:allWorker   
        },
        {
          path:'findPeople',
          component:findPeople  
        },
        {
          path:'findOneOrder',
          component:findOneOrder  
        },
        {
          path:'allNotReceiveOrder',
          component:allNotReceiveOrder  
        },
        {
          path:'allReceivedOrder',
          component:allReceivedOrder  
        },
        {
          path:'allHistoryOrder',
          component:allHistoryOrder  
        },
        {
          path:'sendMessage',
          component:sendMessage  
        },
        {
          path:'joinUsApply',
          component:joinUsApply  
        },
        {
          path:'joinUsHistoryApply',
          component:joinUsHistoryApply  
        },
        {
          path:'suggestList',
          component:suggestList  
        }
      ]
    },
    {
      path: '/aboutUs',
      name:'aboutUs',
      components:{
        default:aboutUs,
        header:appHeader
      }
    },
    {
      path: '/customerService',
      name:'customerService',
      components:{
        default:customerService,
        header:appHeader
      }
    },
    {
      path: '/suggest',
      name:'suggest',
      components:{
        default:suggest,
        header:appHeader
      }
    },
    {
      path: '*',
      name:'notFound',
      component:notFound
    }
  ]
})
