// 'HH:MM' o 'HH:MM:SS' -> '8:10 AM'
export function fmtTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

// 'YYYY-MM-DD' -> 'Mon, Oct 26, 2026'
export function fmtDate(d) {
  return new Date(`${d}T00:00:00`).toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function addMinutes(t, mins) {
  const [h, m] = t.split(':').map(Number)
  const total = Math.min(h * 60 + m + mins, 23 * 60 + 59)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export const todayLocal = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD