var OrderList = function() {
    var initTable = function() {
        // 读取多功能表格默认配置
        var options = sports.dataTableOptions;

        // 重写部分配置
        options.columnDefs[0].targets   = [7,8,10]; // 禁止哪一列排序
        options.order[0]                = [0,'desc']; // 初始化默认那一列排序

        var table               = $('#myTable'),
            oTable              = table.dataTable(options),
            oTableColReorder    = new $.fn.dataTable.ColReorder(oTable),
            tableWrapper        = $('#myTable_wrapper');
        tableWrapper.find('.dataTables_length select').select2();
    },
    getDataAjax = function(type){
        $.ajax({
            url: 'http://' + sports.phpServiceInterface + '/index.php/Home/ManageInterface/queryAllOrder',
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
    };
    window.cancel = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        $('.modal-title').text('Cancel Order');
        var html = template('cancelTip', data);
        $('.modal-body').removeClass('form').empty().html(html);
        $('.submit').text('Confirm').unbind().bind('click', function() {
            $.ajax({
                url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/cancelOrder',
                data: 'json_data=' + JSON.stringify({ orderId:data.orderId }),
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
    window.end = function(obj){
        var data = $(obj).parent().parent().data('datastr');
        $('.modal-title').text('End Order');
        var html = template('endTip', data);
        $('.modal-body').removeClass('form').empty().html(html);
        $('.submit').text('Confirm').unbind().bind('click', function() {
            $.ajax({
                url: 'http://' + sports.phpServiceInterface + '/index.php/Home/Manage/endOrder',
                data: 'json_data=' + JSON.stringify({ orderId:data.orderId }),
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
