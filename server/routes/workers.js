var express = require('express');
var router = express.Router();
var worker = require('./../models/worker');
var User = require('./../models/user');
require('./../public/js/dateInit')
function errTip(res,errmsg=err.message){
    res.json({
      status:"1",
      msg:errmsg,
      result:'',
	  test:"workers"
    });
}
//用户余额
router.get('/balance', (req, res, next)=> {
    let userId = req.session.userId;
    worker.findOne({userId:userId},(err,doc)=>{
         if(err){
           errTip(res);
         }else{
             if(!doc){
               errTip(res,'用户不存在');
               return
             }
             res.json({
               status:"0",
               msg:'',
               result:{
                   balance:doc.balance,
                   alipayAccountzhiFuBao:doc.alipayAccountzhiFuBao,
                   alipayAccountBankCard:doc.alipayAccountBankCard
               }
             }) 
         }              
     });
 });

//用户提现
router.post('/cashWithDraw', (req, res, next)=> {
    var param = {
        alipayType:req.body.alipayType,
        alipayAccount:req.body.alipayAccount,
        WithDrawNum:req.body.WithDrawNum
    }
    worker.findOne({userId:req.session.userId},(err,doc)=>{
        if(err){
            errTip(res);
        }else{
            if(!doc){
                errTip(res,"用户不存在");
                return 
            }
            if(param.alipayType=='支付宝'){
                let flag =doc.alipayAccountzhiFuBao.every(it=>it.value!=param.alipayAccount);
                flag && doc.alipayAccountzhiFuBao.push({value:param.alipayAccount});
            }else if(param.alipayType=='银行卡'){
                let flag =doc.alipayAccountBankCard.every(it=>it.value!=param.alipayAccount);
                flag && doc.alipayAccountBankCard.push({value:param.alipayAccount});
            }

            if(param.WithDrawNum > doc.balance){
                return errTip(res,'提现金额大于余额!');
            }

            doc.balance -= Number.parseInt(param.WithDrawNum);
            const handleTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
            const message = {
                "title" : `用户申请提现(${handleTime})`,
                "cont" : `您在${handleTime} 申请提现, 金额为${param.WithDrawNum} 元,
                            提现方式为 ${param.alipayType} , 尾号为${param.alipayAccount.slice(-4)}的账户.
                            24小时内到账, 如有疑问 请致电客服. 感谢您的使用,欢迎再次使用,祝您生活愉快!`, 
                "sendTime" : handleTime
                }
            doc.messages.push(message);
            doc.save((err1,doc1)=>{
                if(err1){
                    errTip(res,'保存数据失败,请重试!');
                }else{        
                    res.json({
                    status:"0",
                    msg:'',
                    result:''
                    }) ;
                }              
            }); 
        }
    });
});

//工作人员 接单大厅 所有普通用户的未接订单           
router.get('/allUserOrder', (req, res, next)=> {
    let orderData = {
        currentPage : Number.parseInt(req.query.page),
        pageSize : Number.parseInt(req.query.size)
    }
    User.find({},(err,doc)=>{
         if(err){
           errTip(res);
         }else{
             if(!doc){
               errTip(res,'没有订单或者获取异常');
               return
             }
             let order = doc.filter(it=>it.userOrderList.length);
             let orderList = [];
             order.forEach(item=>{
                 var arr = item.userOrderList.filter(it=>it.orderState=='未接单');
                 arr.length && (orderList=[...orderList,...arr]);
             })
            let start = orderData.pageSize * (orderData.currentPage-1);
            let notReceiveOrder = orderList.slice(start,start+orderData.pageSize);
             res.json({
               status:"0",
               msg:'',
               result:{
                notReceiveOrder : notReceiveOrder,
                totalOrder : orderList.length
               }
             }); 
         }              
     });
 });

//接单大厅中 接收订单  
router.post('/receiveOrder', (req, res, next)=> {
    let param = req.body;
    worker.findOne({userId:req.session.userId},(err,workerdoc)=>{
         if(err){
           errTip(res);
         }else{
             if(!workerdoc){
               errTip(res,'用户不存在!');
               return
             }
             let num = workerdoc.workerOrderList.filter(it=>it.orderState==='已接单');
            if(num.length >= 3){
                errTip(res,'已接订单过多! 请先完成订单后继续接单.');
                return
            }
             let receiveTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
             param.orderState = '已接单';
             param.receivedDate = receiveTime;
             workerdoc.workerOrderList.push(param);
             workerdoc.save((err1,workerdoc1)=>{
                if(err1){
                    errTip(res,'工作人员数据保存失败');
                }else{        
                    User.findOne({
                        phoneNum:param.createOrderPeoplePhone,
                        userName:param.createOrderPeople
                       },(err2,userdoc)=>{
                           if(err2){
                               errTip(res,'该订单用户数据读取失败');
                           }else{
                              if(!userdoc){
                                errTip(res,'该订单用户不存在或者查询失败!');
                                return
                              }
                              userdoc.userOrderList.forEach(it=>{
                                  if(it.orderId == param.orderId){
                                      it.orderState='已接单';
                                      it.courierPeople = workerdoc.userName;
                                      it.courierPhone = workerdoc.phoneNum;
                                      it.receivedDate = receiveTime;
                                  }
                              });
                              userdoc.save((err1,userdoc1)=>{
                                if(err1){
                                    errTip(res,'该订单用户数据保存失败!');
                                }else{  
                                     res.json({
                                       status:"0",
                                       msg:'',
                                       result:''
                                     }) 
                                }
                              });
                           }
                    });
                }              
             });
         }              
     });
 });

 //工作人员 已接订单  
 router.get('/theReceivedOrder', (req, res, next)=> {
    worker.findOne({userId:req.session.userId},(err,doc)=>{
         if(err){
           errTip(res);
         }else{
             if(!doc){
               errTip(res,'用户不存在!');
               return
             }
             let received = doc.workerOrderList.filter(it=>it.orderState=='已接单');
             res.json({
               status:"0",
               msg:'',
               result : received
             }); 
         }              
     });
 });

 //已接订单页 点击完成订单  
 router.post('/completedOrde', (req, res, next)=> {
    let orderData = req.body;
    User.findOne({
        userName:orderData.createOrderPeople,
        phoneNum:orderData.createOrderPeoplePhone
    },(err,doc)=>{
         if(err){
           errTip(res);
         }else{
             if(!doc){
               errTip(res,'用户不存在!');
               return
             }
             let sendTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
             let message = {
                "title" : `送单员申请完成订单(${sendTime})`,
                "cont" : `您在${orderData.createTime} 发布的订单已完成配送,
                          送单员 : ${orderData.createOrderPeople} , 电话:${orderData.createOrderPeoplePhone}
                          订单号:${orderData.orderId} 已经申请完成订单,您是否收到快递? 收到快递则可在 
                          我的订单>>当前订单 或者 查找订单 选择确认送达. 很高兴为您服务,欢迎再次使用`, 
                "sendTime" : sendTime
             }
             doc.messages.push(message);
             doc.save((err1,doc1)=>{
                if(err1){
                    errTip(res,'该订单发布人员数据保存失败');
                }else{   
                    res.json({
                        status:"0",
                        msg:'',
                        result:''
                    }); 
                }
             });
         }              
     });
 });

 //历史订单 
 router.get('/historyOrder', (req, res, next)=> {
    let order = {
        currentPage : Number.parseInt(req.query.page),
        pageSize : Number.parseInt(req.query.size)
     }
    worker.findOne({userId:req.session.userId},(err,doc)=>{
         if(err){
           errTip(res);
         }else{
             if(!doc){
               errTip(res,'用户不存在!');
               return
             }
             let history = doc.workerOrderList.filter(it=>it.orderState=='已完成');
             let start = order.pageSize * (order.currentPage-1);
             let historyOrder = history.slice(start,start+order.pageSize);
             res.json({
               status:"0",
               msg:'',
               result:{
                    historyOrder : historyOrder,
                    totalOrder : history.length
               }
             }); 
         }              
     });
 });

 //查找订单 
 router.post('/searchOrder', (req, res, next)=> {
    let orderId = req.body.answers;
      worker.findOne({userId:req.session.userId},(err,doc)=>{
        if(err){
          errTip(res);
        }else{
            if(!doc){
              return errTip(res,"用户不存在!");
            }
            let findOrder = doc.workerOrderList.filter(it=>it.orderId==orderId);
            res.json({
            status:"0",
            msg:'',
            result : findOrder
            }) ;
        }
      });
  });

 //历史订单中 删除订单 删除后不可恢复 deleteOrder
 router.post('/deleteHistoryOrder', (req, res, next)=> {
    let orderId = req.body.orderId;
        worker.update({
          userId:req.session.userId
        },{
            $pull:{
                workerOrderList:{
                orderId:orderId,
                orderState:'已完成'
              }
            }
        },(err,doc)=>{
            if(err){
              errTip(res);
            }else{
                if(doc.nModified){ //删除数量不为0
                    res.json({
                      status:"0",
                      msg:'',
                      result:''
                    })
                }else{
                  errTip(res,'删除失败,未知错误');
                }
            }              
        });
  });
module.exports = router;