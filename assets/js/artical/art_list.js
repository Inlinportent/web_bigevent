$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear() 
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds()) 

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的额时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认两条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }

    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res)
                if(res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name = cate_id]').html(htmlStr)
                // 通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name = cate_id]').val()
        var stste = $('[name = state').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = stste
        // 根据最新的筛选条件重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //中数据条数
            limit: q.pagesize, //每页显示几条数据
            limits: [2,3,5,10],
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候会触发jump回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            jump: function(obj, first) {
                // 若first的值为true 则以第二种方式调用
                // console.log(first)
                // 获取当前页码值
                // console.log(obj.curr)
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表，并渲染表格
                // 如果first不为true则手动调用
                if(!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！') 
                    // 当数据删除完成后需要判断当前页面是否有剩余数据
                    if(len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
        });
    })
})