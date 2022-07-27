// 每次调用$.post/$.get/$.ajax之前会调用$.ajaxPrefilter
// 在该函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    console.log(option)
    option.url = 'http://www.liulongbin.top:3007' + option.url

    // 统一为有权限的接口设置header请求头
    // 只有包含/my的接口需要加请求头权限
    if(option.url.indexOf('/my/') !== -1){
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    option.complete =  function(res) {   
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空token
            localStorage.removeItem('token')
            // 跳回登陆页面
            location.href = '/login.html'
        }
    }
})