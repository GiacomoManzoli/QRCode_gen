import { JOmnisWrapper } from "./OmnisWrapper"
import QRCode from "qrcode"

const TAG = "OM_INT"

export class OmnisCallbackObject {
    public jOmnisWrapper: JOmnisWrapper

    constructor(jOmnisWrapper: JOmnisWrapper) {
        this.jOmnisWrapper = jOmnisWrapper
    }

    omnisOnLoad() {
        console.info(`${TAG} Omnis interface loaded. Waiting for the communication link...`)
    }

    omnisOnWebSocketOpened() {
        console.info(`${TAG} web socket opened`)
        this.jOmnisWrapper.sendEvent("ev_Ready")
    }

    omnisSetData(params) {
        console.log("omnisSetData", params)
    }

    omnisGetData(params) {
        console.log("omnisGetData", params)
    }

    renderQRCode(params: { text: string }) {
        console.log("render_QRCode", params)

        QRCode.toDataURL(params.text, { width: 256, margin: 0 })
            .then(url => {
                console.log(`render_QRCode - caratteri DataURL: ${url.length}`)
                // if (this.imageElement) {
                //     this.imageElement.src = url
                // }
                this.jOmnisWrapper.sendEvent("ev_QRCodeReady", {
                    qrcode: url
                })
            })
            .catch(err => {
                console.error(err)
                this.jOmnisWrapper.sendEvent("ev_Error")
            })
    }
}
