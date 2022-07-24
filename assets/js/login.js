$(function() {
    // 给两个链接都绑定点击事件
    $('#link_reg').on('click',function() {
        $('.login').hide()
        $('.reg').show()
    })
    $('#link_login').on('click',function() {
        $('.reg').hide()
        $('.login').show()
    })


    // 从layui获取form对象
    var form = layui.form
    var layer = layui.layer

    // 用过form.verify()函数自定义校验规则
    form.verify({
        // 定义一个名为pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位,且不能出现空格'
        ],
        // 校验两次的密码是否一致 
        repwd: function(value) {
            // 通过形参拿到确认密码框中的内容
            // 还需拿到输入密码框中的内容进行比较
            // []中括号是属性选择器 在父结点中查找对应的属性
            var pwd = $('.reg [name = password]').val()
            if(pwd != value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#reg_form').on('submit', (e) => {
        // 阻止默认的提交行为
        e.preventDefault()
        $.post(
            '/api/reguser',
            {username: $('#reg_form [name = username]').val(), password: $('#reg_form [name = password]').val()},
            (res) => {
                if(res.status !== 0) {
                    layer.msg(res.message)
                    return console.log(res.message)
                }
                // 注册成功后跳转到登陆界面
                $('#link_login').click()
                layer.msg('注册成功，请登录')
                console.log('注册成功！')
             }
        )
    })

    // 监听登陆表单的提交事件
    $('#login_form').on('submit', (e) => {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单元素
            data: $('#login_form').serialize(),
            success: function(res) {
                var test = $('#login_form').serialize()
                console.log(test)
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登陆成功！')
                // 将登陆成功得到的token存储到localStorage中
                localStorage.setItem('token', res.token)
                // 登陆成功后跳转到后台主页面
                location.href = '/index.html'
            }
        })
    })

})

