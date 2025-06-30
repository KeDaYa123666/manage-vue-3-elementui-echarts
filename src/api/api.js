/*
对整个项目api的管理
*/
import request from "./request"

export default {
    //home组件 左侧表格数据获取
    getTableData(params) {
        return request({
            url: '/home/getTableData',
            method: 'get',
            data: params,
            mock: true,//开启mock
        })
    },
    getCountData(){
        return request({
            url:'/home/getCountData',
            method:'get',
            mock:true,
        })
    },
    getChartData(){
        return request({
            url:'/home/getChartData',
            method:'get',
            mock:true,
        })
    },
    getUserData(params){
        return request({
            url:'/user/getUser',
            method:'get',
            mock:false,
            data:params
        }) 
    }
}