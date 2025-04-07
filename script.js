// script.js
const imageInput = document.getElementById('imageInput');
const dropzone = document.querySelector('.dropzone');
const convertBtn = document.getElementById('convertBtn');
const preview = document.querySelector('.preview');
const qualityInput = document.getElementById('quality');
const progress = document.getElementById('progress');
let filesToConvert = [];

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.parentElement.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.parentElement.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.parentElement.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

imageInput.addEventListener('change', (e) => handleFiles(e.target.files));

function handleFiles(files) {
    filesToConvert = Array.from(files);
    convertBtn.disabled = !filesToConvert.length;
    preview.innerHTML = '';
    filesToConvert.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            img.alt = `Original image ${index + 1}`;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

convertBtn.addEventListener('click', async () => {
    const quality = qualityInput.value / 100;
    progress.value = 0;
    const convertedFiles = [];

    for (let i = 0; i < filesToConvert.length; i++) {
        const file = filesToConvert[i];
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const webpData = canvas.toDataURL('image/webp', quality);
        convertedFiles.push({ name: file.name.replace(/\.[^/.]+$/, '.webp'), data: webpData });
        progress.value = ((i + 1) / filesToConvert.length) * 100;
    }

    if (convertedFiles.length === 1) {
        downloadFile(convertedFiles[0].data, convertedFiles[0].name);
    } else {
        const zip = new JSZip();
        convertedFiles.forEach(file => zip.file(file.name, file.data.split(',')[1], { base64: true }));
        zip.generateAsync({ type: 'blob' }).then(blob => downloadFile(URL.createObjectURL(blob), 'converted-images.zip'));
    }
});

function downloadFile(data, filename) {
    const a = document.createElement('a');
    a.href = data;
    a.download = filename;
    a.click();
}
