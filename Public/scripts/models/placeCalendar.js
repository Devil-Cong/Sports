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
    initRangePickerValidate = function(){
        $('.myRangePicker').validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: true,
            ignore: '',
            rules: {
                rangePicker: {
                    required: true
                },
                price: {
                    required: true
                }
            },
            messages: {
                rangePicker: {
                    required: "Date Ranges is required."
                },
                price: {
                    required: "Place Calendar Price is required."
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
                if (element.parents('.rangePicker').size() > 0) {
                    error.appendTo(element.parents('.rangePicker').attr("data-error-container"));
                }else{
                    error.insertAfter(element);
                }
            },
            submitHandler: function(form) {

            }
        });
    },
    initPriceValidate = function(){
        $('.price').validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: true,
            ignore: '',
            rules: {
                price: {
                    required: true
                }
            },
            messages: {
                price: {
                    required: "Place Calendar Price is required."
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
                error.insertAfter(element);
            },
            submitHandler: function(form) {

            }
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

    window.rangePicker = function(){
        var data = { };
        $('.modal-title').text('Date Ranges');
        var html = template('myRangePicker', data);
        $('.modal-body').removeClass('form').empty().html(html);
        // 初始化日历控件
        $('.rangePicker').daterangepicker({
                opens: (Metronic.isRTL() ? 'left' : 'right'),
                format: 'YYYY-MM-DD',
                separator: ' to ',
                startDate: moment(),
                endDate: moment().add(3, 'days'),
                minDate: window.dateRangeData.startDay,
                maxDate: window.dateRangeData.endDay,
            },
            function (start, end) {
                $('.rangePicker input').val(start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                $('.myRangePicker').validate().form();
            }
        );
        initRangePickerValidate();
        $('.submit').text('Select').unbind().bind('click', function() {
            if ($('.myRangePicker').validate().form()) {
                var jsonData = JSON.stringify({
                    placeId     : sports.$_GET('placeId'),
                    startDay    : moment($('.rangePicker').data('daterangepicker').startDate).format('YYYY-MM-DD'),
                    endDay      : moment($('.rangePicker').data('daterangepicker').endDate).format('YYYY-MM-DD'),
                    price       : $('input[name="price"]').val().trim()
                });
                $.ajax({
                    url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/editBatchPlaceCalendarPrice',
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
                                    jsonData = JSON.stringify({
                                        placeId : sports.$_GET('placeId'),
                                        month   : moment($('.rangePicker').data('daterangepicker').startDate).format('YYYY-MM')
                                    });
                                    getDataAjax(jsonData);
                                    break;
                                default:
                                    toastr.error(data.retmsg, "Notifications");
                                    break;
                            }
                        }
                    },
                    error: function() {}
                });

            }
        });
    };

    window.editPrice = function(obj){
        var objData = $(obj).parent().data('datastr');
        $('.modal-title').text('Edit Place Calendar Price');
        var html = template('price', objData);
        $('.modal-body').addClass('form').empty().html(html);
        initPriceValidate();
        $('.submit').text('Save changes').unbind().bind('click', function() {
            if ($('.price').validate().form()) {
                var jsonData = JSON.stringify({
                    id      : $('input[name="id"]').val().trim(),
                    price   : $('input[name="price"]').val().trim()
                });
                $.ajax({
                    url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/editSinglePlaceCalendarPrice',
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
                                    jsonData = JSON.stringify({
                                        placeId : sports.$_GET('placeId'),
                                        month   : objData.month
                                    });
                                    getDataAjax(jsonData);
                                    break;
                                default:
                                    toastr.error(data.retmsg, "Notifications");
                                    break;
                            }
                        }
                    },
                    error: function() {}
                });
            }
        });
    };

    // window.del = function(obj){
    //     var data = $(obj).parent().parent().data('datastr');
    //     $('.modal-title').text('Delete User');
    //     var html = template('delTip', data);
    //     $('.modal-body').removeClass('form').empty().html(html);
    //     $('.submit').text('Confirm').unbind().bind('click', function() {
    //         $.ajax({
    //             url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/deleteUser',
    //             data: 'json_data=' + JSON.stringify({ userId:data.userId }),
    //             type: 'post',
    //             cache: false,
    //             dataType: 'json',
    //             success: function(data) {
    //                 if (data.retcode) {
    //                     switch (data.retcode) {
    //                         case '1':
    //                             $('.closeBtn').click();
    //                             toastr.success(data.retmsg, "Notifications");
    //                             getDataAjax(false);
    //                             break;
    //                         default:
    //                             toastr.error(data.retmsg, "Notifications");
    //                             break;
    //                     }
    //                 }
    //             },
    //             error: function() {}
    //         });
    //     });
    // };
    return {
        init: function() {
            var jsonData = JSON.stringify({
                placeId : sports.$_GET('placeId'),
                month   : moment().format('YYYY-MM')
            });
            getDataAjax(jsonData);
            getDateRangeAjax();
        }

    };
}();
