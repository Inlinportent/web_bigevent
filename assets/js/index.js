$(function() {
    // 调用函数 获取用户的基本信息
    getUserInfo()
    // 退出
    var layer = layui.layer
    $('#btn_logout').on('click',function() {
        layer.confirm('确定退出登陆?', {icon: 3, title:'提示'}, 
        function(index){
            //do something
            // 清空本地存储的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'
            layer.close(index);
          });
    })
})

// 创建函数 获取用户的基本信息
function getUserInfo() {
    $.ajax ({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头 写入baseAPI
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if(res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
        // 不论成功还是失败 最终都会调用complete函数
        // complete: function(res) {   
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 清空token
        //         localStorage.removeItem('token')
        //         // 跳回登陆页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 设置欢迎的文本
    console.log(user)
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户头像
    console.log(user.user_pic)
    if(user.user_pic !== null) {
        console.log('11')
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        console.log('122')
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        console.log(first)
        $('.text-avatar').html(first).show()
    }
}