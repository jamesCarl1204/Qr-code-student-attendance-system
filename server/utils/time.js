const nowPH = () => {
    const shifted = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    return { date: shifted.slice(0, 10), time: shifted.slice(11, 19) }   // 'YYYY-MM-DD', 'HH:MM:SS'
}

const sessionStatus = (session, now = nowPH()) => {
    if (session.session_date > now.date) return 'Upcoming'
    if (session.session_date < now.date) return 'Ended'
    if (now.time < session.class_start) return 'Upcoming'
    if (now.time >= session.class_end) return 'Ended'
    return 'Ongoing'
}

module.exports = { nowPH, sessionStatus }