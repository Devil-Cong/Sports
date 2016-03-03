<?php
namespace Home\Controller;
use Home\Controller\BaseController;

class ManageController extends BaseController {

	// 初始化页面
	public function index() {
		$this->assign('urlInfo', CONTROLLER_NAME . '/' . ACTION_NAME);
		$this->display();
	}

	public function userList() {
		$this->assign('urlInfo', CONTROLLER_NAME . '/' . ACTION_NAME);
		$this->display();
	}

	public function courseList() {
		$this->assign('urlInfo', CONTROLLER_NAME . '/' . ACTION_NAME);
		$this->display();
	}

	public function placeList() {
		$this->assign('urlInfo', CONTROLLER_NAME . '/' . ACTION_NAME);
		$this->display();
	}

	public function placeCalendar() {
		$placeId         = $_GET['placeId'];
		$placeCalendar   = M('PlaceCalendar');
		$map['place_id'] = $placeId;
		$beginDay        = $placeCalendar->where($map)->max('date');
		$diff            = API::dateDiff(date('Y-m-d'), $beginDay);

		$this->assign('urlInfo', CONTROLLER_NAME . '/' . ACTION_NAME);
		$this->display();
	}

	// 编辑用户信息
	public function editUser() {
		$jsonData       = json_decode($_POST['json_data'], true);
		$user           = M('User');
		$map['account'] = $jsonData['account'];

		// 新增用户
		if ($jsonData['operType'] == '1') {
			$userId = $user->where($map)->getField('user_id');
			if (!$userId) {

				// 判断是否会员
				if ($jsonData['userType'] == '2') {
					$data['discount'] = $jsonData['discount'] * 10;
				}
				$data['account']     = $jsonData['account'];
				$data['state']       = $jsonData['state'];
				$data['user_type']   = $jsonData['userType'];
				$data['user_name']   = $jsonData['userName'];
				$data['salt']        = mt_rand(100000, 999999); // 生成随机数
				$data['create_time'] = date('Y-m-d H:i:s');
				$data['password']    = md5($data['salt'] . $jsonData['password'] . $data['create_time']); // 加密密码
				$data['password2']   = $jsonData['password'];
				$result              = $user->add($data);
				if ($result) {
					$ret['retcode'] = '1';
					$ret['retmsg']  = 'Add user success.';
				} else {
					$ret['retcode'] = '-99';
					$ret['retmsg']  = 'Add user fail.';
				}
			} else {
				$ret['retcode'] = '-1';
				$ret['retmsg']  = 'The user is exist.';
			}
		}

		// 修改用户
		if ($jsonData['operType'] == '2') {
			$result = $user->where($map)->find();
			if ($result) {
				if ($jsonData['userType'] == '2') {
					$result['discount'] = $jsonData['discount'] * 10;
				}
				$result['state']     = $jsonData['state'];
				$result['user_type'] = $jsonData['userType'];
				$result['user_name'] = $jsonData['userName'];
				$result['password']  = md5($result['salt'] . $jsonData['password'] . $result['create_time']); // 加密密码
				$result['password2'] = $jsonData['password'];
				$result              = $user->save($result);
				if ($result !== false) {
					$ret['retcode'] = '1';
					$ret['retmsg']  = 'Update user success.';
				} else {
					$ret['retcode'] = '-99';
					$ret['retmsg']  = 'Update user fail.';
				}
			} else {
				$ret['retcode'] = '-1';
				$ret['retmsg']  = 'The user does not exist.';
			}
		}

		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 删除用户
	public function deleteUser() {
		$jsonData        = json_decode($_POST['json_data'], true);
		$user            = M('User');
		$map['user_id']  = $jsonData['userId'];
		$result          = $user->where($map)->find();
		$result['state'] = '3';
		$result          = $user->save($result);
		if ($result !== false) {
			$ret['retcode'] = '1';
			$ret['retmsg']  = 'Delete user success.';
		} else {
			$ret['retcode'] = '-99';
			$ret['retmsg']  = 'Delete user fail.';
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 编辑课程
	public function editCourse() {
		$jsonData = json_decode($_POST['json_data'], true);
		$course   = M('Course');

		// 新增课程
		if ($jsonData['operType'] == '1') {
			$data['course_type']     = $jsonData['courseType'];
			$data['title']           = $jsonData['title'];
			$data['describe']        = $jsonData['describe'];
			$data['state']           = $jsonData['state'];
			$data['people_capacity'] = $jsonData['peopleCapacity'];
			$data['coach']           = $jsonData['coach'];
			$data['times']           = $jsonData['times'];
			$data['classroom']       = $jsonData['classroom'];
			$data['price']           = $jsonData['price'] * 100;
			$data['create_time']     = date('Y-m-d H:i:s');
			$result                  = $course->add($data);
			if ($result) {
				$ret['retcode'] = '1';
				$ret['retmsg']  = 'Add course success.';
			} else {
				$ret['retcode'] = '-99';
				$ret['retmsg']  = 'Add course fail.';
			}
		}

		// 修改课程
		if ($jsonData['operType'] == '2') {
			$map['course_id'] = $jsonData['courseId'];
			$result           = $course->where($map)->find();
			if ($result) {
				$result['course_type']     = $jsonData['courseType'];
				$result['title']           = $jsonData['title'];
				$result['describe']        = $jsonData['describe'];
				$result['state']           = $jsonData['state'];
				$result['people_capacity'] = $jsonData['peopleCapacity'];
				$result['coach']           = $jsonData['coach'];
				$result['times']           = $jsonData['times'];
				$result['classroom']       = $jsonData['classroom'];
				$result['price']           = $jsonData['price'] * 100;
				$result                    = $course->save($result);
				if ($result !== false) {
					$ret['retcode'] = '1';
					$ret['retmsg']  = 'Update course success.';
				} else {
					$ret['retcode'] = '-99';
					$ret['retmsg']  = 'Update course fail.';
				}
			} else {
				$ret['retcode'] = '-1';
				$ret['retmsg']  = 'The course does not exist.';
			}
		}

		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 删除课程
	public function deleteCourse() {
		$jsonData         = json_decode($_POST['json_data'], true);
		$course           = M('Course');
		$map['course_id'] = $jsonData['courseId'];
		$result           = $course->where($map)->find();
		$result['state']  = '3';
		$result           = $course->save($result);
		if ($result !== false) {
			$ret['retcode'] = '1';
			$ret['retmsg']  = 'Delete course success.';
		} else {
			$ret['retcode'] = '-99';
			$ret['retmsg']  = 'Delete course fail.';
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 编辑场地
	public function editPlace() {
		$jsonData = json_decode($_POST['json_data'], true);
		$place    = M('Place');

		// 新增场地
		if ($jsonData['operType'] == '1') {
			$data['title']         = $jsonData['title'];
			$data['describe']      = $jsonData['describe'];
			$data['state']         = $jsonData['state'];
			$data['address']       = $jsonData['address'];
			$data['default_price'] = $jsonData['defaultPrice'] * 100;
			$data['create_time']   = date('Y-m-d H:i:s');
			$result                = $place->add($data);
			if ($result) {
				// 初始化场地日历
				$result = $this->__addPlaceCalendar($result);
				if ($result) {
					$ret['retcode'] = '1';
					$ret['retmsg']  = 'Add place and init calendar success.';
				} else {
					$ret['retcode'] = '-1';
					$ret['retmsg']  = 'Add place and init calendar fail.';
				}
			} else {
				$ret['retcode'] = '-99';
				$ret['retmsg']  = 'Add place fail.';
			}
		}

		// 修改场地
		if ($jsonData['operType'] == '2') {
			$map['place_id'] = $jsonData['placeId'];
			$result          = $place->where($map)->find();
			if ($result) {
				$result['title']         = $jsonData['title'];
				$result['describe']      = $jsonData['describe'];
				$result['state']         = $jsonData['state'];
				$result['address']       = $jsonData['address'];
				$result['default_price'] = $jsonData['defaultPrice'] * 100;
				$result['create_time']   = date('Y-m-d H:i:s');
				$result                  = $place->save($result);
				if ($result !== false) {
					$ret['retcode'] = '1';
					$ret['retmsg']  = 'Update place success.';
				} else {
					$ret['retcode'] = '-99';
					$ret['retmsg']  = 'Update place fail.';
				}
			} else {
				$ret['retcode'] = '-1';
				$ret['retmsg']  = 'The place does not exist.';
			}
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 删除课程
	public function deletePlace() {
		$jsonData        = json_decode($_POST['json_data'], true);
		$place           = M('Place');
		$map['place_id'] = $jsonData['placeId'];
		$result          = $place->where($map)->find();
		$result['state'] = '3';
		$result          = $place->save($result);
		if ($result !== false) {
			$ret['retcode'] = '1';
			$ret['retmsg']  = 'Delete place success.';
		} else {
			$ret['retcode'] = '-99';
			$ret['retmsg']  = 'Delete place fail.';
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 新增场地日历
	public function addPlaceCalendar() {
		$jsonData = json_decode($_POST['json_data'], true);
		$result   = $this->__addPlaceCalendar($jsonData['placeId']);
		if ($result) {
			$ret['retcode'] = '1';
			$ret['retmsg']  = 'Add calendar success.';
		} else {
			$ret['retcode'] = '-1';
			$ret['retmsg']  = 'Add calendar fail.';
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 私用新增场地日历
	private function __addPlaceCalendar($placeId) {
		$map['place_id'] = $placeId;
		$price           = M('Place')->where($map)->getField('default_price');
		$placeCalendar   = M('PlaceCalendar');
		$result          = $placeCalendar->where($map)->max('date');
		if (!$result) {
			// 查不到日期，从当前时间开始初始化，两个月
			$mouth  = date('Y-m');
			$number = API::daysInMonth($mouth);
			$mouth  = date('Y-m', strtotime('-1 month'));
			$number += API::daysInMonth($mouth);
		} else {
			// 查到日期，接着日期后面初始化，一个月
			$mouth  = date('Y-m', strtotime('+1 day', strtotime($result)));
			$number = API::daysInMonth($mouth);
		}
		$today    = $mouth . '-01';
		$dataList = [];
		for ($i = 0; $i < $number; $i++) {
			$temp             = null;
			$temp['place_id'] = $placeId;
			$temp['month']    = $mouth;
			$temp['date']     = date('Y-m-d', strtotime('+' . $i . ' day', strtotime($today)));
			$temp['price']    = $price;
			$temp['state']    = '1';
			array_push($dataList, $temp);
		}
		$result = $placeCalendar->addAll($dataList);
		return $result;
	}
}