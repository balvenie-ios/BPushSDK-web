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

const osInfo = () => {
    const { userAgent } = navigator
    const os = userAgent.match(/\(([^)]+)\)/)

    let deviceBrand: string = ''
    let deviceModel: string = ''

    if (os) {
        const line = os[1]
        const words = line.split(' ')

        const iPhoneIndex = words.findIndex((e) => e === 'iPhone')
        if (iPhoneIndex > -1) {
            deviceBrand = 'iPhone'
            const osIndex = words.findIndex((e) => e === 'OS')
            deviceModel = words.at(osIndex + 1) || ''
            return { deviceBrand, deviceModel }
        }

        const macIndex = words.findIndex((e) => e === 'Mac')
        if (macIndex > -1) {
            deviceBrand = 'Mac'
            deviceModel = words.at(-1) || ''
            return { deviceBrand, deviceModel }
        }

        const androidIndex = words.findIndex((e) => e === 'Android')
        if (androidIndex > -1) {
            deviceBrand = 'Android'
            deviceModel = words.at(androidIndex + 1) || ''
            return { deviceBrand, deviceModel }
        }

        const windowIndex = words.findIndex((e) => e === 'Windows')
        if (androidIndex > -1) {
            deviceBrand = 'Windows'
            deviceModel = words.at(windowIndex + 2) || ''
            return { deviceBrand, deviceModel }
        }
    }

    return { deviceBrand, deviceModel }
}

const registerTokenBody: (props: { pushToken: string, bundleID: string, appVersion: string }) => RegisterTokenRequestBody = ({ pushToken, bundleID, appVersion = '' }) => {
    const { deviceBrand, deviceModel } = osInfo()

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
    }
}

const registerToken = async (pushToken: string, appKey: string, bundleID: string, appVersion: string) => {
    const domainURL: string = 'https://bpushdev-api.zzishare.com' //暫時
    const path: string = '/api/v1/sdk/registerToken'
    const body = registerTokenBody({ pushToken, bundleID, appVersion })
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

export const BPush = {
    registerToken: (props: { pushToken: string, appKey: string, bundleID: string, appVersion?: string }) => registerToken(props.pushToken, props.appKey, props.bundleID, props.appVersion || '')
}