SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sp_place_calendar
-- ----------------------------
DROP TABLE IF EXISTS `sp_place_calendar`;
CREATE TABLE `sp_place_calendar` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID主键',
  `place_id` int(11) DEFAULT NULL COMMENT '场所ID',
  `month` varchar(10) DEFAULT NULL COMMENT '月份：2015-01',
  `date` date DEFAULT NULL COMMENT '具体日期：2016-01-20',
  `price` int(11) DEFAULT NULL COMMENT '价格，单位: 分',
  `state` int(11) DEFAULT NULL COMMENT '状态 1:可预订，2:不可预订，3:时间过期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sp_order
-- ----------------------------
DROP TABLE IF EXISTS `sp_order`;
CREATE TABLE `sp_order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID主键',
  `order_no` varchar(100) DEFAULT NULL COMMENT '订单编号',
  `orderer` varchar(10) DEFAULT NULL COMMENT '下单人',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机号',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `original_price` int(11) DEFAULT NULL COMMENT '原价，单位: 分',
  `payment_price` int(11) DEFAULT NULL COMMENT '实际支付价格，单位: 分',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `order_type` int(11) DEFAULT NULL COMMENT '订单类型，1:课程订单，2:场地订单',
  `goods_id` int(11) DEFAULT NULL COMMENT '货品ID',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sp_place
-- ----------------------------
DROP TABLE IF EXISTS `sp_place`;
CREATE TABLE `sp_place` (
  `place_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID主键',
  `title` varchar(100) DEFAULT NULL COMMENT '标题',
  `address` varchar(255) DEFAULT NULL COMMENT '详细地址',
  `describe` varchar(255) DEFAULT NULL COMMENT '描述',
  `state` int(11) DEFAULT NULL COMMENT '状态 1:正常，2:禁用',
  `default_price` int(11) DEFAULT NULL COMMENT '默认价格，单位: 分',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`place_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sp_massage
-- ----------------------------
DROP TABLE IF EXISTS `sp_massage`;
CREATE TABLE `sp_massage` (
  `massage_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID主键',
  `content` varchar(255) DEFAULT NULL COMMENT '内容',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `reply_massage_id` int(11) DEFAULT '0' COMMENT '回复的留言ID，0:表示新建留言，不回复任何的留言',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `is_read` int(11) DEFAULT '1' COMMENT '是否阅读，1:未阅读，2:已经阅读',
  PRIMARY KEY (`massage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sp_course
-- ----------------------------
DROP TABLE IF EXISTS `sp_course`;
CREATE TABLE `sp_course` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID主键',
  `course_type` int(11) DEFAULT NULL COMMENT '课程类型 1:塑形，2:减肥，3:其它',
  `title` varchar(100) DEFAULT NULL COMMENT '标题',
  `describe` varchar(255) DEFAULT NULL COMMENT '描述',
  `state` int(11) DEFAULT NULL COMMENT '状态 1:正常 2:禁用 3:删除',
  `people_capacity` int(11) DEFAULT NULL COMMENT '人数容量',
  `coach` varchar(20) DEFAULT NULL COMMENT '教练',
  `times` int(11) DEFAULT NULL COMMENT '上课次数',
  `classroom` varchar(100) DEFAULT NULL COMMENT '课室场地',
  `exist_people` int(11) DEFAULT '0' COMMENT '已有人数',
  `price` int(11) DEFAULT NULL COMMENT '价格，单位: 分',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for sp_power
-- ----------------------------
DROP TABLE IF EXISTS `sp_power`;
CREATE TABLE `sp_power` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID主键',
  `controller` varchar(255) DEFAULT NULL COMMENT '控制器',
  `action` varchar(255) DEFAULT NULL COMMENT '方法',
  `url` varchar(255) DEFAULT NULL COMMENT 'url',
  `menu` int(11) DEFAULT NULL COMMENT '是否菜单，1:菜单，2:非菜单',
  `level` int(11) DEFAULT NULL COMMENT '等级，0、1、2 ...',
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `state` int(11) DEFAULT NULL COMMENT '状态，1:正常，2:禁用',
  `class_name` varchar(255) DEFAULT NULL COMMENT '样式名称',
  `parameter` varchar(255) DEFAULT NULL COMMENT '参数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sp_power
-- ----------------------------
INSERT INTO `sp_power` VALUES ('1', 'Manage', 'editUser', 'Manage/editUser', '0', '1', 'Edit User', '1', null, '');
INSERT INTO `sp_power` VALUES ('2', 'Manage', 'userList', 'Manage/userList', '1', '1', 'User List', '1', 'icon-user', null);
INSERT INTO `sp_power` VALUES ('3', 'Manage', 'index', 'Manage/index', '1', '1', 'Test Page', '1', 'icon-settings', null);
INSERT INTO `sp_power` VALUES ('4', 'Manage', 'deleteUser', 'Manage/deleteUser', '0', '1', 'Delete User', '1', null, null);
INSERT INTO `sp_power` VALUES ('5', 'Manage', 'courseList', 'Manage/courseList', '1', '1', 'Course List', '1', 'icon-wallet', null);
INSERT INTO `sp_power` VALUES ('6', 'Manage', 'editCourse', 'Manage/editCourse', '0', '1', 'Edit Course', '1', null, null);
INSERT INTO `sp_power` VALUES ('7', 'Manage', 'deleteCourse', 'Manage/deleteCourse', '0', '1', 'Delete Course', '1', null, null);
INSERT INTO `sp_power` VALUES ('8', 'Manage', 'placeList', 'Manage/placeList', '1', '1', 'Place List', '1', 'icon-pointer', null);
INSERT INTO `sp_power` VALUES ('9', 'Manage', 'editPlace', 'Manage/editPlace', '0', '1', 'Edit Place', '1', null, null);
INSERT INTO `sp_power` VALUES ('10', 'Manage', 'deletePlace', 'Manage/deletePlace', '0', '1', 'Delete Place', '1', null, null);
INSERT INTO `sp_power` VALUES ('11', 'Manage', 'addPlaceCalendar', 'Manage/addPlaceCalendar', '0', '1', 'Add Place Calendar', '1', null, null);
INSERT INTO `sp_power` VALUES ('12', 'Manage', 'placeCalendar', 'Manage/placeCalendar', '1', '1', 'Place Calendar', '1', 'icon-bar-chart', null);
INSERT INTO `sp_power` VALUES ('13', 'Manage', 'editSinglePlaceCalendarPrice', 'Manage/editSinglePlaceCalendarPrice', '0', '1', 'Edit Single Place Calendar Price', '1', null, null);
INSERT INTO `sp_power` VALUES ('14', 'Manage', 'editBatchPlaceCalendarPrice', 'Manage/editBatchPlaceCalendarPrice', '0', '1', 'Edit Batch Place Calendar Price', '1', null, null);


-- ----------------------------
-- Table structure for sp_user
-- ----------------------------
DROP TABLE IF EXISTS `sp_user`;
CREATE TABLE `sp_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID主键',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户姓名',
  `account` varchar(20) DEFAULT NULL COMMENT '账号 == 手机号',
  `password` varchar(255) DEFAULT NULL COMMENT '加密密码',
  `password2` varchar(255) DEFAULT NULL COMMENT '明文密码',
  `salt` varchar(10) DEFAULT NULL COMMENT '随机数，加密密码用',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `user_type` int(11) DEFAULT NULL COMMENT '用户类型 0:超级管理员，1:管理员，2:普通会员',
  `state` int(11) DEFAULT NULL COMMENT '状态 1:正常，2:禁用，3:删除',
  `discount` int(11) DEFAULT NULL COMMENT '折扣 85 表示 8.5折',
  `consumption_count` int(11) DEFAULT '0' COMMENT '消费次数累计',
  `sum_count` int(11) DEFAULT '0' COMMENT '消费金额总计，单位是: 分',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sp_user
-- ----------------------------
INSERT INTO `sp_user` VALUES ('1', 'Leon', '13560448557', '63ce955c3a45bc320390d8279596a2b3', '123456', '954230', '2016-02-26 20:08:01', '1', '1', null, '0', '0');
