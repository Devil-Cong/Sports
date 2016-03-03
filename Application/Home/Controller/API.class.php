<?php
namespace Home\Controller;
class API {

	// 获取月份的天数
	public static function daysInMonth($date) {
		$year  = substr($date, 0, 4);
		$month = substr($date, 5);
		return cal_days_in_month(CAL_GREGORIAN, $month, $year);
	}

	// 获取两个 YYYY-MM-DD 时间相差天数
	public static function dateDiff($date1, $date2) {
		$d1   = strtotime($date1);
		$d2   = strtotime($date2);
		$days = round(($d2 - $d1) / 3600 / 24);
		return $days;
	}
}