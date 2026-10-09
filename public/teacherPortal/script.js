const sidebarBtns = document.querySelectorAll('.sidebar-btn')
const views = {
    classes: document.getElementById('view-classes'),
    archived: document.getElementById('view-archived'),
    'ai-chat': document.getElementById('view-ai-chat'),
}

sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sidebarBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        Object.values(views).forEach(v => v.classList.add('hidden'))
        views[btn.dataset.target].classList.remove('hidden')
    })
})

const createClassModal = document.getElementById('create-class-modal')
const createClassForm = document.getElementById('create-class-form')

function openCreateClassModal() {
    createClassModal.classList.remove('hidden')
}

function closeCreateClassModal() {
    createClassModal.classList.add('hidden')
}

document.getElementById('open-create-class').addEventListener('click', openCreateClassModal)
document.getElementById('empty-create-class').addEventListener('click', openCreateClassModal)
document.getElementById('close-create-class').addEventListener('click', closeCreateClassModal)

createClassForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('class-name-input').value.trim()
    const code = document.getElementById('class-code-input').value.trim()

    if (!name || !code) return

    closeCreateClassModal()
    showToast(`Class "${name}" (${code}) created successfully!`, 'success')
    createClassForm.reset()
})

document.getElementById('logout-btn').addEventListener('click', () => {
    showToast('Logout action triggered.', 'info')
})

const chatForm = document.getElementById('chat-form')
const chatInput = document.getElementById('chat-input')
const chatMessages = document.getElementById('chat-messages')
const chatSubmitBtn = document.getElementById('chat-submit-btn')

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
    return text.replace(/[&<>"']/g, m => map[m])
}

function appendUserMessage(text) {
    const row = document.createElement('div')
    row.className = 'chat-row user'
    row.innerHTML = `
        <div class="chat-bubble user"><p>${escapeHtml(text)}</p></div>
        <div class="chat-avatar user">YOU</div>
    `
    chatMessages.appendChild(row)
}

function appendLoadingBubble() {
    const row = document.createElement('div')
    row.className = 'chat-row'
    row.id = 'loading-row'
    row.innerHTML = `
        <div class="chat-avatar ai">AI</div>
        <div class="chat-bubble ai loading">
            <span class="dot-bounce"></span>
            <span class="dot-bounce"></span>
            <span class="dot-bounce"></span>
        </div>
    `
    chatMessages.appendChild(row)
}

function appendAiMessage(text) {
    const row = document.createElement('div')
    row.className = 'chat-row'
    row.innerHTML = `
        <div class="chat-avatar ai">AI</div>
        <div class="chat-bubble ai"><p>${escapeHtml(text).replace(/\n/g, '<br>')}</p></div>
    `
    chatMessages.appendChild(row)
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const prompt = chatInput.value.trim()
    if (!prompt) return

    appendUserMessage(prompt)
    chatInput.value = ''
    chatMessages.scrollTop = chatMessages.scrollHeight
    appendLoadingBubble()
    chatMessages.scrollTop = chatMessages.scrollHeight
    chatSubmitBtn.disabled = true

    try {
        const response = await fetch('/api/teacher/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        })

        const data = await response.json()
        document.getElementById('loading-row')?.remove()

        const replyText = data.reply || "I'm sorry, I couldn't generate a response right now. Please try again."
        appendAiMessage(replyText)
    } catch (err) {
        document.getElementById('loading-row')?.remove()
        showToast('Failed to reach the AI assistant.', 'error')
    } finally {
        chatSubmitBtn.disabled = false
        chatMessages.scrollTop = chatMessages.scrollHeight
    }
})

document.getElementById('clear-chat-btn').addEventListener('click', () => {
    chatMessages.innerHTML = `
        <div class="chat-row">
            <div class="chat-avatar ai">AI</div>
            <div class="chat-bubble ai">
                <p>Chat history cleared. How else can I assist your teaching workflow today?</p>
            </div>
        </div>
    `
})

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container')
    const toast = document.createElement('div')

    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' }
    toast.className = `toast toast-${type}`
    toast.innerHTML = `<i class="fa-solid ${icons[type]}"></i><span>${message}</span>`

    container.appendChild(toast)
    setTimeout(() => toast.classList.add('show'), 10)
    setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => toast.remove(), 300)
    }, 3000)
}