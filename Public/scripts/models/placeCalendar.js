var PlaceCalendar = function() {
    var getDataAjax = function(type){
        $.ajax({
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/ManageInterface/queryAllUser',
            data: 'json_data=',
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.retcode) {
                    switch (data.retcode) {
                        case '1':
                            var list = [];
                            data.retdata.forEach(function(obj,i){
                                obj.dataStr = JSON.stringify(obj);
                                list.push(obj);
                            });
                            data.retdata = list;
                            var html = template('tableBody', data);
                            $('#myTable tbody').empty().html(html);
                            switch(type){
                                case 'init':
                                break;
                                case 'reload':
                                    toastr.success("Refresh table success.", "Notifications");
                                break;
                            }
                            break;
                        default:
                            toastr.error(data.retmsg, "Notifications");
                            break;
                    }
                }
            },
            error: function() {}
        });
    },
    initFormValidate = function(){
        $('.myForm').validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: true,
            ignore: '',
            rules: {
                userName: {
                    required: true
                },
                account: {
                    required: true,
                    isMobile: true
                },
                password: {
                    required: true
                },
                state: {
                    required: true
                },
                userType: {
                    required: true
                },
                discount: {
                    required: true
                }
            },
            messages: {
                userName: {
                    required: "User Name is required."
                },
                account: {
                    required: "Account is required.",
                    isMobile: "Account must be mobile phone number"
                },
                password: {
                    required: "Password is required."
                },
                state: {
                    required: "State is required."
                },
                userType: {
                    required: "User Type is required."
                },
                discount: {
                    required: "Discount is required."
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
                if (element.parents('.radio-list').size() > 0) { 
                    error.appendTo(element.parents('.radio-list').attr("data-error-container"));
                }else{
                    error.insertAfter(element);
                }
            },
            submitHandler: function(form) {
                
            }
        });
    },
    submitUserData = function(jsonData){
        $.ajax({
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/editUser',
            data: 'json_data=' + jsonData,
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.retcode) {
                    switch (data.retcode) {
                        case '1':
                            $('.closeBtn').click();
                            toastr.success(data.retmsg, "Notifications");
                            getDataAjax(false);
                            break;
                        case '-1':                        
                            toastr.warning(data.retmsg, "Notifications");
                            break;
                        default:
                            toastr.error(data.retmsg, "Notifications");
                            break;
                    }
                }
            },
            error: function() {}
        });
    };
    window.picker = function(){
        var data = { };        
        $('.modal-title').text('Select Months');
        var html = template('myPicker', data);
        $('.modal-body').removeClass('form').empty().html(html);
        // 初始化日历控件
        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                // rtl: Metronic.isRTL(),
                startDate: '2013-01-01',
                endDate: '2015-01-01',
                format: 'yyyy-mm',
                orientation: "left",
                autoclose: true
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }
        // $('.submit').text('Add user').unbind().bind('click', function() {
        //     if ($('.myForm').validate().form()) {
        //         var jsonData = JSON.stringify({
        //             operType    : '1',
        //             userName    : $('input[name="userName"]').val().trim(),
        //             account     : $('input[name="account"]').val().trim(),
        //             password    : $('input[name="password"]').val().trim(),
        //             state       : $('input[name="state"]:checked').val(),
        //             userType    : $('input[name="userType"]:checked').val(),                    
        //             discount    : $('input[name="discount"]').val().trim()
        //         });
        //         submitUserData(jsonData);
        //     }
        // });
    };
    window.edit = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        data.operType = '2';
        $('.modal-title').text('Edit User');
        var html = template('myForm', data);
        $('.modal-body').addClass('form').empty().html(html);
        initFormValidate();
        $('.submit').text('Save changes').unbind().bind('click', function() {
            if ($('.myForm').validate().form()) {
                var jsonData = JSON.stringify({
                    operType    : '2',
                    userName    : $('input[name="userName"]').val().trim(),
                    account     : $('input[name="account"]').val().trim(),
                    password    : $('input[name="password"]').val().trim(),
                    state       : $('input[name="state"]:checked').val(),
                    userType    : $('input[name="userType"]:checked').val(),                    
                    discount    : $('input[name="discount"]').val().trim()
                });
                submitUserData(jsonData);
            }
        });
    };

    window.del = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        $('.modal-title').text('Delete User');
        var html = template('delTip', data);
        $('.modal-body').removeClass('form').empty().html(html);
        $('.submit').text('Confirm').unbind().bind('click', function() {
            $.ajax({
                url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/deleteUser',
                data: 'json_data=' + JSON.stringify({ userId:data.userId }),
                type: 'post',
                cache: false,
                dataType: 'json',
                success: function(data) {
                    if (data.retcode) {
                        switch (data.retcode) {
                            case '1':
                                $('.closeBtn').click();
                                toastr.success(data.retmsg, "Notifications");
                                getDataAjax(false);
                                break;
                            default:
                                toastr.error(data.retmsg, "Notifications");
                                break;
                        }
                    }
                },
                error: function() {}
            });
        });
    };
    window.showPassword = function(obj){
        $(obj).parent().parent().find('input').attr('type', 'text');
    };
    window.hidePassword = function(obj){
        $(obj).parent().parent().find('input').attr('type', 'password');
    };
    window.reloadData = function(){
        getDataAjax('reload');
    };
    return {
        init: function() {
            getDataAjax('init');
            
            $('#defaultrange_modal').daterangepicker({
                    opens: (Metronic.isRTL() ? 'left' : 'right'),
                    format: 'MM/DD/YYYY',
                    separator: ' to ',
                    startDate: moment().subtract('days', 29),
                    endDate: moment(),
                    minDate: '01/01/2012',
                    maxDate: '12/31/2018',
                },
                function (start, end) {
                    $('#defaultrange_modal input').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                }
            );
        }

    };
}();
