
function init() {
    console.log("Initializing Family Tree Map...");

    // 1. Compute Layout
    const processedTree = computeLayout(familyData);

    // 2. Render
    const bounds = renderTree(processedTree, 'canvas-container');

    // 3. Setup Pan/Zoom
    const container = document.getElementById('canvas-container');
    const viewport = document.getElementById('viewport');

    if (!viewport) return;

    // State
    let pointX = 0;
    let pointY = 0;
    let scale = 1;
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };

    // Drag State
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // Modal Elements
    const modal = document.getElementById('profile-modal');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalInitials = document.getElementById('modal-initials');
    const closeBtn = document.querySelector('.close-btn');

    // Initial Center
    if (bounds) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const treeWidth = bounds.maxX - bounds.minX;
        const treeHeight = bounds.maxY - bounds.minY;

        // Center the tree
        pointX = (containerWidth - treeWidth) / 2 - bounds.minX + 200; // + padding
        pointY = 50; // Top padding

        updateTransform();
    }

    function updateTransform() {
        viewport.setAttribute('transform', `translate(${pointX}, ${pointY}) scale(${scale})`);
    }

    // Pan
    container.addEventListener('mousedown', (e) => {
        isDragging = false;
        isPanning = true;
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        isDragging = true; // If we moved, it's a drag
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        updateTransform();
    });

    container.addEventListener('mouseup', () => {
        isPanning = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mouseleave', () => {
        isPanning = false;
        container.style.cursor = 'grab';
    });

    // Click Handling (Delegation)
    container.addEventListener('click', (e) => {
        if (isDragging) {
            isDragging = false; // Reset
            return; // It was a drag, ignore click
        }

        const node = e.target.closest('.node');
        if (node) {
            const name = node.dataset.name;
            const image = node.dataset.image;
            openModal(name, image);
        }
    });

    // Modal Functions
    function openModal(name, image) {
        modalName.textContent = name;

        if (image && image !== 'undefined') {
            modalImage.src = image;
            modalImage.style.display = 'block';
            modalInitials.classList.add('hidden');
        } else {
            modalImage.style.display = 'none';
            modalInitials.textContent = getInitials(name);
            modalInitials.classList.remove('hidden');
        }

        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    // Close Listeners
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();

        const zoomIntensity = 0.1;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomIntensity);

        const newScale = scale * zoom;

        // Calculate pointer position relative to viewport
        // This makes it zoom towards the mouse
        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // adjust pointX/Y so that the point under cursor remains stationary
        pointX = offsetX - (offsetX - pointX) * zoom;
        pointY = offsetY - (offsetY - pointY) * zoom;

        scale = newScale;

        updateTransform();
    }, { passive: false });

    // Double click to reset
    container.addEventListener('dblclick', () => {
        scale = 1;
        updateTransform();
    });

    // Touch Support
    let initialPinchDistance = null;
    let lastScale = 1;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            // Single finger pan
            isDragging = false;
            isPanning = true;
            startX = e.touches[0].clientX - pointX;
            startY = e.touches[0].clientY - pointY;
        } else if (e.touches.length === 2) {
            // Two finger pinch
            isPanning = false; // Stop panning
            initialPinchDistance = getPinchDistance(e);
            lastScale = scale;
        }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling

        if (e.touches.length === 1 && isPanning) {
            // Pan
            isDragging = true; // Moved enough to be a drag
            pointX = e.touches[0].clientX - startX;
            pointY = e.touches[0].clientY - startY;
            updateTransform();
        } else if (e.touches.length === 2 && initialPinchDistance) {
            // Zoom
            const currentDistance = getPinchDistance(e);
            const zoomFactor = currentDistance / initialPinchDistance;

            // Calculate center of pinch to zoom towards it
            const rect = container.getBoundingClientRect();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
            const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

            // Apply zoom relative to center logic (simplified for stability)
            // Ideally we want to zoom towards center, but for now simple scale update:
            const newScale = lastScale * zoomFactor;

            // To zoom towards center correctly:
            // pointX = centerX - (centerX - pointX) * (newScale / scale);
            // pointY = centerY - (centerY - pointY) * (newScale / scale);
            // But doing this continuously in touchmove can be jumpy if not careful.
            // Let's stick to simple centering or just scale update for now, 
            // or use the same math as wheel:

            const scaleRatio = newScale / scale;
            pointX = centerX - (centerX - pointX) * scaleRatio;
            pointY = centerY - (centerY - pointY) * scaleRatio;

            scale = newScale;
            updateTransform();

            // Update initial distance/scale for next move event to avoid compounding errors?
            // Actually standard way is to keep initial and multiply. 
            // Better: update lastScale and initialPinchDistance for smooth "delta" zooming
            // BUT simpler logic: just set scale = lastScale * zoomFactor is stable if we don't reset initialPinchDistance.
            // However, the anchor point logic above modifies pointX/Y, so we need to be careful.
            // Let's stick to the stateless approach above, it should work fine.

            // Important: Update these for next frame if we want continuous "delta" feeling
            // initialPinchDistance = currentDistance;
            // lastScale = scale;
            // Wait, if we update initialPinchDistance, zoomFactor becomes ~1.0 each time.
            // Let's try to just update the scale.
        }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        isPanning = false;
        initialPinchDistance = null;
        if (e.touches.length === 0) {
            // All fingers lifted
        }
    });

    function getPinchDistance(e) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        return Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
