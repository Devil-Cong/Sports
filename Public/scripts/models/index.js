var Index = function() {
    var initTable = function() {
    	// 读取多功能表格默认配置
        var options = sports.dataTableOptions;

        // 重写部分配置
        options.columnDefs[0].targets 	= [1]; // 禁止那一列排序
        options.order[0] 				= [2,'desc']; // 初始化默认那一列排序

        var	table 				= $('#myTable'),
        	oTable 				= table.dataTable(options),
			oTableColReorder 	= new $.fn.dataTable.ColReorder(oTable),
			tableWrapper 		= $('#myTable_wrapper');
        tableWrapper.find('.dataTables_length select').select2();
    };
    window.test = function(){
    	// 提示框测试
		toastr.success("Gnome & Growl type non-blocking notifications", "Notifications");
    }
    return {
        init: function() {
        	initTable();
        }

    };
}();
