import { useState } from 'react'
import s from '../StudentPortal.module.css'
import useQrScanner from '../hooks/useQrScanner'

export default function ScanView({ showToast }) {
  const [manualCode, setManualCode] = useState('')

  const { start } = useQrScanner({
    elementId: 'reader',
    onScan: (text) => showToast(`Scanned: ${text}`, 'success'),
    onError: () => showToast('Cannot access camera', 'error'),
  })

  const submitManual = () => {
    const code = manualCode.trim()
    if (!code) return
    showToast(`Code submitted: ${code}`, 'info')
    setManualCode('')
  }

  return (
    <section className={`${s.view} ${s.narrow}`}>
      <div className={s.viewHeader}>
        <h2>QR Scanner</h2>
        <p className={s.viewSubtitle}>Scan event or class check-in codes.</p>
      </div>

      <div className={s.scanCard}>
        <div className={s.cameraBox}>
          <div id="reader" className={s.reader}></div>
        </div>

        <button className="btn btn-primary" onClick={start}>
          <i className="fa-solid fa-camera"></i> Start Scanning
        </button>

        <div className={s.manual}>
          <label htmlFor="scan-code-input">Manual Code Check-in</label>
          <div className={s.manualRow}>
            <input
              type="text"
              id="scan-code-input"
              className="input input-mono"
              placeholder="Enter session or check-in code..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <button className="btn btn-primary" onClick={submitManual}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
