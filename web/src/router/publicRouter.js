const loginRegister = resolve => require(['@cpts/loginRegister/loginRegister'], resolve),
    login = resolve => require(['@cpts/loginRegister/login'], resolve),
    register = resolve => require(['@cpts/loginRegister/register'], resolve),
    forgotPassword = resolve => require(['@cpts/loginRegister/forgotPassword'], resolve),
    changePassword = resolve => require(['@cpts/personPage/changePassword'], resolve),
    appHeader = resolve => require(['@cpts/appHeader'], resolve),
    appHome = resolve => require(['@cpts/home/home'], resolve),
    aboutUs = resolve => require(['@cpts/aboutUs/aboutUs'], resolve),
    customerService = resolve => require(['@cpts/customerService/customerService'], resolve),
    suggest = resolve => require(['@cpts/suggest/suggest'], resolve),
    notFound = resolve => require(['@cpts/error/404'], resolve);

export {loginRegister ,login ,register ,forgotPassword ,changePassword,
        appHeader ,appHome ,aboutUs ,customerService ,suggest ,notFound }