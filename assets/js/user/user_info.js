$(function () {
  const { layer, form } = layui
  function initUserInfo() {
    axios.get('/my/userinfo').then(res => {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败!')
      } else {
        // console.log(res.data);
        form.val('formUserInfo', res.data)
      }
    })
  }

  initUserInfo()

  // 表单验证
  form.verify({
    nickname: [/^\w{1,8}$/, '昵称必须为1~8个字符']
  })

  $('.layui-form').submit(function (e) {
    e.preventDefault();
    axios.post('/my/userinfo', $(this).serialize()).then(res => {
      if (res.status !== 0) {
        return layer.msg('修改信息失败!')
      } else {
        layer.msg('修改信息成功!', {
          time: 500,
        }, function () {
          window.parent.getUserInfo();
        })

      }
    })
  })

  $('#btnReset').click(function (e) {
    e.preventDefault();
    initUserInfo();
  })
})
