$(function () {
    const { form } = layui
    const str = location.search.slice(1).split('=')
    const id = str[1]
    function getArtDetail(id) {
        // console.log(id);
        axios.get(`/my/article/${id}`).then(function (res) {
            if (res.status !== 0) {
                layer.msg(res.message)
            } else {
                // 表单赋值
                form.val('form-edit', res.data)
                // 把获取到的封面图片加载到裁剪区
                $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
            }
            initEditor();
        })
    }

    let state = ''
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            if (res.status != 0) {
                layer.msg(res.message)
            } else {
                var htmlStr = template('tpl-cate', res)
                $('#cate_id').html(htmlStr)
                // 更新表单
                form.render('replace', '' + res.data.cover_img)
                getArtDetail(id)
            }
        })
    }
    getCateList();

    var $image = $('#image')
    $image.cropper({
        aspectRatio: 10 / 7,
        preview: '.img-preview'
    })

    $('#btnChooseImage').click(function () {
        $('#coverFile').click()
    })

    $('#coverFile').change(function () {
        var files = this.files;
        if (files.length > 0) {
            // 把文件转换成url的形式
            var newImgURL = URL.createObjectURL(files[0]);
        } else {
            layer.msg('请选择图片 !')
        }
        $image
            .cropper('destroy') 
            .prop('src', newImgURL)
            .cropper({
                aspectRatio: 10 / 7,
                preview: '.img-preview',
                viewMode: 3
            })
    });

    $('#form-pub').submit(function (e) {
        e.preventDefault();
        var form = document.querySelector('#form-pub')
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
             const fd = new FormData(form)
                fd.append('state', state)
                fd.append('Id', id)
                fd.append('cover_img', blob)
                axios.post('/my/article/edit', fd).then(function (res) {
                    if (res.status !== 0) {
                        return layer.msg('请求失败！')
                    }
                    layer.msg(state == "草稿" ? '修改草稿成功！' : '修改文章成功！', {
                        time: 500
                    }, function () {
                        window.parent.document.getElementById('article-list').click()
                    })

                })
            })
    })
    $('#publish-save button').click(function () {
        state = $(this).data('state')
        // console.log(state);
        success = $(this).data('success')
    })
})