var sports = {
    phpServiceInterface	: '192.168.1.128/Sports',
    dataTableOptions 	: {
        "language": {
            "emptyTable" 	: "No data available in table",						// 当表格没有数据时，表格所显示的字符串
            "info" 			: "Showing _START_ to _END_ of _TOTAL_ entries", 	// 表格的page分页所需显示的所有字符串
            "infoEmpty" 	: "No entries found",								// 当表格没有数据时，汇总地方显示的字符串
            "infoFiltered" 	: "(filtered1 from _MAX_ total entries)",			// 当表格搜索后，在汇总字符串上需要增加的内容
            "lengthMenu" 	: "Show _MENU_ entries",							// '每页显示记录'的下拉框的提示信息
            "search" 		: "Search:",										// 搜索框的提示信息
            "zeroRecords" 	: "No matching records found"						// 当搜索结果为空时，显示的信息
        },
        "order": [																// 表格在初始化的时候的排序
            [0, 'asc']
        ],
        "lengthMenu": [															// 定义在每页显示记录数的select中显示的选项
            [10, 20, 30, -1],
            [10, 20, 30, "All"]
        ],
        "pageLength": 10,														// 改变初始的页面长度(每页显示的记录数)
        "columnDefs": [
        	{ 																	// 设置定义列的初始属性
            	'orderable'	: false,											// 在该列上允许或者禁止排序功能
            	'targets'	: []												// 为一个或多个列编制定义
        	}, 
        	{
            	"searchable": false,											// 在该列上允许或者禁止过滤搜索记录
            	"targets"	: []												// 为一个或多个列编制定义
        	}
        ]
    }
};

// 配置提示框属性
toastr.options = {
	"closeButton"		: true,
	"debug"				: false,
	"positionClass"		: "toast-bottom-right",
	"onclick"			: null,
	"showDuration"		: 500,
	"hideDuration"		: 500,
	"timeOut"			: 2000,
	"extendedTimeOut"	: 500,
	"showEasing" 		: "swing",
	"hideEasing" 		: "linear",
	"showMethod" 		: "fadeIn",
	"hideMethod" 		: "fadeOut"
};
// 类型: success/info/warning/error

jQuery.validator.addMethod("isMobile", function(value, element) {    
    var length = value.length;    
    return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));    
}, "Mobile phone number is wrong");

