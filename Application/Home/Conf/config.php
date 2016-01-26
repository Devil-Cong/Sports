<?php
return array(
	//'配置项'=>'配置值'
	'TMPL_L_DELIM'    => '<{',
	'TMPL_R_DELIM'    => '}>',
	'SHOW_PAGE_TRACE' => true, //显示调试面板
	/*数据库配置*/
	'DB_TYPE'         => 'mysql', // 数据库类型
	'DB_HOST'         => '192.168.27.1', // 服务器地址
	'DB_NAME'         => 'sports', // 数据库名
	'DB_USER'         => 'root', // 用户名
	'DB_PWD'          => '123456', // 密码
	'DB_PORT'         => 3306, // 端口
	'DB_PREFIX'       => 'sp_', // 数据库表前缀
	'DB_CHARSET'      => 'utf8', // 字符集
	'DB_DEBUG'        => TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增
);