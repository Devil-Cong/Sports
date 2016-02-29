<?php
namespace Home\Controller;
use Think\Controller;

class BaseController extends Controller {

	public function _initialize() {

		//判断是否登录
		if (!session('user')) {

			// 没有登录
			echo json_encode([
				"retcode" => '-998',
				"retmsg"  => '登录超时，请重新登录',
			], JSON_UNESCAPED_UNICODE);
			exit;
		}

		$powers = session('powers');
		$flag   = false;
		foreach ($powers as $value) {
			if ($value['controller'] == CONTROLLER_NAME && $value['action'] == ACTION_NAME) {
				$flag = true;
				break;
			}
		}

		if (!$flag) {

			// 没有权限
			echo json_encode([
				"retcode" => '-999',
				"retmsg"  => "您没有访问权限",
			], JSON_UNESCAPED_UNICODE);
			exit;
		}

		// 通过权限检验之后，获取其对应的菜单
		$menu = [];
		foreach ($powers as $value) {
			if ($value['menu'] == '1') {
				$temp              = null;
				$temp['url']       = $value['url'];
				$temp['className'] = $value['class_name'];
				$temp['parameter'] = $value['parameter'];
				$temp['title']     = $value['title'];
				array_push($menu, $temp);
			}
		}
		$this->assign('menu',$menu);
	}

}