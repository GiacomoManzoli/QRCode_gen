import { OmnisSocketClient } from "jomnis-socket-client"
import QRCode from "qrcode"

let anyWindow = window as any
if (!anyWindow.jOmnis) {
    console.error("jOmnis non definito")
}

console.log("Completata inizializzazione applicazione")

const imageElement = document.getElementById("qrcode-image") as HTMLImageElement

const socketClient = new OmnisSocketClient(jOmnis)

socketClient.on("socketReady", async () => {
    socketClient.sendMessage("ev_Ready")
})

socketClient.on("act_EncodeText", async request => {
    const text = request.message.data.text
    QRCode.toDataURL(text, { width: 256, margin: 0 })
        .then(url => {
            console.log(`render_QRCode - caratteri DataURL: ${url.length}`)
            if (imageElement) {
                imageElement.src = url
            }
            request.return({ qrcode: url })
        })
        .catch(err => {
            console.error(err)
            request.returnError(-1, "Errore nella generazione del QRCode", { error: err })
        })
})

socketClient.on("act_EncodeTextBatch", async request => {
    const { arrayJSON } = request.message.data
    const textArray: string[] = JSON.parse(arrayJSON)
    console.log("act_EncodeTextBatch", textArray)

    const qrPromises = textArray.map(t => QRCode.toDataURL(t, { width: 256, margin: 0 }))
    Promise.all(qrPromises)
        .then(data => {
            request.return({ qrCodes: data })
        })
        .catch(err => {
            console.error(err)
            request.returnError(-2, "Errore nella generazione dei QRCode", { error: err })
        })
})

socketClient.open()
