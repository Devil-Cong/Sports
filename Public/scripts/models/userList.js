var UserList = function() {
    var initTable = function() {
        // 读取多功能表格默认配置
        var options = sports.dataTableOptions;

        // 重写部分配置
        options.columnDefs[0].targets   = [3,6,9]; // 禁止哪一列排序
        options.order[0]                = [0,'desc']; // 初始化默认那一列排序

        var table               = $('#myTable'),
            oTable              = table.dataTable(options),
            oTableColReorder    = new $.fn.dataTable.ColReorder(oTable),
            tableWrapper        = $('#myTable_wrapper');
        tableWrapper.find('.dataTables_length select').select2();
    },
    getDataAjax = function(){
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
                            var userList = [];
                            data.retdata.forEach(function(obj,i){
                                obj.dataStr = JSON.stringify(obj);
                                userList.push(obj);
                            });
                            data.retdata = userList;
                            var html = template('tableBody', data);
                            $('#myTable').empty().html(html);
                            initTable();
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
    };
    window.add = function(){
        var data = {
            operType : '1'
        };        
        $('.modal-title').text('Add User');
        var html = template('myForm', data);
        $('.modal-body').addClass('form').empty().html(html);
        initFormValidate();
        $('.submit').unbind().bind('click', function() {
            if ($('.myForm').validate().form()) {
                console.log('yyyyyyyy');
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
        $('.submit').unbind().bind('click', function() {
            if ($('.myForm').validate().form()) {
                console.log('yyyyyyyy');
            }
        });
    };
    window.del = function(obj){

        console.log(obj);
    };
    return {
        init: function() {
            getDataAjax();
        }

    };
}();
