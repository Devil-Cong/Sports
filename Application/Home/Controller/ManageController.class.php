<?php
namespace Home\Controller;
use Think\Controller;

class ManageController extends Controller {
	public function index() {
		// $data = M('User')->find();
		// var_dump($data);
		$this->display();
	}
}