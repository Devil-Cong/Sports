var CourseList = function() {
    var initTable = function() {
        // 读取多功能表格默认配置
        var options = sports.dataTableOptions;

        // 重写部分配置
        options.columnDefs[0].targets   = [1,2,12]; // 禁止哪一列排序
        options.order[0]                = [0,'asc']; // 初始化默认那一列排序

        var table               = $('#myTable'),
            oTable              = table.dataTable(options),
            oTableColReorder    = new $.fn.dataTable.ColReorder(oTable),
            tableWrapper        = $('#myTable_wrapper');
        tableWrapper.find('.dataTables_length select').select2();
    },
    getDataAjax = function(type){
        $.ajax({
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/ManageInterface/queryAllCourse',
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
                courseType: {
                    required: true
                },
                coach: {
                    required: true
                },
                times: {
                    required: true
                },
                classroom: {
                    required: true
                },
                state: {
                    required: true
                },
                peopleCapacity: {
                    required: true
                },
                price: {
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
                courseType: {
                    required: "Course Type is required."
                },
                coach: {
                    required: "Coach is required."
                },
                times: {
                    required: "Times is required."
                },
                classroom: {
                    required: "Classroom is required."
                },
                state: {
                    required: "State is required."
                },
                peopleCapacity: {
                    required: "Stock is required."
                },
                price: {
                    required: "Price is required."
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
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/editCourse',
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
        $('.modal-title').text('Add Course');
        var html = template('myForm', data);
        $('.modal-body').addClass('form').empty().html(html);
        initFormValidate();
        $('.submit').text('Add course').unbind().bind('click', function() {
            if ($('.myForm').validate().form()) {
                var jsonData = JSON.stringify({
                    operType        : '1',
                    title           : $('input[name="title"]').val().trim(),
                    describe        : $('textarea').val().trim(),
                    peopleCapacity  : $('input[name="peopleCapacity"]').val().trim(),
                    state           : $('input[name="state"]:checked').val(),
                    courseType      : $('input[name="courseType"]:checked').val(),                    
                    coach           : $('input[name="coach"]').val().trim(),
                    times           : $('input[name="times"]').val().trim(),
                    classroom       : $('input[name="classroom"]').val().trim(),
                    price           : $('input[name="price"]').val().trim()
                });
                submitUserData(jsonData);
            }
        });
    };
    window.edit = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        data.operType = '2';
        $('.modal-title').text('Edit Course');
        var html = template('myForm', data);
        $('.modal-body').addClass('form').empty().html(html);
        initFormValidate();
        $('.submit').text('Save changes').unbind().bind('click', function() {
            if ($('.myForm').validate().form()) {
                var jsonData = JSON.stringify({
                    operType    : '2',
                    courseId        : $('input[name="courseId"]').val(),
                    title           : $('input[name="title"]').val().trim(),
                    describe        : $('textarea').val().trim(),
                    peopleCapacity  : $('input[name="peopleCapacity"]').val().trim(),
                    state           : $('input[name="state"]:checked').val(),
                    courseType      : $('input[name="courseType"]:checked').val(),                    
                    coach           : $('input[name="coach"]').val().trim(),
                    times           : $('input[name="times"]').val().trim(),
                    classroom       : $('input[name="classroom"]').val().trim(),
                    price           : $('input[name="price"]').val().trim()
                });
                submitUserData(jsonData);
            }
        });
    };

    window.del = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        $('.modal-title').text('Delete Course');
        var html = template('delTip', data);
        $('.modal-body').removeClass('form').empty().html(html);
        $('.submit').text('Confirm').unbind().bind('click', function() {
            $.ajax({
                url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/deleteCourse',
                data: 'json_data=' + JSON.stringify({ courseId:data.courseId }),
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
    window.reloadData = function(){
        getDataAjax('reload');
    };
    return {
        init: function() {
            getDataAjax('init');
        }
    };
}();
