$(function () {
    $('#link-reg').click(function () {
        $('#reg').show().siblings('#login').hide();
    })
    $('#link-login').click(function () {
        $('#login').show().siblings('#reg').hide();
    })

    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,16}$/, '密码必须6到16位，且不能出现空格'],
        repwd: function (value) {
            var pwd = $('#reg [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });

    // 监听注册表单提交事件
    $('#reg').submit(function (e) {
        e.preventDefault();
        var username = $('#reg [name=username]').val();
        var password = $('#reg [name=password]').val()
        axios.post('/api/reguser', $(this).serialize())
            .then(function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功', {
                    icon: 1,
                    time: 1000,
                }, function () {
                    $('#link-login').click();
                })
            })
    })
    // 监听登录表单提交事件
    $('#login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                localStorage.setItem('token', res.token)
                layer.msg('登录成功', {
                    icon: 1,
                    time: 1000,
                }, function () {
                    location.href = '/index.html'
                })
            }
        })
    })

})