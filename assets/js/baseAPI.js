// 每次调用$.post/$.get/$.ajax之前会调用$.ajaxPrefilter
// 在该函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    console.log(option)
    option.url = 'http://www.liulongbin.top:3007' + option.url
})