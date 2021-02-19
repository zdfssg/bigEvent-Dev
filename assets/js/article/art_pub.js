$(function () {
    const { form } = layui
    let state = ''
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            if (res.status != 0) {
                layer.msg(res.message)
            } else {
                var htmlStr = template('tpl-cate', res)
                $('#cate_id').html(htmlStr)
                // 更新表单
                form.render()
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
        const fd = new FormData(this)
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                fd.append('cover_img', blob)
                axios.post('/my/article/add', fd).then(function (res) {
                    if (res.status !== 0) {
                        return layer.msg('请求失败！')
                    }
                    layer.msg(state == "草稿" ? '发布草稿草稿！' : '发布文章成功！', {
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