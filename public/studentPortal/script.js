const joinModal = document.getElementById('join-modal');

document.getElementById('join-class-btn').addEventListener('click', () => joinModal.classList.add('active'));
document.getElementById('empty-join-btn').addEventListener('click', () => joinModal.classList.add('active'));
document.getElementById('join-close-btn').addEventListener('click', () => joinModal.classList.remove('active'));

function showToast(message, type = 'success') {
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type]}"></i><span>${message}</span>`;

    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

const items = document.querySelectorAll('.sidebar-item');
const views = document.querySelectorAll('.view');

items.forEach(item => {
    item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        views.forEach(v => v.style.display = 'none');
        document.getElementById(`view-${item.dataset.target}`).style.display = 'block';

        if (item.dataset.target !== 'scan') stopScanner();
    });
});

let html5QrCode = null;

async function startScanner() {
    html5QrCode = new Html5Qrcode('reader');  
    try {
        await html5QrCode.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 200, height: 200 } },
            (decodedText) => {
                showToast(`Scanned: ${decodedText}`, 'success');
                stopScanner();
            }
        );
    } catch (err) {
        showToast('Cannot access camera', 'error');
    }
}

async function stopScanner() {
    if (html5QrCode && html5QrCode.isScanning) {
        await html5QrCode.stop();
    }
}

document.getElementById('start-scan-btn').addEventListener('click', startScanner);