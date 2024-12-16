// Auto.js 4.1.1 脚本（第一代API版本）
// 功能：唤醒设备 -> 解锁屏幕 -> 打开钟针 -> 停留10秒 -> 打开Auto.js

// 唤醒设备并确保屏幕已点亮
function ensureScreenOn() {
    if (!device.isScreenOn()) {
        device.wakeUp(); // 唤醒设备
        sleep(1000); // 等待屏幕亮起
    }
}

// 滑动解锁设备（适用于无密码的滑动解锁）
function unlockDevice() {
    if (!device.isScreenOn()) {
        log("设备未点亮，尝试唤醒屏幕...");
        ensureScreenOn();
    }
    log("滑动解锁设备...");
    swipe(500, 1500, 500, 500, 500); // 从底部向上滑动解锁
    sleep(1000); // 等待解锁完成
}

// 打开钉钉应用并停留10秒
function openDingTalk() {
    var appName = "钉钉";
    var packageName = getPackageName(appName);
    if (packageName) {
        launch(packageName); // 启动钉钉
        sleep(10000); // 在钉钉页面停留10秒
    } else {
        toast("未找到钉钉应用");
    }
}

// 检测并点击屏幕上的“关闭”按钮（如果存在）用来关闭间断
function closePopupIfExist() {
    var closeButton = textMatches(/关闭|Close|Dismiss/).findOne(3000); // 通过正则匹配关闭按钮
    if (closeButton) {
        log("发现关闭按钮，正在点击...");
        closeButton.click(); // 点击关闭按钮
        sleep(1000); // 等待点击效果
    } else {
        log("未发现关闭按钮。");
    }
}

// 启动线程执行任务
var thread = threads.start(function () {
    log("线程运行中，检测亮屏状态...");
    ensureScreenOn(); // 确保屏幕已点亮
    closePopupIfExist(); // 关闭可能存在的弹窗
    unlockDevice(); // 解锁设备
    openDingTalk(); // 打开Dingding并停留10秒
    log("任务完成，线程即将关闭。");
});

// 等待线程执行完毕
thread.join();

// 等待5秒后重新打开Auto.js
launchApp("Auto.js"); // 启动Auto.js
log("线程已关闭并重新打开Auto.js。");
