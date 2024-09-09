# BPushSDK-web

### Installation
```
$ npm i git@gitlab.baifu-tech.net:ios/BPush/bpushsdk-web.git
```

### Usage

須先安裝 `firebase` package
```
$ npm install firebase
```

新增 firebase service worker `firebase-messaging-sw.js`, 在專案 root 路徑下 : 
如果是使用 `Next.js` 則放在 `public` 下面
```js
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
```

初始化 firebase 
```ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyC3zrJzvPzmIY_hZaSFHTWrrsj3vPfcxmo",
    authDomain: "baifuandroid.firebaseapp.com",
    projectId: "baifuandroid",
    storageBucket: "baifuandroid.appspot.com",
    messagingSenderId: "42574203204",
    appId: "1:42574203204:web:c83c58f18f6fbf049def11",
    measurementId: "G-SJL4LTKDDM"
};

export const firebaseApp = initializeApp(firebaseConfig)
export const messaging = getMessaging(firebaseApp)
```

向 firebase 取得 push token, react hook 寫法
```ts
export const useFCMToken = () => {
    const [token, setToken] = useState<string | null>(null)
    useEffect(() => {
        const getFCMToken = async () => {
            const fcmToken = await getToken(messaging, { vapidKey: 'BKZiL_55dmtRidH4nn1CoJy2VczKm4XWROouVLuv2nZy1xpVWo1DHhUSYHpSY0vtnSpZ8YK10h3_qdETCRcn5J8' })
            setToken(fcmToken)
        }
        getFCMToken()
    }, [])
    return token
}
```

拿到 push token後, 監聽推播訊息, react hook 寫法
```ts
export const useFCMMessage = () => {
    const token = useFCMToken()
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    
    useEffect(() => {
        const temp = messaging
        const unsubscribe = onMessage(temp, (payload) => {
            console.log('onMessage')
            setMessages((prev) => [...prev, payload])
        })
        return () => unsubscribe()
    }, [token])
    
    return { token, messages }
}
```

在頁面中使用, 向 firebase 註冊 push token, 回傳給 BPush 並監聽 message 內容:
```ts
export default function Home() {
    const appKey = 'dd436241299741a00dfd692de82b85b9'
    const bundleID = 'com.baifu.bpushandroid'
    const { token, messages } = useFCMMessage()
    
    // 取得 token, 發給 BPush 
    useEffect(() => {
        const register = async () => {
          if (token != null) {
            const response = await BPush.registerToken(token, appKey, bundleID)
            console.log(response)
          }
        }
        register()
          .catch(error => {
            console.log('register token error', error)
          })
    }, [token])
    
    // 監聽推播 messages
    useEffect(() => {
        console.log('firebase message messages', messages)
    }, [messages])
    
    return (
        <><>
    )
}
```