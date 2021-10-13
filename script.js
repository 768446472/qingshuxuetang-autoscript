// ==UserScript==
// @name         青书学堂自动刷课
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  青书学堂自动后台静音播放 刷课B站两不误
// @author       zhuzhengliang Arslan
// @match        *://*.qingshuxuetang.com/*
// @grant        none
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
	'use strict';
	var i
	var href = location.href

	// 通过cw_nodeId判断是否在读取页面
	if (href.indexOf('cw_nodeId') > -1) {
		// 有视频组件的时候判定为正常
		setTimeout(function() {
			var video = document.getElementsByTagName("video")[0]
			var params = new UrlSearch()
			// 课程ID
			var courseId = params.courseId
			const courseArr = params.cw_nodeId.split('_')
			// 下一个播放的视频的key
			var nextKey = ''

			// 章节中课程播放完以后会跳转到错误的kcjs，以video为依据判断是否应该进入下一章节
			if (!video) {
				console.log('找不到视频组，尝试跳转到下一个章节')
				if (courseArr.length == 2) {
					nextKey = `kcjs_${Number(courseArr[1]) + 1}`
				} else if (courseArr.length == 3) {
					// 将章节ID自增1 课程ID设为1
					nextKey = `kcjs_${Number(courseArr[1]) + 1}_${Number(1)}`
				}
				const nextUrl =
					`https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&cw_nodeId=${nextKey}&category=${params.category}`
				console.log(params, 'currentId:', params.cw_nodeId, 'nextKey:', nextKey, 'nextUrl:',
					nextUrl)
				location.replace(nextUrl);
			}

			console.log('找到视频组件,开始静音并自动播放...', video)
			// 设置静音并播放
			video.muted = true
			// 设置倍速播放 支持以下速率: [2, 1.5, 1.2, 0.5] ；默认开启 如有问题请手动注释下面这行代码；或者邮箱反馈我
			video.playbackRate = 1
			video.play()
			if (courseArr.length == 2) {
				nextKey = `kcjs_${Number(courseArr[1]) + 1}`
			} else if (courseArr.length == 3) {
				nextKey = `kcjs_${courseArr[1]}_${Number(courseArr[2]) + 1}`
			}
			const nextUrl =
				`https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&cw_nodeId=${nextKey}&category=${params.category}`
			console.log(params, 'currentId:', params.cw_nodeId, 'nextKey:', nextKey, 'nextUrl:',
				nextUrl)
			// 视频播放结束,自动下一条视频
			video.addEventListener("ended", function() {
				location.replace(nextUrl);
			})
		}, 5000)
		// 打印播放进度
		getvideoprogress();
	}
})();

function UrlSearch() {
	var name, value;
	var str = location.href; //取得整个地址栏
	var num = str.indexOf("?")
	str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

	var arr = str.split("&"); //各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if (num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			this[name] = value;
		}
	}
}

// 检测当前播放的进度
function getvideoprogress() {
	setInterval(function() {
		var vid = document.getElementsByTagName("video")[0]
		var currentTime = vid.currentTime.toFixed(1);
		console.log('当前进度:', currentTime);
	}, 10000);
}
