/* ============================================
   FILE: static/js/instructor/instructor-course-form.js
   DESCRIPTION: فرم دوره - طراحی جدید
   ============================================ */

   document.addEventListener('DOMContentLoaded', function() {
    
    // ===== TOAST =====
    function showToast(msg, type = 'success') {
        const old = document.querySelector('.toast-notification');
        if (old) old.remove();
        
        const colors = { success: '#ff6b35', error: '#ff4444', warning: '#ffe66d', info: '#4ecdc4' };
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px;
            background: #1a1a1a; color: #fff;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            border: 2px solid ${colors[type] || colors.success};
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            font-size: 0.95rem; z-index: 9999;
            max-width: 400px; direction: rtl;
            font-weight: 500;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ===== BACK =====
    document.getElementById('backBtn')?.addEventListener('click', function() {
        window.location.href = '/instructor/courses/';
    });
    
    // ===== IMAGE UPLOAD =====
    const imageInput = document.getElementById('imageInput');
    const uploadBox = document.getElementById('uploadBox');
    const preview = document.getElementById('imagePreview');
    const previewImg = preview?.querySelector('img');
    
    if (imageInput && uploadBox) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                showToast('حجم فایل نباید بیشتر از ۲ مگابایت باشد!', 'error');
                this.value = '';
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                showToast('لطفاً یک فایل تصویری انتخاب کنید!', 'error');
                this.value = '';
                return;
            }
            
            if (previewImg && preview) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    preview.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
            
            showToast(`تصویر "${file.name}" انتخاب شد! 🖼️`);
        });
        
        uploadBox.addEventListener('click', function(e) {
            if (e.target.closest('.upload-preview')) return;
            imageInput.click();
        });
    }
    
    // ===== PREVIEW =====
    document.getElementById('previewBtn')?.addEventListener('click', function() {
        const title = document.getElementById('courseTitle').value || 'بدون عنوان';
        const desc = document.getElementById('courseDesc').value || 'بدون توضیحات';
        const price = document.getElementById('coursePrice').value || '۰';
        const discount = document.getElementById('courseDiscount').value || '۰';
        const cat = document.getElementById('courseCategory');
        const lvl = document.getElementById('courseLevel');
        
        let text = `📖 پیش‌نمایش دوره\n\n`;
        text += `عنوان: ${title}\n`;
        text += `توضیحات: ${desc.substring(0, 100)}${desc.length > 100 ? '...' : ''}\n`;
        text += `دسته: ${cat.options[cat.selectedIndex]?.text || 'نامشخص'}\n`;
        text += `سطح: ${lvl.options[lvl.selectedIndex]?.text || 'نامشخص'}\n`;
        text += `قیمت: ${Number(price).toLocaleString()} تومان\n`;
        text += `تخفیف: ${discount}%\n`;
        text += `قیمت نهایی: ${(Number(price) * (1 - Number(discount)/100)).toLocaleString()} تومان`;
        
        alert(text);
    });
    
    // ===== SUBMIT =====
    document.getElementById('courseForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('courseTitle');
        const desc = document.getElementById('courseDesc');
        const cat = document.getElementById('courseCategory');
        const lvl = document.getElementById('courseLevel');
        const price = document.getElementById('coursePrice');
        const img = document.getElementById('imageInput');
        
        let errors = [];
        if (!title.value.trim()) errors.push('عنوان');
        if (!desc.value.trim()) errors.push('توضیحات');
        if (!cat.value) errors.push('دسته‌بندی');
        if (!lvl.value) errors.push('سطح');
        if (!price.value) errors.push('قیمت');
        if (!img.files[0]) errors.push('تصویر');
        
        if (errors.length > 0) {
            showToast(`لطفاً فیلدهای زیر را پر کنید:\n${errors.join('، ')}`, 'error');
            return;
        }
        
        showToast('دوره با موفقیت ذخیره شد! ✅');
        setTimeout(() => {
            window.location.href = '/instructor/courses/';
        }, 1500);
    });
    
    // ===== RESET =====
    document.querySelector('button[type="reset"]')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('آیا از لغو عملیات مطمئن هستید؟')) {
            document.getElementById('courseForm')?.reset();
            if (preview) {
                preview.classList.remove('active');
                if (previewImg) previewImg.src = '#';
            }
            showToast('فرم بازنشانی شد! ↩️');
        }
    });
    
    // ===== CTRL + S =====
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            document.getElementById('courseForm')?.dispatchEvent(new Event('submit'));
        }
    });
    
});