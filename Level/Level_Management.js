window.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.header');
    const mainContent = document.querySelector('.main-content');
    
    if (navbar && mainContent) {
        const navbarHeight = navbar.offsetHeight;
        mainContent.style.marginTop = `${navbarHeight}px`;
    }
});

document.getElementById('add-link-btn').addEventListener('click', function () {
    const linksContainer = document.getElementById('links-container');
    const newLinkInput = document.createElement('input');
    newLinkInput.type = 'url';
    newLinkInput.className = 'form-control mb-2 nivel-link';
    newLinkInput.name = 'links[]';
    newLinkInput.placeholder = 'https://ejemplo.com';
    linksContainer.appendChild(newLinkInput);
});

document.getElementById('nivel-video').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('video-preview');
    const placeholder = document.getElementById('video-placeholder');

    if (file) {
        const fileURL = URL.createObjectURL(file);
        preview.src = fileURL;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        preview.style.display = 'none';
        preview.src = '';
        placeholder.style.display = 'block';
    }
});

document.getElementById('nivel-material').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('material-preview-container');
    const previewElement = document.getElementById('material-preview');

    // Limpia la vista previa anterior
    previewContainer.style.display = 'none';
    previewElement.innerHTML = '';

    if (file) {
        const fileType = file.type;
        const fileURL = URL.createObjectURL(file);

        if (fileType.startsWith('image/')) {
            // Si el archivo es una imagen, mostrarla
            const img = document.createElement('img');
            img.src = fileURL;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '300px';
            img.style.border = '1px solid #5D3FD3';
            img.style.borderRadius = '8px';
            previewElement.appendChild(img);
        } else if (fileType === 'application/pdf') {
            // Si es un PDF, mostrar un visor embebido
            const iframe = document.createElement('iframe');
            iframe.src = fileURL;
            iframe.style.width = '100%';
            iframe.style.height = '300px';
            iframe.style.border = '1px solid #5D3FD3';
            previewElement.appendChild(iframe);
        } else {
            // Para otros archivos, muestra un enlace de descarga
            const link = document.createElement('a');
            link.href = fileURL;
            link.target = '_blank';
            link.textContent = `Descargar: ${file.name}`;
            link.style.display = 'block';
            link.style.color = '#5D3FD3';
            previewElement.appendChild(link);
        }

        // Muestra el contenedor de la vista previa
        previewContainer.style.display = 'block';
    }
});
