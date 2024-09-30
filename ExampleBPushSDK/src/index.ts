import { BPush } from "@bpush/bpushsdk-web";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyC3zrJzvPzmIY_hZaSFHTWrrsj3vPfcxmo",
    authDomain: "baifuandroid.firebaseapp.com",
    projectId: "baifuandroid",
    storageBucket: "baifuandroid.appspot.com",
    messagingSenderId: "42574203204",
    appId: "1:42574203204:web:c83c58f18f6fbf049def11",
    measurementId: "G-SJL4LTKDDM"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const getFirebaseToken = async () => {
    try {
        const vapidKey = 'BKZiL_55dmtRidH4nn1CoJy2VczKm4XWROouVLuv2nZy1xpVWo1DHhUSYHpSY0vtnSpZ8YK10h3_qdETCRcn5J8';
        const fcmToken = await getToken(messaging, { vapidKey: vapidKey });
        console.log('[FCM Token]', fcmToken);
        document.getElementById("fcm-token").textContent = fcmToken;
        return fcmToken;
    }
    catch (error) {
        console.log('[FCM Token Error]', error);
        document.getElementById("fcm-token").textContent = error;
    }
    return null;
}

const requestPermission = async () => {
    if ('Notification' in window) {
        try {
            await Notification.requestPermission()
        }
        catch (error) {
            console.log('[Notification Permission Error]', error)
        }
    }
}

const registerToken = async (fcmTokem: string) => {
    const appKey = 'dd436241299741a00dfd692de82b85b9'
    const bundleID = 'com.baifu.bpushandroid'
    try {
        const response = await BPush.registerToken({ pushToken: fcmTokem, appKey, bundleID, appVersion: '1.0.0' })
        console.log("Register Token to Bpush Success !!", response);
        document.getElementById("bpush-register-t").textContent = "Register Token to Bush Success !!";
        document.getElementById("bpush-register-p").textContent = '';
    } catch (error) {
        console.log("Register Token to Bpush Failed", error);
        document.getElementById("bpush-register-t").textContent = "Register Token to Bpush Failed";
        document.getElementById("bpush-register-p").textContent = error;
    }
}

window.onload = () => {
    const onLoad = async () => {
        await requestPermission();
        switch (Notification.permission) {
            case 'default':
                document.getElementById("fcm-token").textContent = '尚未開啟通知權限, 請開啟後重整頁面';
                break
            case 'denied':
                document.getElementById("fcm-token").textContent = '尚未開啟通知權限, 請開啟後重整頁面';
                break
            case 'granted':
                const fcmTokem = await getFirebaseToken();
                if (fcmTokem) {
                    await registerToken(fcmTokem);
                }
                break;
        }
    }
    onLoad();
}