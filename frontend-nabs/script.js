const API_URL = ' https://be-rest-255520032221.us-central1.run.app';

let currentEditId = null;

const noteForm = document.getElementById('noteForm');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const notesList = document.getElementById('notesList');
const formTitle = document.getElementById('formTitle');
const noteCount = document.getElementById('noteCount');


document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();
});

noteForm.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', resetForm);

async function fetchNotes() {
    try {
        showLoading();
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const notes = await response.json();
        displayNotes(notes);
        updateNoteCount(notes.length);
    } catch (error) {
        console.error('error notes', error);
        showError('Gagal memuat Catatan');
        notesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-database"></i>
                <p> Gagal Terhubung ke Server</p>
            </div>
        `;
    }
}

function displayNotes(notes) {
    if (!notes || notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-notes-medical"></i>
                <p> Belum ada Catatan</p>
            </div>
        `;
        return;
    }

    notesList.innerHTML = notes.map(note => `
            <div class="note-card" data-id="${note.id}">
            <h3>${escapeHtml(note.judul)}</h3>
            <p>${escapeHtml(note.isi)}</p>
            <small>
                <i class="far fa-calendar-alt"></i> 
                ${formatDate(note.tanggal_dibuat)}
            </small>
            <div class="card-actions">
                <button class="edit-btn" onclick="editNote(${note.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">
                    <i class="fas fa-trash-alt"></i> Hapus
                </button>
            </div>
        </div>
    `).join('');
}

async function addNote(judul, isi) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ judul, isi})
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Gagal menambahkan catatan');
        }

        await fetchNotes();
        resetForm();
        showSuccess('Catatan Berhasil ditambahkan');
    } catch (error) {
        console.error('error adding note:', error);
        showError(error.message);
    }  
}

async function updateNote(id, judul, isi) {
    console.log('Update ID:', id);
    console.log('Judul:', judul);

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                judul: judul, 
                isi: isi })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Gagal mengupdate catatan');   
        }

        await fetchNotes();
        resetForm();
        showSuccess('Catatan berhasil diupdate');
    } catch (error) {
        console.error('Error updating note:', error);
        showError(error.message);
    }
}

async function deleteNote(id) {
    if (confirm('Apakah ingin menghapus catatan ini?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal menghapus catatan');
            }

            await fetchNotes();
            showSuccess('Catatan berhasil dihapus');
        } catch (error) {
            console.error('error deleting note:', error);
            showError(error.message);
        }
    }
}


async function editNote(id) {
    console.log('edit ID:', id);

    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Gagal mengambil data catatan');
        }

        const note = await response.json();
        console.log('data note:', note);

        currentEditId = note.id;
        judulInput.value = note.judul;
        isiInput.value = note.isi;

        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Catatan';
        cancelBtn.style.display = 'inline-flex';
        formTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Catatan';

        document.querySelector('.form-card').scrollIntoView({
            behavior: 'smooth'
        });

        showSuccess('Silahkan ubah catatan anda');
    } catch (error) {
        console.error('Error fetching note:', error);
        showError('Gagal mengambil catatan untuk diedit');
    }
}

function resetForm() {
    currentEditId = null;
    judulInput.value = '';
    isiInput.value = '';
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Catatan';
    cancelBtn.style.display = 'none';
    formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Catatan Baru';
}

// Handle form submit
function handleSubmit(e) {
    e.preventDefault();
    
    const judul = judulInput.value.trim();
    const isi = isiInput.value.trim();

    console.log('📋 Submit - currentEditId:', currentEditId);
    
    // Validasi
    if (!judul) {
        showWarning('⚠️ Judul catatan harus diisi!');
        judulInput.focus();
        return;
    }
    
    if (!isi) {
        showWarning('⚠️ Isi catatan harus diisi!');
        isiInput.focus();
        return;
    }
    
    if (currentEditId) {
        updateNote(currentEditId, judul, isi);
    } else {
        addNote(judul, isi);
    }
}

// ==================== FUNGSI PEMBANTU ====================

// Update jumlah catatan
function updateNoteCount(count) {
    if (noteCount) {
        noteCount.textContent = count;
    }
}

// Tampilkan loading
function showLoading() {
    notesList.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Memuat catatan...</p>
        </div>
    `;
}

// Escape HTML untuk keamanan (mencegah XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format tanggal ke format Indonesia
function formatDate(dateString) {
    if (!dateString) return 'Tanggal tidak tersedia';
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
}

// ==================== NOTIFICATIONS ====================

// Tampilkan notifikasi sukses
function showSuccess(message) {
    showNotification(message, 'success');
}

// Tampilkan notifikasi error
function showError(message) {
    showNotification(message, 'error');
}

// Tampilkan notifikasi warning
function showWarning(message) {
    showNotification(message, 'warning');
}

// Fungsi notifikasi utama
function showNotification(message, type = 'success') {
    // Hapus notifikasi yang sudah ada
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon berdasarkan tipe
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
    }
    
    notification.innerHTML = `${icon} ${message}`;
    document.body.appendChild(notification);
    
    // Auto remove setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== EXPORT FUNCTIONS GLOBAL ====================
// Agar fungsi bisa dipanggil dari HTML (onclick)
window.editNote = editNote;
window.deleteNote = deleteNote;