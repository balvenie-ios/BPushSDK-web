import { initializeApp } from "firebase/app";
import { getToken, getMessaging } from "firebase/messaging"
import { BPush } from "@bpush/bpushsdk-web";

const appKey = 'dd436241299741a00dfd692de82b85b9'
const bundleID = 'com.baifu.bpushandroid'

const firebaseConfig = {
    apiKey: "AIzaSyC3zrJzvPzmIY_hZaSFHTWrrsj3vPfcxmo",
    authDomain: "baifuandroid.firebaseapp.com",
    projectId: "baifuandroid",
    storageBucket: "baifuandroid.appspot.com",
    messagingSenderId: "42574203204",
    appId: "1:42574203204:web:c83c58f18f6fbf049def11",
    measurementId: "G-SJL4LTKDDM"
};
const vapidKey = 'BKZiL_55dmtRidH4nn1CoJy2VczKm4XWROouVLuv2nZy1xpVWo1DHhUSYHpSY0vtnSpZ8YK10h3_qdETCRcn5J8'

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
getToken(messaging, { vapidKey: vapidKey})
    .then((currentToken) => {
        if (currentToken) {
            console.log("Current Token => " + currentToken);
            document.getElementById("currentToken").textContent = currentToken;

            const register = async () => {
                console.log('regitser new')
                const response = await BPush.registerToken({ pushToken: currentToken, appKey, bundleID, appVersion: '1.0.0' })
                console.log(response)
            }
            register()
                .catch(error => {
                console.log('register token error', error)
                })
        }
        else {
            console.log("No Token !!");
            document.getElementById("currentToken").textContent = "No Token";
        }
    })
    .catch((error) => {
        console.log("An error occurred :" + error);
            document.getElementById("currentToken").textContent = error;
    })
