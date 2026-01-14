const notesTextarea = document.getElementById('notes');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const urlInput = document.getElementById('urlInput');
const copyUrlBtn = document.getElementById('copyUrlBtn');

function encodeToBase64(str) {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        console.error('Encoding error:', e);
        return '';
    }
}

function decodeFromBase64(str) {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        console.error('Decoding error:', e);
        return '';
    }
}

function updateURL(notes) {
    const encoded = encodeToBase64(notes);
    const url = new URL(window.location.href);
    
    if (encoded) {
        url.searchParams.set('n', encoded);
    } else {
        url.searchParams.delete('n');
    }
    
    window.history.replaceState({}, '', url);
    urlInput.value = url.toString();
}

function loadNotesFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedNotes = urlParams.get('n');
    
    if (encodedNotes) {
        const decodedNotes = decodeFromBase64(encodedNotes);
        notesTextarea.value = decodedNotes;
        urlInput.value = window.location.href;
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

notesTextarea.addEventListener('input', () => {
    updateURL(notesTextarea.value);
});

copyBtn.addEventListener('click', () => {
    copyToClipboard(urlInput.value);
});

copyUrlBtn.addEventListener('click', () => {
    copyToClipboard(urlInput.value);
});

clearBtn.addEventListener('click', () => {
    if (notesTextarea.value && confirm('Are you sure you want to clear all notes?')) {
        notesTextarea.value = '';
        updateURL('');
        showNotification('Notes cleared!');
    }
});

window.addEventListener('load', loadNotesFromURL);

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);