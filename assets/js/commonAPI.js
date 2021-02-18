//为全局的axios请求设置根路径
axios.defaults.baseURL = "http://api-breakingnews-web.itheima.net";
// axios.defaults.baseURL = 'http://ajax.frontend.itheima.net';
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log(config.url);
    const token = localStorage.getItem('token')
    // 判断是否有/my开头的请求路径
    /* 1.startsWith()
    2.正则表达式 /^\/my/.test()
    3.indexof('/my')==0 */
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // 先判断身份验证是否成功
    const { message, status } = response.data;
    if (status == 1 && message == "身份认证失败！") {
        // 清楚本地存储的token
        localStorage.removeItem('token')
        location.href = '/login.html'
    }
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
