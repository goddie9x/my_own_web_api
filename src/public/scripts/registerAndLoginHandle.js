//we got twice event when click the buttom submit
var clickedCount = 0;

function onSubmitLogin(event) {
    const formLogin = $(event.target).closest('.form-login');

    formLogin.submit(function(e) {
        e.preventDefault();
    });
    formLogin.validate({
        rulers: {
            account: {
                required: true,
                minlength: 5,
            },
            password: {
                required: true,
                minlength: 8,
            }
        },
        messages: {
            'account': "Tài khoản yêu cầu ít nhất 5 ký tự",
            'password': "Mật khẩu cũng yêu cầu 8 ký tự nhé"
        },
        success: function() {
            clickedCount++;
            if (clickedCount % 2 == 1) {
                let account = formLogin.find('.account').val();
                let password = formLogin.find('.password').val();
                $.post('/user/login', {
                        account: account,
                        password: password,
                    })
                    .then(function(data) {
                        if (data) {
                            document.cookie = `tokenUser=${data.token};max-age=86400`;
                            formLogin.closest('.modal-content').find('.btn-close').click();
                            showToast('Đăng nhâp thành công', 'chào mừng bạn đến với ngôi nhà chung của chúng ta');
                            location.reload();
                        } else {
                            showToast('Đăng nhâp không thành công', 'vui lòng thử lại');
                        }
                    })

                .catch(error => {
                    showToast('Đăng nhâp không thành công', 'vui lòng thử lại');
                })
            }
        }
    });
}

function onSubmitRegester(event) {
    const formRegester = $(event.target).closest('.form-register');

    formRegester.submit(function(e) {
        e.preventDefault();
    });
    formRegester.validate({
        rulers: {
            account: {
                required: true,
                minlength: 5,
            },
            password: {
                required: true,
                minlength: 5,
            },
            password_confirm: {
                minlength: 5,
                equalTo: "#input-password-reg"
            }
        },
        messages: {
            account: "Tài khoản yêu cầu ít nhất 5 ký tự",
            password: "Mật khẩu cũng yêu cầu 8 ký tự nhé",
            password_confirm: "Nhập lại mật khẩu giúp bạn nhớ lâu hơn"
        },
        success: function() {
            clickedCount++;
            if (clickedCount % 3 == 1) {
                let account = formRegester.find('.account').val();
                let password = formRegester.find('.password').val();

                $.post('/user/register', {
                        account: account,
                        password: password,
                    })
                    .then(function(data) {
                        if (data.token) {
                            document.cookie = `tokenUser=${data.token};max-age=86400`;
                            formRegester.closest('.modal-content').find('.btn-close').click();
                            showToast('Đăng ký thành công', 'giờ đây bạn có thể khám phá nhiều tính năng hơn');
                            location.reload();
                        } else {
                            showToast('Đăng ký không thành công', 'vui lòng thử lại');
                        }
                    })
                    .catch(error => {
                        showToast('Đăng ký không thành công', 'vui lòng thử lại');
                    })
            }
        }
    });
}

function logout() {
    document.cookie = `tokenUser=; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
    location.reload();
}

function showUserManagerHeader() {
    $('.login_btn').addClass('active');
    $('.user_menu').addClass('active');
}

function hideUserManagerHeader() {
    $('.login_btn').removeClass('active');
    $('.user_menu').removeClass('active');
}

function showToast(title, message) {
    let toast = $('#liveToast');

    toast.find('.btn-close').on('click', function() {
        toast.toggleClass('hide', 'show');
        return;
    });
    toast.find('.toast-title').html(title);
    toast.find('.toast-body').html(message);
    toast.toggleClass('hide', 'show');
    setTimeout(function() {
        toast.toggleClass('hide', 'show');
        return;
    }, 10000);
}

const getUserInfo = new Promise(function(resolve, reject) {
    $.get('/user/info')
        .then(function(data) {
            if (data) {
                showUserManagerHeader();
                resolve(data);
            }
        })
        .catch(function(error) {
            reject(error);
        })
});

$(document).ready(function() {
    getUserInfo
        .then(function(data) {
            if (data) {
                $('.user_profile').attr('href', `/user/profile/${data._id}`);
            }
        })
});