$(function () {
    const { form } = layui
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            if (res.status != 0) {
                layer.msg(res.message)
            } else {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    getCateList();
    // 添加分类
    var indexAdd = null;
    $('#btnAddCate').click(function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    // 确认添加分类,监听添加表单的监听事件
    $(document).on('submit', '#form-add', function (e) {
        e.preventDefault();
        axios.post('/my/article/addcates', $(this).serialize()).then(function (res) {
            if (res.status !== 0) {
                layer.close(indexAdd)
                layer.msg(res.message)
            } else {
                layer.close(indexAdd)
                layer.msg(res.message, {
                    time: 500
                }, function () {
                    getCateList();
                })
            }
        })
    })

    // 编辑分类
    var indexEdit = null;
    var id = 0;
    $(document).on('click', '.btnEdit', function () {
        id = $(this).parents('tr').data('id')
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        axios.get('/my/article/cates/' + id).then(function (res) {
            if (res.status !== 0) {
                layer.msg(res.message)
            } else {
                form.val('form-edit', res.data)
            }
        })

    })
    // 确认修改分类,监听修改表单的监听事件
    $(document).on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // 用隐藏域传id的值
        axios.post('/my/article/updatecate/', $(this).serialize()).then(function (res) {
            if (res.status !== 0) {
                layer.close(indexEdit)
                layer.msg(res.message)
            } else {
                layer.close(indexEdit)
                layer.msg(res.message, {
                    time: 500
                }, function () {
                    getCateList();
                })
            }
        })
    })

    // 删除分类
    $(document).on('click', '.btnDelete', function () {
        id = $(this).parents('tr').data('id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // console.log(id);
            axios.get(`/my/article/deletecate/${id}`).then(function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                } else {
                    layer.msg(res.message, {
                        time: 500
                    }, function () {
                        layer.close(index)
                        getCateList()
                    })
                }
            })
        })
    })
})