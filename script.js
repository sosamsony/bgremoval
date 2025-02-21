const API_KEY = 'CxburPJP3Q3crZjhm5psQS5K';
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const loader = document.getElementById('loader');
const removeBgBtn = document.getElementById('remove-bg');
let processedImageUrl = null;

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Drag & Drop Handlers
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.transform = 'scale(1.02)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.transform = 'scale(1)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.transform = 'scale(1)';
    handleFile(e.dataTransfer.files[0]);
});

// File Input Handler
fileInput.addEventListener('change', (e) => {
    if(e.target.files[0]) handleFile(e.target.files[0]);
});

async function handleFile(file) {
    if(!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    try {
        const originalUrl = URL.createObjectURL(file);
        document.getElementById('original-image').src = originalUrl;
        document.getElementById('preview-container').style.display = 'flex';
        document.getElementById('controls').style.display = 'block';
        document.getElementById('download-section').style.display = 'none';
        processedImageUrl = null;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Remove Background Handler
removeBgBtn.addEventListener('click', async () => {
    if(!fileInput.files[0]) return;

    try {
        loader.style.display = 'block';
        removeBgBtn.disabled = true;

        const formData = new FormData();
        formData.append('image_file', fileInput.files[0]);
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': API_KEY },
            body: formData
        });

        if(!response.ok) throw new Error('Background removal failed');
        
        const blob = await response.blob();
        processedImageUrl = URL.createObjectURL(blob);
        
        document.getElementById('result-image').src = processedImageUrl;
        document.getElementById('result-image').classList.add('processed-animation');
        document.getElementById('download-section').style.display = 'block';
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        loader.style.display = 'none';
        removeBgBtn.disabled = false;
    }
});

function downloadResult() {
    if(!processedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Add download animation
    const downloadBtn = document.querySelector('#download-section button');
    downloadBtn.style.transform = 'scale(0.95)';
    setTimeout(() => downloadBtn.style.transform = 'scale(1)', 200);
}