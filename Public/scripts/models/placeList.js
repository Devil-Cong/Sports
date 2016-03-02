var PlaceList = function() {
    var initTable = function() {
        // 读取多功能表格默认配置
        var options = sports.dataTableOptions;

        // 重写部分配置
        options.columnDefs[0].targets   = [1,2,3,6,7]; // 禁止哪一列排序
        options.order[0]                = [0,'asc']; // 初始化默认那一列排序

        var table               = $('#myTable'),
            oTable              = table.dataTable(options),
            oTableColReorder    = new $.fn.dataTable.ColReorder(oTable),
            tableWrapper        = $('#myTable_wrapper');
        tableWrapper.find('.dataTables_length select').select2();
    },
    getDataAjax = function(type){
        $.ajax({
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/ManageInterface/queryAllPlace',
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
                                    initTable();
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
                title: {
                    required: true
                },
                describe: {
                    required: true
                },
                address: {
                    required: true
                },
                defaultPrice: {
                    required: true
                },
                state: {
                    required: true
                }
            },
            messages: {
                title: {
                    required: "Title is required."
                },
                describe: {
                    required: "Describe is required."
                },
                address: {
                    required: "Address is required."
                },
                defaultPrice: {
                    required: "Default Price is required."
                },
                state: {
                    required: "State is required."
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
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/editPlace',
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

    window.add = function(){
        var data = {
            operType : '1'
        };        
        $('.modal-title').text('Add Place');
        var html = template('myForm', data);
        $('.modal-body').addClass('form').empty().html(html);
        initFormValidate();
        $('.submit').text('Add place').unbind().bind('click', function() {
            if ($('.myForm').validate().form()) {
                var jsonData = JSON.stringify({
                    operType        : '1',
                    title           : $('input[name="title"]').val().trim(),
                    describe        : $('textarea').val().trim(),
                    state           : $('input[name="state"]:checked').val(),
                    address         : $('input[name="address"]').val().trim(),
                    defaultPrice    : $('input[name="defaultPrice"]').val().trim()
                });
                submitUserData(jsonData);
            }
        });
    };

    window.edit = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        data.operType = '2';
        $('.modal-title').text('Edit Place');
        var html = template('myForm', data);
        $('.modal-body').addClass('form').empty().html(html);
        initFormValidate();
        $('.submit').text('Save changes').unbind().bind('click', function() {
            if ($('.myForm').validate().form()) {
                var jsonData = JSON.stringify({
                    operType    : '2',
                    placeId         : $('input[name="placeId"]').val().trim(),
                    title           : $('input[name="title"]').val().trim(),
                    describe        : $('textarea').val().trim(),
                    state           : $('input[name="state"]:checked').val(),
                    address         : $('input[name="address"]').val().trim(),
                    defaultPrice    : $('input[name="defaultPrice"]').val().trim()
                });
                submitUserData(jsonData);
            }
        });
    };

    window.del = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        $('.modal-title').text('Delete Place');
        var html = template('delTip', data);
        $('.modal-body').removeClass('form').empty().html(html);
        $('.submit').text('Confirm').unbind().bind('click', function() {
            $.ajax({
                url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/deletePlace',
                data: 'json_data=' + JSON.stringify({ placeId:data.placeId }),
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

    window.addCal = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        $('.modal-title').text('Add Calendar');
        var html = template('addCalTip', data);
        $('.modal-body').removeClass('form').empty().html(html);
        $('.submit').text('Confirm').unbind().bind('click', function() {
            $.ajax({
                url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/addPlaceCalendar',
                data: 'json_data=' + JSON.stringify({ placeId:data.placeId }),
                type: 'post',
                cache: false,
                dataType: 'json',
                success: function(data) {
                    if (data.retcode) {
                        switch (data.retcode) {
                            case '1':
                                $('.closeBtn').click();
                                toastr.success(data.retmsg, "Notifications");
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

    window.reloadData = function(){
        getDataAjax('reload');
    };
    return {
        init: function() {
            getDataAjax('init');
        }
    };
}();
