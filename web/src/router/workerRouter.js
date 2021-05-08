const workerPage = resolve => require(['@cptsPage/worker/worker'], resolve),
    workerAccount = resolve => require(['@cptsPage/worker/workerAccount'], resolve),
    workerReceivedOrder = resolve => require(['@cptsPage/worker/workerReceivedOrder'], resolve),
    workerHistoryOrder = resolve => require(['@cptsPage/worker/workerHistoryOrder'], resolve),
    allUserOrderList = resolve => require(['@cptsPage/worker/allUserOrderList'], resolve),
    workerFindOrder = resolve => require(['@cptsPage/worker/workerFindOrder'], resolve);

export {workerPage ,workerAccount ,workerReceivedOrder ,
        workerHistoryOrder ,allUserOrderList ,workerFindOrder}