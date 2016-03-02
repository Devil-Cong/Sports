<?php
namespace Home\Controller;
class API {

	// 获取月份的天数
	public static function daysInMonth($date) {
		$year  = substr($date, 0, 4);
		$month = substr($date, 5);
		return cal_days_in_month(CAL_GREGORIAN, $month, $year);
	}
}