const adminLogin =  resolve => require(['@cptsAdmin/admin_login'], resolve),
    adminPage =  resolve => require(['@cptsAdmin/adminPage'], resolve),
    findPeople =  resolve => require(['@cptsAdmin/allPerson/findPeople'], resolve),
    allUser =  resolve => require(['@cptsAdmin/allPerson/allUser'], resolve),
    allWorker =  resolve => require(['@cptsAdmin/allPerson/allWorker'], resolve),
    findOneOrder =  resolve => require(['@cptsAdmin/allOrder/findOneOrder'], resolve),
    allNotReceiveOrder =  resolve => require(['@cptsAdmin/allOrder/allNotReceiveOrder'], resolve),
    allReceivedOrder =  resolve => require(['@cptsAdmin/allOrder/allReceivedOrder'], resolve),
    allHistoryOrder =  resolve => require(['@cptsAdmin/allOrder/allHistoryOrder'], resolve),
    sendMessage =  resolve => require(['@cptsAdmin/message/sendMessage'], resolve),
    joinUsApply =  resolve => require(['@cptsAdmin/joinUS/joinUsApply'], resolve),
    joinUsHistoryApply =  resolve => require(['@cptsAdmin/joinUS/joinUsHistoryApply'], resolve),
    suggestList =  resolve => require(['@cptsAdmin/suggestList'], resolve);

export {adminLogin ,adminPage ,findPeople ,allUser ,allWorker ,findOneOrder ,allNotReceiveOrder ,
        allReceivedOrder ,allHistoryOrder ,sendMessage ,joinUsApply ,joinUsHistoryApply ,suggestList}