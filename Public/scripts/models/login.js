var Login = function() {
    var handleLogin = function() {
            $('.login-form').validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: true,
                ignore: '',
                rules: {
                    account: {
                        required: true
                    },
                    password: {
                        required: true
                    },
                    remember: {
                        required: false
                    }
                },
                messages: {
                    account: {
                        required: "Account is required."
                    },
                    password: {
                        required: "Password is required."
                    }
                },
                invalidHandler: function(event, validator) {

                },
                highlight: function(element) {
                    $(element)
                        .closest('.form-group').addClass('has-error');
                },
                success: function(label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                },
                errorPlacement: function(error, element) {
                    var icon = $(element).parent('.input-icon').children('i');
                    icon.removeClass('fa-check').addClass("fa-warning");
                    icon.attr("data-original-title", error.text()).tooltip({ 'container': 'body' });
                },
                submitHandler: function(form) {
                    loginAjax();
                    return false;
                }
            });

            $('.login-form input').keypress(function(e) {
                if (e.which == 13) {
                    if ($('.login-form').validate().form()) {
                        loginAjax();
                        return false;
                    }
                    return false;
                }
            });
        },
        loginAjax = function() {
            var jsonData = JSON.stringify({
                account: $('input[name="account"]').val().trim(),
                password: $('input[name="password"]').val().trim(),
                remember: $('input[name="remember"]:checked').val()
            });
            $.ajax({
                url: 'http://' + sports.phpServiceInterface + '/index.php/Home/ManageInterface/login',
                data: 'json_data=' + jsonData,
                type: 'post',
                cache: false,
                dataType: 'json',
                success: function(data) {
                    if (data.retcode) {
                        switch (data.retcode) {
                            case '1':
                                $('.alert', $('.login-form')).removeClass('alert-danger').addClass('alert-success').show().find('span').text(data.retmsg + ' Redirecting...');
                                break;
                            default:
                                $('.alert', $('.login-form')).removeClass('alert-success').addClass('alert-danger').show().find('span').text(data.retmsg);
                                break;
                        }
                    }
                },
                error: function() {}
            });
        }

    return {
        init: function() {
            handleLogin();
        }

    };

}();
