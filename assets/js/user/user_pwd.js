$(function () {
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,16}$/, '密码必须6到16位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    $('.layui-form').submit(function (e) {
        e.preventDefault();
        axios.post('/my/updatepwd', $(this).serialize()).then(res => {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            } else {
                layer.msg('修改密码成功,请重新登录!', {
                    time: 500
                }, function () {
                    window.parent.location.href = "/login.html"
                    localStorage.removeItem('token')
                })
            };
        })
    })

})