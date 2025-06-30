/*
环境配置文件
一般在企业级环境里面有三个环境
开发环境
测试环境
线上环境
*/

//当前的环境
const env=import.meta.env.MODE || 'production'

const EnvConfig={
    //下面是三个不同的环境
    development:{
        baseApi:'/api',
        mockApi:'https://mock/apipark.cn/m1/4068509-0-default/api',

    },
    test:{
        baseApi:'//test.future.com/api',
        mockApi:'https://mock/apipark.cn/m1/4068509-0-default/api',
        
    },
    production:{
        baseApi:'//future.com/api',
        mockApi:'https://mock/apipark.cn/m1/4068509-0-default/api',  
    }
}

export default{
    env,
    //mock的总开关
    mock:true,
    ...EnvConfig[env]//这里代表的是baseApi和mockApi
}

