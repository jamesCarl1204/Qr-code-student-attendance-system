import { useCallback, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function useQrScanner({ elementId = 'reader', onScan, onError }) {
  const scannerRef = useRef(null)
  const cbRef = useRef({ onScan, onError })
  cbRef.current = { onScan, onError }

  const stop = useCallback(async () => {
    const sc = scannerRef.current
    if (sc && sc.isScanning) {
      try {
        await sc.stop()
      } catch (err) {
        console.error(err)
      }
    }
  }, [])

  const start = useCallback(async () => {
    await stop()
    scannerRef.current = new Html5Qrcode(elementId)
    try {
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
          cbRef.current.onScan?.(decodedText)
          stop()
        }
      )
    } catch {
      cbRef.current.onError?.()
    }
  }, [elementId, stop])

  // pag umalis sa Scan tab (unmount), automatic na titigil ang camera
  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { start, stop }
}
