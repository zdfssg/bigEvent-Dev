function getUserInfo() {
    // var token = localStorage.getItem('token') || ''
    const { layer } = layui
    axios({
        url: '/my/userinfo',
        // headers: { 'Authorization': token }
    }).then(function (res) {
        // console.log(res.message);
        if (res.status !== 0) return layer.msg('获取用户信息失败!');
        const { data } = res
        // 获取用户名
        const name = data.nickname || data.username
        // 渲染用户名
        $('#welcome').text(`欢迎 ${name}`).show()
        // 渲染头像
        if (data.user_pic) {
            $('.text-avatar').hide();
            $('.avatar').prop('src', data.user_pic).show()
        } else {
            $('.layui-nav-img').hide();
            $('.text-avatar').text(name[0].toUpperCase()).show()
        }
    })
}
$(function () {
    getUserInfo();

    // 点击退出
    $('#exit').click(function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            layer.close(index)
            localStorage.removeItem('token')
            location.href = "/login.html"
        })
    })

})
