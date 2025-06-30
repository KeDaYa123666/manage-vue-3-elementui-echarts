//二次封装axios
import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'

const NETWORK_ERROR = '网络请求异常，请稍后重试'

//创建一个axios实例对象
const service = axios.create({
    baseURL: config.baseApi
})

//在请求之前做一些事情
//请求拦截器
service.interceptors.request.use((req) => {
    //可以自定义header
    //jwt-token认证的时候
    return req
})

//在请求之后做一些事情
//响应拦截器
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data
    if (code === 200) {
        return data
    } else {
        //网络请求错误
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

//封装的核心函数
function request(options) {
    // {
    //     method:'get',
    //     data:{

    //     },
    //     mock:false
    // }
    options.method = options.method || 'get'//请求方法，默认为get

    //支持大写的GET,咱们可以封装成小写
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }

    //对mock的处理
    let isMock = config.mock//config->index.js里的mock  是总开关
    if (typeof options.mock !== 'undefined') {
        isMock = options.mock
    }

    //对线上环境做处理
    if (config.env === 'production') {
        //不给用到mock的机会
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }

    return service(options)
}

export default request