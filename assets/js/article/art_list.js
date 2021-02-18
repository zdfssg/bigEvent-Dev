$(function () {
    const { form, laypage } = layui;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    function getList() {
        axios.get('/my/article/list', { params: q }).then(res => {
            if (res.status != 0) {
                layer.msg(res.message)
            } else {
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 渲染分页器
                renderPage(res.total)
            }
        })
    }
    getList();
    // 渲染分页器函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // theme: '#c00',
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    getList()
                }
            }
        })
    }
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            if (res.status != 0) {
                layer.msg(res.message)
            } else {
                var htmlStr = template('tpl-cate', res)
                $('#cate-id').html(htmlStr)
                form.render();
            }
        })
    }
    getCateList();

    // 监听表单提交事件
    $('#form-search').submit(function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        q.pagenum = 1
        getList();
    })

    // 点击删除按钮,删除当前文章
    $(document).on('click', '.btn-delete', function () {
        const id = $(this).data('id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // console.log(id);
            axios.get(`/my/article/delete/${id}`).then(function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                } else {
                    layer.msg(res.message, {
                        time: 500
                    }, function () {
                        layer.close(index)
                        if ($('.btn-delete').length == 1 && q.pagenum !== 1) {
                            q.pagenum = q.pagenum - 1
                        }
                        getList()
                    })
                }
            })
        })
    })

    // 点击编辑按钮
    $(document).on('click', '.edit-btn', function () {
        const id = $(this).data('id')
        location.href = `/article/art_edit.html?id=${id}`
        window.parent.$('#edit').addClass('layui-this').siblings().removeClass('layui-this');
    })

})