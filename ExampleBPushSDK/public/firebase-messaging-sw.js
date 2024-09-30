importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyC3zrJzvPzmIY_hZaSFHTWrrsj3vPfcxmo",
    authDomain: "baifuandroid.firebaseapp.com",
    projectId: "baifuandroid",
    storageBucket: "baifuandroid.appspot.com",
    messagingSenderId: "42574203204",
    appId: "1:42574203204:web:c83c58f18f6fbf049def11",
    measurementId: "G-SJL4LTKDDM"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "./logo.png",
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});