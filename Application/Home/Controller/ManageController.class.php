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

	// 编辑用户信息
	public function editUser() {
		// $jsonData      = json_decode($_POST['json_data'], true);
		$jsonData['userName'] = 'AmLiu';
		$jsonData['account']  = '13560448557';
		$jsonData['password'] = '123456';
		$jsonData['state']    = '1';
		$jsonData['operType'] = '1';
		$jsonData['userType'] = '1';
		$jsonData['discount'] = '75';

		$user           = M('User');
		$map['account'] = $jsonData['account'];

		// 新增用户
		if ($jsonData['operType'] == '1') {
			$userId = $user->where($map)->getField('user_id');
			if (!$userId) {

				// 判断是否会员
				if ($jsonData['userType'] == '2') {
					$data['discount'] = $jsonData['discount'];
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
					$ret['retmsg']  = '新增用户成功';
				} else {
					$ret['retcode'] = '-99';
					$ret['retmsg']  = '新增用户失败';
				}
			} else {
				$ret['retcode'] = '-1';
				$ret['retmsg']  = '该账户已存在';
			}
		}

		// 修改用户
		if ($jsonData['operType'] == '2') {
			$result = $user->where($map)->find();
			if ($result) {
				if ($jsonData['userType'] == '2') {
					$result['discount'] = $jsonData['discount'];
				}
				$result['state']     = $jsonData['state'];
				$result['user_type'] = $jsonData['userType'];
				$result['user_name'] = $jsonData['userName'];
				$result['password']  = md5($result['salt'] . $jsonData['password'] . $result['create_time']); // 加密密码
				$result['password2'] = $jsonData['password'];
				$result              = $user->save($result);
				if ($result !== false) {
					$ret['retcode'] = '2';
					$ret['retmsg']  = '更新用户成功';
				} else {
					$ret['retcode'] = '-99';
					$ret['retmsg']  = '更新用户失败';
				}
			} else {
				$ret['retcode'] = '-2';
				$ret['retmsg']  = '该账户不存在';
			}
		}

		echo json_encode($ret, JSON_UNESCAPED_UNICODE);
	}
}