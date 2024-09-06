import { v4 as uuidv4 } from 'uuid';

interface RegisterTokenRequestBody {
    deviceID: string
    platform: 'web' | 'ios' | 'android'
    token: string
    env: string
    bundleID: string
    version: string
    appVersion: string
    deviceBrand: string
    deviceModel: string
    osVersion: string
}

const authorization = (appKey: string, bundleID: string) => `Basic ${btoa(`${appKey}:${bundleID}`)}`

const getOrNewUUID = () => {

    const key = 'b_uuid'
    let uuid = localStorage.getItem(key)
    if (!uuid) {
        uuid = uuidv4()
        localStorage.setItem(key, uuid)
    }
    return uuid
}

const abortTimeout = (ms: number) => {
    const controller = new AbortController()
    const { signal } = controller
    const id = setTimeout(() => signal, ms)
    return { id, signal }
}

const registerTokenBody: (props: { pushToken: string, bundleID: string }) => RegisterTokenRequestBody = ({ pushToken, bundleID }) => {

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
    }
}

const registerToken = async (pushToken: string, appKey: string, bundleID: string) => {
    const domainURL: string = 'http://10.150.210.156:8080' //暫時
    const path: string = '/api/v1/sdk/registerToken'
    const body = registerTokenBody({ pushToken, bundleID })
    const { id, signal } = abortTimeout(10)

    const request = new Request(`${domainURL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization(appKey, bundleID),
        },
        body: JSON.stringify(body)
    })

    try {
        const response = await fetch(request, { signal })
        clearTimeout(id)
        return response
    } catch (error) {
        throw error
    }
}

export const API = {
    registerToken: (pushToken: string, appKey: string, bundleID: string) => registerToken(pushToken, appKey, bundleID)
}