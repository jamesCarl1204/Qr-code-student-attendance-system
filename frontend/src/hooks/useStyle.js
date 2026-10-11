import { useEffect } from 'react'

// Nilalagay ang CSS string sa <head> habang naka-mount ang page,
// tinatanggal pag umalis. Para hindi mag-clash ang CSS ng bawat portal.
export default function useStyle(css) {
  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = css
    document.head.appendChild(el)
    return () => el.remove()
  }, [css])
}