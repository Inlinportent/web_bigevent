$(function()  {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        // 定义一个名为pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位,且不能出现空格'
        ],

        // 新密码不能和旧密码一致
        samePwd: function(value) {
            if(value === $('[name = oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        // 校验两次的密码是否一致 
        rePwd: function(value) {
            // 通过形参拿到确认密码框中的内容
            // 还需拿到输入密码框中的内容进行比较
            // []中括号是属性选择器 在父结点中查找对应的属性
            var pwd = $('[name = newPwd]').val()
            if(pwd != value) {
                return '两次密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status != 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    }) 
})