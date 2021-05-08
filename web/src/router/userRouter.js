const userPage = resolve => require(['@cptsPage/user/user'], resolve),
    userInformation = resolve => require(['@cptsPage/userInformation'], resolve),
    addInformation = resolve => require(['@cptsPage/user/addInformation'], resolve),
    currentOrder = resolve => require(['@cptsPage/user/currentOrder'], resolve),
    joinUs = resolve => require(['@cptsPage/user/joinUs'], resolve),
	// test
	choiceOrder=resolve=>require(['@cptsPage/user/choiceOrder'], resolve),
	newPicOrder=resolve=>require(['@cptsPage/user/newPicOrder'], resolve),
	//
    newOrder = resolve => require(['@cptsPage/user/newOrder'], resolve),
    userFindOrder = resolve => require(['@cptsPage/user/userFindOrder'], resolve),
    historyOrder = resolve => require(['@cptsPage/user/historyOrder'], resolve),
    myMessage = resolve => require(['@cptsPage/myMessage'], resolve);

export {userPage ,userInformation ,addInformation ,
        currentOrder ,joinUs ,newOrder ,choiceOrder,newPicOrder,historyOrder ,myMessage ,userFindOrder}