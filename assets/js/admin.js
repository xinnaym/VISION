// admin.js

document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const productModal = document.getElementById('productModal');
    const deleteModal = document.getElementById('deleteModal');
    const addProductBtn = document.getElementById('addProductBtn');
    const closeProductModal = document.getElementById('closeModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');

    // File upload preview
    const productPhotoInput = document.getElementById('productPhoto');
    const photoPreview = document.getElementById('photoPreview');

    // Open Add Product Modal
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            modalTitle.textContent = 'Добавить товар';
            productForm.reset();
            photoPreview.classList.remove('active');
            productModal.classList.add('active');
        });
    }

    // Close Product Modal
    if (closeProductModal) {
        closeProductModal.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close Delete Modal
    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', closeDeleteModalFunc);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModalFunc);
    }

    // Confirm Delete (placeholder)
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            // TODO: Implement delete functionality
            console.log('Delete product');
            closeDeleteModalFunc();
        });
    }

    // Form Submit (placeholder)
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // TODO: Implement add/edit functionality
            console.log('Save product');
            closeModal();
        });
    }

    // File upload preview
    if (productPhotoInput) {
        productPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    photoPreview.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Edit buttons (placeholder)
    document.querySelectorAll('.admin-icon-btn:not(.delete)').forEach(btn => {
        btn.addEventListener('click', function() {
            // TODO: Implement edit functionality
            modalTitle.textContent = 'Редактировать товар';
            // TODO: Load product data into form
            productModal.classList.add('active');
        });
    });

    // Delete buttons (placeholder)
    document.querySelectorAll('.admin-icon-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            // TODO: Get product ID and show in modal
            deleteModal.classList.add('active');
        });
    });

    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target === productModal) {
            closeModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModalFunc();
        }
    });

    // Functions
    function closeModal() {
        productModal.classList.remove('active');
    }

    function closeDeleteModalFunc() {
        deleteModal.classList.remove('active');
    }
});
