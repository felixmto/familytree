import { familyData } from './data.js';
import { computeLayout } from './layout.js';
import { renderTree } from './render.js';

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

    // Double click to reset (optional nice to have)
    container.addEventListener('dblclick', () => {
        scale = 1;
        // Re-center logic would go here
        updateTransform();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
