class CameraApp {
    constructor() {
        this.stream = null;
        this.photos = [];
        this.currentCamera = 'user';
        this.availableCameras = [];
        this.cameraStarted = false;
        this.selectedPhoto = null;

        this.initializeElements();
        this.bindEvents();
        this.getAvailableCameras();
    }

    initializeElements() {
        // Camera elements
        this.startCameraBtn = document.getElementById('start-camera-btn');
        this.startCameraContainer = document.getElementById('start-camera-container');
        this.videoContainer = document.getElementById('video-container');
        this.videoPreview = document.getElementById('video-preview');
        this.cameraControls = document.getElementById('camera-controls');
        this.switchCameraBtn = document.getElementById('switch-camera-btn');
        this.captureBtn = document.getElementById('capture-btn');
        this.captureFlash = document.getElementById('capture-flash');
        this.captureCanvas = document.getElementById('capture-canvas');

        // Gallery elements
        this.photoGallery = document.getElementById('photo-gallery');
        this.photoGrid = document.getElementById('photo-grid');
        this.photoCount = document.getElementById('photo-count');

        // Modal elements
        this.photoModal = document.getElementById('photo-modal');
        this.modalImage = document.getElementById('modal-image');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.downloadModalBtn = document.getElementById('download-modal-btn');

        // Error elements
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
    }

    bindEvents() {
        this.startCameraBtn.addEventListener('click', () => this.startCamera());
        this.switchCameraBtn.addEventListener('click', () => this.switchCamera());
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.downloadModalBtn.addEventListener('click', () => this.downloadSelectedPhoto());

        // Close modal when clicking outside
        this.photoModal.addEventListener('click', (e) => {
            if (e.target === this.photoModal) {
                this.closeModal();
            }
        });
    }

    async getAvailableCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.availableCameras = devices.filter(device => device.kind === 'videoinput');

            // Hide switch camera button if only one camera
            if (this.availableCameras.length <= 1) {
                this.switchCameraBtn.style.display = 'none';
            }
        } catch (err) {
            console.error('Error getting cameras:', err);
        }
    }

    async startCamera() {
        try {
            this.hideError();

            // Stop existing stream
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: this.currentCamera,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoPreview.srcObject = this.stream;

            // Show video container and controls
            this.startCameraContainer.classList.add('hidden');
            this.videoContainer.classList.remove('hidden');
            this.cameraControls.classList.remove('hidden');

            this.cameraStarted = true;
        } catch (err) {
            this.showError('Unable to access camera. Please ensure you have granted camera permissions.');
            console.error('Camera error:', err);
        }
    }

    capturePhoto() {
        if (!this.videoPreview || !this.captureCanvas) return;

        // Show capture flash effect
        this.captureFlash.classList.remove('hidden');
        this.captureFlash.classList.add('capture-flash');

        const video = this.videoPreview;
        const canvas = this.captureCanvas;
        const context = canvas.getContext('2d');

        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            const newPhoto = {
                id: Date.now().toString(),
                dataUrl,
                timestamp: new Date()
            };

            this.photos.unshift(newPhoto);
            this.updatePhotoGallery();
        }

        // Hide flash effect after animation
        setTimeout(() => {
            this.captureFlash.classList.add('hidden');
            this.captureFlash.classList.remove('capture-flash');
        }, 200);
    }

    switchCamera() {
        this.currentCamera = this.currentCamera === 'user' ? 'environment' : 'user';
        if (this.cameraStarted) {
            this.startCamera();
        }
    }

    updatePhotoGallery() {
        this.photoCount.textContent = this.photos.length;

        if (this.photos.length > 0) {
            this.photoGallery.classList.remove('hidden');
            this.photoGallery.classList.add('fade-in');
        }

        this.photoGrid.innerHTML = '';

        this.photos.forEach((photo) => {
            const photoElement = this.createPhotoElement(photo);
            this.photoGrid.appendChild(photoElement);
        });
    }

    createPhotoElement(photo) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'relative group cursor-pointer';
        photoDiv.addEventListener('click', () => this.openModal(photo));

        photoDiv.innerHTML = `
        <img
          src="${photo.dataUrl}"
          alt="Captured ${photo.timestamp.toLocaleString()}"
          class="w-full aspect-square object-cover rounded-xl shadow-lg transition-transform duration-300 photo-hover"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-all duration-300"></div>
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button class="download-btn glassmorphism rounded-full p-2 mr-2 hover:bg-white/20" data-photo-id="${photo.id}">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </button>
          <button class="delete-btn bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md rounded-full p-2" data-photo-id="${photo.id}">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;

        // Add event listeners for download and delete buttons
        const downloadBtn = photoDiv.querySelector('.download-btn');
        const deleteBtn = photoDiv.querySelector('.delete-btn');

        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.downloadPhoto(photo);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deletePhoto(photo.id);
        });

        return photoDiv;
    }

    openModal(photo) {
        this.selectedPhoto = photo;
        this.modalImage.src = photo.dataUrl;
        this.photoModal.classList.remove('hidden');
        this.photoModal.classList.add('fade-in');
    }

    closeModal() {
        this.photoModal.classList.add('hidden');
        this.photoModal.classList.remove('fade-in');
        this.selectedPhoto = null;
    }

    downloadPhoto(photo) {
        const link = document.createElement('a');
        link.download = `photo-${photo.timestamp.toISOString().split('T')[0]}-${photo.id}.jpg`;
        link.href = photo.dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadSelectedPhoto() {
        if (this.selectedPhoto) {
            this.downloadPhoto(this.selectedPhoto);
        }
    }

    deletePhoto(photoId) {
        this.photos = this.photos.filter(photo => photo.id !== photoId);
        this.updatePhotoGallery();

        if (this.selectedPhoto && this.selectedPhoto.id === photoId) {
            this.closeModal();
        }

        // Hide gallery if no photos
        if (this.photos.length === 0) {
            this.photoGallery.classList.add('hidden');
        }
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.errorMessage.classList.add('fade-in');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
        this.errorMessage.classList.remove('fade-in');
    }
}

// Initialize the camera app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CameraApp();
});