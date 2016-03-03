<?php
namespace Home\Controller;
use Think\Controller;

class ManageInterfaceController extends Controller {

	// 登录
	public function login() {
		$jsonData       = json_decode($_POST['json_data'], true);
		$user           = M("User");
		$map['account'] = $jsonData['account'];
		$result         = $user->where($map)->find();
		if (!$result['user_id']) {
			$ret['retcode'] = '-1';
			$ret['retmsg']  = 'The user does not exist.';
		} else {
			$passwordStr = md5($result['salt'] . $jsonData['password'] . $result['create_time']); // 加密后的密码串
			if ($result['password'] != $passwordStr) {
				$ret['retcode'] = '-2';
				$ret['retmsg']  = 'The password is incorrect.';
			} else {
				if ($result['state'] == '2') {
					$ret['retcode'] = '-3';
					$ret['retmsg']  = 'The user is disabled.';
				} else {
					$ret['retcode'] = '1';
					$ret['retmsg']  = 'Login is successful.';
					session('user', $result);
					$user         = M('Power');
					$map['state'] = '1';
					$map['level'] = array('EGT', $result['user_type']);
					$result       = $user->where($map)->select();
					session('powers', $result);
				}
			}
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 查询所有用户
	public function queryAllUser() {
		$user             = M('User');
		$map['user_type'] = array('NEQ', '0');
		$map['state']     = array('NEQ', '3');
		$result           = $user->where($map)->select();
		if ($result === false) {
			$ret['retcode'] = '-1';
			$ret['retmsg']  = 'Program error.';
		} else {
			$list = [];
			foreach ($result as $key => $value) {
				$temp                     = null;
				$temp['userId']           = $value['user_id'];
				$temp['userName']         = $value['user_name'];
				$temp['account']          = $value['account'];
				$temp['password']         = $value['password2'];
				$temp['createTime']       = $value['create_time'];
				$temp['userType']         = $value['user_type'];
				$temp['state']            = $value['state'];
				$temp['discount']         = $value['discount'] / 10;
				$temp['consumptionCount'] = $value['consumption_count'] / 100;
				$temp['sumCount']         = $value['sum_count'] / 100;
				array_push($list, $temp);
			}
			$ret['retcode'] = '1';
			$ret['retmsg']  = 'success.';
			$ret['retdata'] = $list;
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 查询所有用户
	public function queryAllCourse() {
		$course       = M('Course');
		$map['state'] = array('NEQ', '3');
		$result       = $course->where($map)->select();
		if ($result === false) {
			$ret['retcode'] = '-1';
			$ret['retmsg']  = 'Program error.';
		} else {
			$list = [];
			foreach ($result as $key => $value) {
				$temp                   = null;
				$temp['courseId']       = $value['course_id'];
				$temp['courseType']     = $value['course_type'];
				$temp['title']          = $value['title'];
				$temp['describe']       = $value['describe'];
				$temp['state']          = $value['state'];
				$temp['peopleCapacity'] = $value['people_capacity'];
				$temp['coach']          = $value['coach'];
				$temp['times']          = $value['times'];
				$temp['classroom']      = $value['classroom'];
				$temp['existPeople']    = $value['exist_people'];
				$temp['price']          = $value['price'] / 100;
				$temp['createTime']     = $value['create_time'];
				array_push($list, $temp);
			}
			$ret['retcode'] = '1';
			$ret['retmsg']  = 'success.';
			$ret['retdata'] = $list;
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	// 查询所有场地
	public function queryAllPlace() {
		$place        = M('Place');
		$map['state'] = array('NEQ', '3');
		$result       = $place->where($map)->select();
		if ($result === false) {
			$ret['retcode'] = '-1';
			$ret['retmsg']  = 'Program error.';
		} else {
			$list = [];
			foreach ($result as $key => $value) {
				$temp                 = null;
				$temp['placeId']      = $value['place_id'];
				$temp['title']        = $value['title'];
				$temp['describe']     = $value['describe'];
				$temp['state']        = $value['state'];
				$temp['address']      = $value['address'];
				$temp['defaultPrice'] = $value['default_price'] / 100;
				$temp['createTime']   = $value['create_time'];
				array_push($list, $temp);
			}
			$ret['retcode'] = '1';
			$ret['retmsg']  = 'success.';
			$ret['retdata'] = $list;
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}

	public function queryPlaceCalendar() {
		// $jsonData = json_decode($_POST['json_data'], true);
		$jsonData['month']   = '2016-03';
		$jsonData['placeId'] = '7';

		$day = $jsonData['month'] . '-01';

		// 判断月份第一天是星期几，0 代表周日
		// 时间往前移，到该天是周日
		$diff     = date('w', strtotime($day));
		$startDay = date('Y-m-d', strtotime('-' . $diff . ' day', strtotime($day)));
		// 时间前移之后共有几天
		$number = API::daysInMonth($jsonData['month']) + $diff;
		// 时间往后移，到该天是周六
		$number = $number + (7 - ($number % 7));
		$endDay = date('Y-m-d', strtotime('+' . $number . ' day', strtotime($startDay)));

		$placeCalendar = M('PlaceCalendar');

		//这里做日期检查更新
		$map['date']     = array('LT', date('Y-m-d'));
		$map['state']    = '1';
		$map['place_id'] = $jsonData['placeId'];
		$data['state']   = '3';
		$result          = $placeCalendar->where($map)->save($data);
		if ($result === false) {
			$ret['retcode'] = '-1';
			$ret['retmsg']  = 'Checks and update place calendar error.';
		} else {

			// 日期检查更新通过，做查询
			$map             = null;
			$map['place_id'] = $jsonData['placeId'];
			$map['date']     = array('BETWEEN', array($startDay, $endDay));
			$result          = $placeCalendar->where($map)->select();
			if ($result === false) {
				$ret['retcode'] = '-1';
				$ret['retmsg']  = 'Query place calendar error.';
			} else {
				$list = [];
				foreach ($result as $key => $value) {
					$obj['id']      = $value['id'];
					$obj['placeId'] = $value['place_id'];
					$obj['month']   = $value['month'];
					$obj['date']    = $value['date'];
					$obj['price']   = $value['price'] / 100;
					$obj['state']   = $value['state'];

					switch (date('w', strtotime($value['date']))) {
					case 0:
						$temp['sunday'] = $obj;
						break;
					case 1:
						$temp['monday'] = $obj;
						break;
					case 2:
						$temp['tuesday'] = $obj;
						break;
					case 3:
						$temp['wednesday'] = $obj;
						break;
					case 4:
						$temp['thursday'] = $obj;
						break;
					case 5:
						$temp['friday'] = $obj;
						break;
					case 6:
						$temp['saturday'] = $obj;
						array_push($list, $temp);
						$temp = null;
						break;
					}
				}
				$ret['retcode'] = '1';
				$ret['retmsg']  = 'success.';
				$ret['retdata'] = $list;
			}
		}
		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}
}