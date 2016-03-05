var PlaceCalendar = function() {
    var getDataAjax = function(jsonData){
        $.ajax({
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/ManageInterface/queryPlaceCalendar',
            data: 'json_data=' + jsonData,
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.retcode) {
                    switch (data.retcode) {
                        case '1':
                            $('.closeBtn').click();
                            var list = [];
                            data.retdata.list.forEach(function(objList,i){
                                var tempList = [];
                                objList.forEach(function(obj, t){
                                    if(obj){
                                        obj.dataStr = JSON.stringify(obj);
                                    }
                                    tempList.push(obj);
                                });
                                list.push(tempList);
                            });
                            data.retdata.list = list;
                            var html = template('tableBody', data.retdata);
                            $('#myTable tbody').empty().html(html);
                            $('.year-month center').text(data.retdata.month);
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
    getDateRangeAjax = function(){
        $.ajax({
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/ManageInterface/queryPlaceCalendarRange',
            data: 'json_data=' + JSON.stringify({ placeId:sports.$_GET('placeId') }),
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.retcode) {
                    switch (data.retcode) {
                        case '1':
                            window.dateRangeData = data.retdata;
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
    initPickerValidate = function(){
        $('.myPicker').validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: true,
            ignore: '',
            rules: {
                month: {
                    required: true
                }
            },
            messages: {
                month: {
                    required: "Month is required."
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
                if (element.parents('.date-picker').size() > 0) {
                    error.appendTo(element.parents('.date-picker').attr("data-error-container"));
                }else{
                    error.insertAfter(element);
                }
            },
            submitHandler: function(form) {

            }
        });
    },
    submitUserData = function(jsonData){
        // $.ajax({
        //     url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/editUser',
        //     data: 'json_data=' + jsonData,
        //     type: 'post',
        //     cache: false,
        //     dataType: 'json',
        //     success: function(data) {
        //         if (data.retcode) {
        //             switch (data.retcode) {
        //                 case '1':
        //                     $('.closeBtn').click();
        //                     toastr.success(data.retmsg, "Notifications");
        //                     getDataAjax(false);
        //                     break;
        //                 case '-1':
        //                     toastr.warning(data.retmsg, "Notifications");
        //                     break;
        //                 default:
        //                     toastr.error(data.retmsg, "Notifications");
        //                     break;
        //             }
        //         }
        //     },
        //     error: function() {}
        // });
    };
    window.picker = function(){
        var data = { };
        $('.modal-title').text('Select Months');
        var html = template('myPicker', data);
        $('.modal-body').removeClass('form').empty().html(html);
        // 初始化日历控件
        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                format      : 'yyyy-mm',
                startDate   : '+0d',
                endDate     : '+' + window.dateRangeData.diff + 'd',
                orientation : "left",
                minViewMode : 1, // 设置选择颗粒是月份
                autoclose   : true
            }).on('changeDate',function(e){ // 当日期改变做表单验证
                $('.myPicker').validate().form();
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }
        initPickerValidate();
        $('.submit').text('Select').unbind().bind('click', function() {
            if ($('.myPicker').validate().form()) {
               var jsonData = JSON.stringify({
                    placeId : sports.$_GET('placeId'),
                    month   : moment($('.date-picker').datepicker('getDate')).format('YYYY-MM')
                });
                getDataAjax(jsonData);
            }
        });
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
    return {
        init: function() {
            var jsonData = JSON.stringify({
                placeId : sports.$_GET('placeId'),
                month   : moment().format('YYYY-MM')
            });
            getDataAjax(jsonData);
            getDateRangeAjax();

            // $('#defaultrange_modal').daterangepicker({
            //         opens: (Metronic.isRTL() ? 'left' : 'right'),
            //         format: 'MM/DD/YYYY',
            //         separator: ' to ',
            //         startDate: moment().subtract('days', 29),
            //         endDate: moment(),
            //         minDate: '01/01/2012',
            //         maxDate: '12/31/2018',
            //     },
            //     function (start, end) {
            //         $('#defaultrange_modal input').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            //     }
            // );
        }

    };
}();
