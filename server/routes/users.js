let express = require('express');
let router = express.Router();
let User = require('./../models/user');
let worker = require('./../models/worker');
let AES = require('aes-js');
require('./../public/js/dateInit')
function errTip(res,errmsg=err.message){
    res.json({
      status:"1",
      msg:errmsg,
      result:'',
	  test:"users"
    });
}
//判断级别 grade只能为 0 或者 1
function userGrade(grade){
  if(Number.parseInt(grade)==0){
      return User;
  }else if(Number.parseInt(grade)==1){
      return worker;
  }
}
//普通用户 和 工作人员有些部分是一样的或者类似 
//储存用户级别 根据用户级别 修改对应的数据库集合
//相同的或者类似放 users路由 不同的在 workers路由

// 注册时候判断账号是否存在
router.get('/userExistence', (req, res, next)=> {
  let userId = req.query.userId;
  User.findOne({userId:userId},(err,doc)=>{
        if(err){
          errTip(res);
        }else{
            if(doc){
              errTip(res,'用户已存在');
              return
            }
            res.json({
              status:"0",
              msg:'',
              result:''
            })   
        }              
  });
});

// 注册
router.post('/register', (req, res, next)=> {
    const regDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

    const key = [9, 6, 13, 11, 7, 6, 2, 8, 4, 6, 8, 2, 7, 4, 9, 3];
    const encryptedBytes = AES.utils.hex.toBytes(req.body.passWord);
    const aesCtr = new AES.ModeOfOperation.ctr(key, new AES.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    const passWord = AES.utils.utf8.fromBytes(decryptedBytes);

    let param = {
      userId : req.body.userId,
      phoneNum : req.body.userId,
      passWord : passWord,
      regDate : regDate,
      passwordQuestion : req.body.passwordQuestion,
      questionAnswer : req.body.questionAnswer
     }
  User.findOne({userId:param.userId},(err,doc)=>{
        if(err){
          errTip(res);
        }else{
            if(doc){
              errTip(res,'用户已存在');
              return
            }
            let user = new User(param);
            let message ={
                "title" : `欢迎新用户(${regDate})`, 
                "cont" : `您在 ${regDate} 注册本账号,
                您在个人中心>>完善个人信息(名字不可随便写,为了您的安全,
                以及资金问题,请保证正确),然后便在 我的订单>>发布订单啦,.
                感谢您的加入, 祝您生活愉快!`, 
                "sendTime" : regDate
            }
            user.messages.push(message);
            user.save((err1, doc1)=> {
              if (err1) {
                errTip(res);
              }
              else {
                  res.json({
                    status:"0",
                    msg:'',
                    result:''
                  }) 
              }
            });
        }              
  });
});

//登录
router.post('/login', (req, res, next)=> {
  const loginTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
  //解密
  const key = [6, 9, 16, 11, 3, 6, 2, 3, 4, 2, 8, 2, 5, 9, 8, 2];
  const encryptedBytes = AES.utils.hex.toBytes(req.body.passWord);
  const aesCtr = new AES.ModeOfOperation.ctr(key, new AES.Counter(5));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const passWord = AES.utils.utf8.fromBytes(decryptedBytes);

  const param = {
    userId : req.body.userId,
    passWord : passWord,
    grade : req.body.grade
  }
  let Who = userGrade(param.grade);
  Who.findOne(param,(err,doc)=>{
      if(err){
        errTip(res);
      }else{
          if(!doc){
            errTip(res,'用户不存在或密码不正确!');
            return
          }
          //cookie不安全,可以篡改 所以用session
          req.session.userId=doc.userId;
          req.session.grade=Number.parseInt(doc.grade);
          req.session.userName=doc.userName ||'';
          // res.cookie("userId",doc.userId,{
          //   path:'/',
          //   maxAge:1000*60*60*24
          // });
          // res.cookie("grade",parseInt(doc.grade),{
          //   path:'/',
          //   maxAge:1000*60*60*24
          // });
          // let userName = doc.userName ? doc.userName :'';
          // res.cookie("userName",userName,{
          //   path:'/',
          //   maxAge:1000*60*60*24
          // });
          doc.loginTime=loginTime; //退出时要把本次登录时间赋值上次登录时间
          doc.save((err1, res1)=> {
            if (err1) {
              errTip(res);
            }
            else {
                res.json({
                  status:"0",
                  msg:'',
                  result:{
                    userId:doc.userId,
                    grade:doc.grade
                  }
                }) 
            }
          }); 
      }              
});
});

//检测是否登录
router.get("/checkLogin", function (req,res,next) {
  if(req.session.userId){
      res.json({
        status:'0',
        msg:'',
        result:{
          userName:req.session.userName=='undefined'?'':req.session.userName,
          userId:req.session.userId,
          grade:Number.parseInt(req.session.grade)
        } 
      });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});

//退出
router.post("/logout", function (req,res,next) {
  let Who = userGrade(req.session.grade);
  Who.findOne({userId:req.session.userId},(err,doc)=>{
    if(err){
      errTip(res);
    }else{
        doc.lastLoginTime=doc.loginTime; //退出时把本次登录时间赋值上次登录时间
        doc.save((err1, res1)=> {
            if (err1) {
              errTip(res);
            }
            else {
              req.session.userId=null;
              req.session.grade=null;
              req.session.userName=null;
              res.json({
                status:"0",
                msg:'',
                result:''
              })
            }
        }); 
    }              
  });
});

//找回密码
router.post('/forgotPassWord', (req, res, next)=> {
  let param = {
      userId:req.body.userId,
      passwordQuestion:req.body.passwordQuestion,
      questionAnswer:req.body.questionAnswer,
      grade:req.body.grade
  }
  let Who = userGrade(param.grade);
  Who.findOne(param,(err,doc)=>{
      if(err){
        errTip(res);
      }else{
          if(!doc){
            errTip(res,'用户不存在,或者密保错误!');
            return
          }
          res.json({
            status:"0",
            msg:'',
            result:{
              passWord:doc.passWord
            }
          }) 
      }              
});
});

//用户信息
router.get('/userInformation', (req, res, next)=> {
   let userId = req.session.userId,
      grade = req.session.grade,
      orderList = Number.parseInt(grade)==0?'userOrderList':'workerOrderList';
  let Who = userGrade(grade);
  Who.findOne({userId:userId},(err,doc)=>{
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
                  userName:doc.userName,
                  gender:doc.gender, 
                  grade:doc.grade,  
                  balance:doc.balance, 
                  phoneNum:doc.phoneNum,
                  address:doc.address,
                  lastLoginTime:doc.lastLoginTime,
                  regDate:doc.regDate,
                  userId:doc.userId,
                  orderNum:doc[orderList].length
              }
            }) 
        }              
    });
});

//用户信息中 修改联系电话 
router.get('/userInformation/ChangePhone', (req, res, next)=> {
  let phoneNum = req.query.phoneNum;
  let Who = userGrade(req.session.grade);
  Who.update({userId:req.session.userId},{phoneNum:phoneNum},(err,doc)=>{
       if(err){
         errTip(res);
       }else{
           res.json({
             status:"0",
             msg:'',
             result:''
           }) 
       }              
   });
});

//用户信息中 修改联系地址
router.get('/userInformation/ChangeAddress', (req, res, next)=> {
  let newAddress = req.query.newAddress;
  let Who = userGrade(req.session.grade);
  Who.update({userId:req.session.userId},{address:newAddress},(err,doc)=>{
       if(err){
         errTip(res);
       }else{
           res.json({
             status:"0",
             msg:'',
             result:''
           }) 
       }              
   });
});

//个人中心  修改密码
router.post('/changePassword', (req, res, next)=> {
  let param = {
    oldPassword : req.body.oldPassword,
    newPassword : req.body.newPassword
  }
  const Who = userGrade(req.session.grade);
  const key = [4, 9, 16, 14, 3, 6, 2, 8, 4, 5, 8, 2, 7, 9, 4, 5];
  const encryptedBytes = AES.utils.hex.toBytes(param.newPassword);
  const aesCtr = new AES.ModeOfOperation.ctr(key, new AES.Counter(5));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const passWord = AES.utils.utf8.fromBytes(decryptedBytes);
  
  Who.findOne({userId:req.session.userId, passWord:param.oldPassword},(err,doc)=>{
      if(err){
        return errTip(res);
      }
      if(!doc){
        return errTip(res,'账号不存在,或原密码不正确!');
      }
      doc.passWord = passWord;
      doc.save((err1,doc1)=>{
        if(err1){
          errTip(res,'储存密码时错误! 请重试');
        }else{
          res.json({
            status:"0",
            msg:'',
            result : ''
          }) ;
        }
      })
      
  });
});

//完善或者更新个人信息
router.post('/addInformation', (req, res, next)=> {
  let param = {
    userName:req.body.userName,
    phoneNum:req.body.phoneNum,
    gender:req.body.gender,
    address:req.body.address
  }
    User.findOne({userId:req.session.userId},(err,doc)=>{
      if(err){
        errTip(res);
      }else{
          if(doc.userName){
            errTip(res,"不可二次修改");
          }else{
            Object.assign(doc, param);
            doc.save((err1,doc1)=>{
              if(err1){
                errTip(res);
              }else{        
                res.json({
                  status:"0",
                  msg:'',
                  result:''
                }) ;
              }              
            });
          }  
      }
    });
});

//发布订单
router.post('/newOrder', (req, res, next)=> {
    let param = {
      goodsTpye:req.body.goodsTpye,
      goodsSize:req.body.goodsSize,
      company:req.body.company,
      goodsCode:req.body.goodsCode,
      Price:req.body.Price,
      goodsNumber:req.body.goodsNumber,
      remarks:req.body.remarks
    }
    User.findOne({userId:req.session.userId},(err,doc)=>{
      if(err){
        errTip(res);
      }else{
          if(!doc){
            errTip(res,'没有该账户信息');
            return
          }
          let createTime = new Date().Format('yyyy-MM-dd hh:mm:ss'),
              nowTime =  new Date().Format('yyMMddhhmmss'),
              orderId = doc.userId.slice(-4) + nowTime,//手机号后5位 +年月日时分秒
              orterOrderData = {
                orderId:orderId,
                createTime:createTime,
                createOrderPeople:doc.userName,
                createOrderPeoplePhone:doc.phoneNum,
                address:doc.address
              }
          let newOrder =  Object.assign(param,orterOrderData);//合并
          doc.userOrderList.push(newOrder);
          doc.save((err1,doc1)=>{
            if(err1){
              errTip(res);
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

//用户未完成订单(当前订单)
router.get('/userCurrentOrder', (req, res, next)=> {
   let order = {
      currentPage : Number.parseInt(req.query.page),
      pageSize : Number.parseInt(req.query.size)
   }
   User.findOne({userId:req.session.userId},(err,doc)=>{
       if(err){
         errTip(res);
       }else{
           if(!doc){
             errTip(res,'用户不存在');
             return
           }
           let orderList = doc.userOrderList.filter(it=>it.orderState!='已完成');
           let start = order.pageSize * (order.currentPage-1);
           let currentOrder = orderList.slice(start,start+order.pageSize);
           res.json({
             status:"0",
             msg:'',
             result:{
               orderList : currentOrder,
               totalOrder : orderList.length
             }
           }) 
       }              
   });
});

//用户取消订单 (如果已接单不可取消)
router.get('/cancelCurrentOrder', (req, res, next)=> {
  let orderId = req.query.orderId;
    User.update({
      userId:req.session.userId
    },{ $pull:{
        userOrderList:{
          orderId:orderId,
          orderState:'未接单'
          }
        }
      },(err,doc)=>{ 
          if(err){
            errTip(res);
            return
          }
          if(doc.nModified){ //删除数量不为0
              res.json({
                status:"0",
                msg:'',
                result:''
              })
          }else{
            errTip(res,'已接单不可取消,或者其他');
          }
                       
      });
});

//用户确认送达订单
router.post('/completedCurrentOrder', (req, res, next)=> {
    let orderData = req.body;
    User.findOne({userId:req.session.userId},(err,uesrdoc)=>{
      if(err){
        errTip(res);
      }else{
          if(!uesrdoc){
            errTip(res,'用户不存在');
            return
          }
          let compOrderTime = new Date().Format('yyyy-MM-dd hh:mm:ss'),
              flag = true; //如果订单状态不是已接单 不能确认送达
          uesrdoc.userOrderList.forEach(it=>{
              if(it.orderId==orderData.orderId){
                  if(it.orderState!='已接单'){
                      flag = false;
                      return  //订单状态不是已接单 退出 forEach
                  }
                  it.completedData = compOrderTime;
                  it.orderState = "已完成";
              }
          });
          if(flag){
            uesrdoc.save((err1,uesrdoc1)=>{
              if(err1){
                errTip(res);
              }else{
                  worker.findOne({
                      phoneNum:orderData.courierPhone,
                      userName:orderData.courierPeople
                    },(err2,workerdoc)=>{
                        if(err2){
                            errTip(res,'该送单员数据读取失败');
                        }else{
                          if(!workerdoc){
                            errTip(res,'该送单员不存在或者查询失败!');
                            return
                          }
                          workerdoc.workerOrderList.forEach(it=>{
                              if(it.orderId == orderData.orderId){
                                  it.orderState='已完成';
                                  it.completedData = compOrderTime;
                              }
                          });
                          let message ={
                              "title" : `用户完成订单,收益到账(${compOrderTime})`, 
                              "cont" : `您在 ${orderData.receivedDate} 接收的订单(订单号: ${orderData.orderId})已完成.
                              感谢您的付出,您辛苦了! 祝您生活愉快!`, 
                              "sendTime" : compOrderTime
                          }
                          workerdoc.messages.push(message);
                          workerdoc.balance += Number.parseFloat(orderData.Price);
                          workerdoc.save((err1,userdoc1)=>{
                            if(err1){
                                errTip(res,'该送单员数据保存失败!');
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
          }else{
              errTip(res,"该订单未接单,无法确认收货");
          }
      }        
    });
});

//用户已完成订单(历史订单)
router.get('/historyOrder', (req, res, next)=> {
  let order = {
      currentPage : Number.parseInt(req.query.page),
      pageSize : Number.parseInt(req.query.size)
  }
  User.findOne({userId:req.session.userId},(err,doc)=>{
      if(err){
        errTip(res);
      }else{
          if(!doc){
            errTip(res,'用户不存在');
            return
          }
          let historyOrder = doc.userOrderList.filter(it=>it.orderState=='已完成');
          let start = order.pageSize * (order.currentPage-1);
          let CompOrderOrder = historyOrder.slice(start,start+order.pageSize);
          res.json({
            status:"0",
            msg:'',
            result:{
              CompOrder : CompOrderOrder,
              totalOrder : historyOrder.length
            }
          }) 
      }              
  });
});

//用户删除已完成订单
router.get('/deleteHistoryOrder', (req, res, next)=> {
  let orderId = req.query.orderId;
      User.update({
        userId:req.session.userId
      },{
          $pull:{
            userOrderList:{
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

//用户消息  
router.get('/userMessage', (req, res, next)=> {
  let msg = {
      currentPage : Number.parseInt(req.query.page) ,
      pageSize : Number.parseInt(req.query.size) 
  }
  if(req.session.userId){
      let Who = userGrade(req.session.grade);
      Who.findOne({userId:req.session.userId},(err,doc)=>{
          if(err){
            errTip(res);
          }else{
              if(!doc){
                errTip(res,'用户不存在');
                return
              }
              let userMessage = doc.messages.reverse();
              let start = msg.pageSize * (msg.currentPage-1);
              let currentMsg = userMessage.slice(start,start+msg.pageSize);
              const retmsg = msg.pageSize ? currentMsg : userMessage;
              res.json({
                status:"0",
                msg:'',
                result:{
                  userMessage : retmsg,
                  totalOrder : userMessage.length
                }
              }) 
          }              
      });
  }else{
      res.json({
        status:"1001",
        msg:'未登录',
        result:''
      }) 
  }
});

//用户读了消息  
router.get('/readMessage', (req, res, next)=> {
  let Who = userGrade(req.session.grade);
  let title = req.query.title;
  Who.update({
        userId:req.session.userId,
        "messages.title":title,
        "messages.isRead":false
      },{ "messages.$.isRead":true },(err,doc)=>{
          if(err){
            errTip(res);
          }else{
              //if(doc.nModified){ //修改数量不为0
                res.json({
                  status:"0",
                  msg:'',
                  result:''
                })
              // }else{
              //   errTip(res,'操作失败,可能已读,或者其他错误');
              // }
          }              
      });
});

//用户删除消息 
router.get('/deleteMessage', (req, res, next)=> {
  let Who = userGrade(req.session.grade);
  let title = req.query.title;
  Who.update({
      userId:req.session.userId
    },{
        $pull:{
          messages:{
            title:title,
            isRead:true
          }
        }
    },(err,doc)=>{
          if(err){
            errTip(res);
          }else{
              if(doc.nModified){ //修改数量不为0
                res.json({
                  status:"0",
                  msg:'',
                  result:''
                })
              }else{
                errTip(res,'删除失败,请重试!');
              }
          }              
      });
});
module.exports = router;
