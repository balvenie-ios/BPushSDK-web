"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BPush = void 0;
const uuid_1 = require("uuid");
const authorization = (appKey, bundleID) => `Basic ${btoa(`${appKey}:${bundleID}`)}`;
const getOrNewUUID = () => {
    const key = 'b_uuid';
    let uuid = localStorage.getItem(key);
    if (!uuid) {
        uuid = (0, uuid_1.v4)();
        localStorage.setItem(key, uuid);
    }
    return uuid;
};
const abortTimeout = (ms) => {
    const controller = new AbortController();
    const { signal } = controller;
    const id = setTimeout(() => signal, ms);
    return { id, signal };
};
const osInfo = () => {
    const { userAgent } = navigator;
    const os = userAgent.match(/\(([^)]+)\)/);
    let deviceBrand = '';
    let deviceModel = '';
    if (os) {
        const line = os[1];
        const words = line.split(' ');
        const iPhoneIndex = words.findIndex((e) => e === 'iPhone');
        if (iPhoneIndex > -1) {
            deviceBrand = 'iPhone';
            const osIndex = words.findIndex((e) => e === 'OS');
            deviceModel = words.at(osIndex + 1) || '';
            return { deviceBrand, deviceModel };
        }
        const macIndex = words.findIndex((e) => e === 'Mac');
        if (macIndex > -1) {
            deviceBrand = 'Mac';
            deviceModel = words.at(-1) || '';
            return { deviceBrand, deviceModel };
        }
        const androidIndex = words.findIndex((e) => e === 'Android');
        if (androidIndex > -1) {
            deviceBrand = 'Android';
            deviceModel = words.at(androidIndex + 1) || '';
            return { deviceBrand, deviceModel };
        }
        const windowIndex = words.findIndex((e) => e === 'Windows');
        if (androidIndex > -1) {
            deviceBrand = 'Windows';
            deviceModel = words.at(windowIndex + 2) || '';
            return { deviceBrand, deviceModel };
        }
    }
    return { deviceBrand, deviceModel };
};
const registerTokenBody = ({ pushToken, bundleID, appVersion = '' }) => {
    const { deviceBrand, deviceModel } = osInfo();
    return {
        deviceID: getOrNewUUID(),
        platform: 'web',
        token: pushToken,
        env: 'product',
        bundleID,
        version: '1.0.0',
        appVersion,
        deviceBrand,
        deviceModel,
        osVersion: ''
    };
};
const registerToken = (pushToken, appKey, bundleID, appVersion) => __awaiter(void 0, void 0, void 0, function* () {
    const domainURL = 'http://10.150.210.142:8080'; //暫時
    const path = '/api/v1/sdk/registerToken';
    const body = registerTokenBody({ pushToken, bundleID, appVersion });
    console.log('registerToken body', body);
    const { id, signal } = abortTimeout(10);
    const request = new Request(`${domainURL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization(appKey, bundleID),
        },
        body: JSON.stringify(body)
    });
    try {
        const response = yield fetch(request, { signal });
        clearTimeout(id);
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.BPush = {
    registerToken: (props) => registerToken(props.pushToken, props.appKey, props.bundleID, props.appVersion || '')
};
