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
const registerTokenBody = ({ pushToken, bundleID }) => {
    return {
        deviceID: getOrNewUUID(),
        platform: 'web',
        token: pushToken,
        env: 'product',
        bundleID,
        version: '1.0.0',
        appVersion: '1.0.0',
        deviceBrand: navigator.platform,
        deviceModel: navigator.appCodeName,
        osVersion: '1.0.0',
    };
};
const registerToken = (pushToken, appKey, bundleID) => __awaiter(void 0, void 0, void 0, function* () {
    const domainURL = 'http://10.150.210.142:8080'; //暫時
    const path = '/api/v1/sdk/registerToken';
    const body = registerTokenBody({ pushToken, bundleID });
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
    registerToken: (pushToken, appKey, bundleID) => registerToken(pushToken, appKey, bundleID)
};
