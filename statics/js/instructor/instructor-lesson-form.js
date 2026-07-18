/* ============================================
   FILE: static/js/instructor/instructor-lesson-form.js
   DESCRIPTION: فرم افزودن/ویرایش درس
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
        window.location.href = '/instructor/lessons/';
    });
    
    // ===== VIDEO UPLOAD =====
    const videoInput = document.getElementById('videoInput');
    const videoBox = document.getElementById('videoUploadBox');
    const videoPreview = document.getElementById('videoPreview');
    const videoEl = videoPreview?.querySelector('video');
    
    if (videoInput && videoBox) {
        videoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            if (file.size > 500 * 1024 * 1024) {
                showToast('حجم فایل نباید بیشتر از ۵۰۰ مگابایت باشد!', 'error');
                this.value = '';
                return;
            }
            
            if (!file.type.startsWith('video/')) {
                showToast('لطفاً یک فایل ویدیویی انتخاب کنید!', 'error');
                this.value = '';
                return;
            }
            
            if (videoEl && videoPreview) {
                const url = URL.createObjectURL(file);
                videoEl.src = url;
                videoPreview.classList.add('active');
                videoEl.onloadedmetadata = () => URL.revokeObjectURL(url);
            }
            
            showToast(`ویدیو "${file.name}" انتخاب شد! 🎬`);
        });
        
        videoBox.addEventListener('click', function(e) {
            if (e.target.closest('.upload-preview')) return;
            videoInput.click();
        });
    }
    
    // ===== THUMBNAIL UPLOAD =====
    const thumbInput = document.getElementById('thumbInput');
    const thumbBox = document.getElementById('thumbUploadBox');
    const thumbPreview = document.getElementById('thumbPreview');
    const thumbImg = thumbPreview?.querySelector('img');
    
    if (thumbInput && thumbBox) {
        thumbInput.addEventListener('change', function() {
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
            
            if (thumbImg && thumbPreview) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    thumbImg.src = e.target.result;
                    thumbPreview.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
            
            showToast(`تصویر "${file.name}" انتخاب شد! 🖼️`);
        });
        
        thumbBox.addEventListener('click', function(e) {
            if (e.target.closest('.upload-preview')) return;
            thumbInput.click();
        });
    }
    
    // ===== ATTACHMENTS =====
    const attachmentList = document.getElementById('attachmentList');
    const addAttachmentBtn = document.getElementById('addAttachmentBtn');
    const attachmentInput = document.getElementById('attachmentInput');
    const MAX_FILES = 5;
    
    if (addAttachmentBtn && attachmentInput) {
        addAttachmentBtn.addEventListener('click', function() {
            const currentFiles = attachmentList.querySelectorAll('.attachment-item').length;
            if (currentFiles >= MAX_FILES) {
                showToast(`حداکثر ${MAX_FILES} فایل مجاز است!`, 'error');
                return;
            }
            attachmentInput.click();
        });
        
        attachmentInput.addEventListener('change', function() {
            const files = this.files;
            const currentFiles = attachmentList.querySelectorAll('.attachment-item').length;
            const remaining = MAX_FILES - currentFiles;
            
            if (files.length > remaining) {
                showToast(`فقط ${remaining} فایل دیگر مجاز است!`, 'error');
                this.value = '';
                return;
            }
            
            for (let file of files) {
                const size = (file.size / 1024 / 1024).toFixed(1);
                const icon = getFileIcon(file.name);
                const item = document.createElement('div');
                item.className = 'attachment-item';
                item.innerHTML = `
                    <i class="fas ${icon}"></i>
                    <span>${file.name}</span>
                    <span class="file-size">${size}MB</span>
                    <button class="remove-file" data-action="remove">×</button>
                `;
                attachmentList.appendChild(item);
                
                item.querySelector('.remove-file').addEventListener('click', function() {
                    item.remove();
                    showToast('فایل پیوست حذف شد! 🗑️');
                });
            }
            
            showToast(`${files.length} فایل اضافه شد! 📎`);
            this.value = '';
        });
    }
    
    function getFileIcon(name) {
        if (name.endsWith('.pdf')) return 'fa-file-pdf';
        if (name.endsWith('.zip') || name.endsWith('.rar')) return 'fa-file-archive';
        if (name.endsWith('.doc') || name.endsWith('.docx')) return 'fa-file-word';
        if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'fa-file-excel';
        if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'fa-file-powerpoint';
        return 'fa-file';
    }
    
    // ===== PREVIEW =====
    document.getElementById('previewBtn')?.addEventListener('click', function() {
        const title = document.getElementById('lessonTitle').value || 'بدون عنوان';
        const desc = document.getElementById('lessonDesc').value || 'بدون توضیحات';
        const duration = document.getElementById('lessonDuration').value || '۰۰:۰۰';
        const course = document.getElementById('lessonCourse');
        const section = document.getElementById('lessonSection');
        const status = document.querySelector('input[name="lessonStatus"]:checked');
        const videoFile = document.getElementById('videoInput').files[0];
        
        let text = `📹 پیش‌نمایش درس\n\n`;
        text += `عنوان: ${title}\n`;
        text += `توضیحات: ${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}\n`;
        text += `دوره: ${course.options[course.selectedIndex]?.text || 'نامشخص'}\n`;
        text += `فصل: ${section.options[section.selectedIndex]?.text || 'نامشخص'}\n`;
        text += `مدت: ${duration}\n`;
        text += `وضعیت: ${status ? status.nextElementSibling.textContent.trim() : 'نامشخص'}\n`;
        text += `ویدیو: ${videoFile ? videoFile.name : 'آپلود نشده'}\n`;
        
        const attachments = attachmentList.querySelectorAll('.attachment-item').length;
        text += `فایل‌های پیوست: ${attachments} عدد`;
        
        alert(text);
    });
    
    // ===== SUBMIT =====
    document.getElementById('lessonForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('lessonTitle');
        const course = document.getElementById('lessonCourse');
        const section = document.getElementById('lessonSection');
        const duration = document.getElementById('lessonDuration');
        const video = document.getElementById('videoInput');
        
        let errors = [];
        if (!title.value.trim()) errors.push('عنوان درس');
        if (!course.value) errors.push('دوره');
        if (!section.value) errors.push('فصل');
        if (!duration.value.trim()) errors.push('مدت زمان');
        if (!video.files[0]) errors.push('فایل ویدیو');
        
        if (errors.length > 0) {
            showToast(`لطفاً فیلدهای زیر را پر کنید:\n${errors.join('، ')}`, 'error');
            return;
        }
        
        showToast('درس با موفقیت ذخیره شد! ✅');
        setTimeout(() => {
            window.location.href = '/instructor/lessons/';
        }, 1500);
    });
    
    // ===== RESET =====
    document.querySelector('button[type="reset"]')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('آیا از لغو عملیات مطمئن هستید؟')) {
            document.getElementById('lessonForm')?.reset();
            if (videoPreview) videoPreview.classList.remove('active');
            if (thumbPreview) thumbPreview.classList.remove('active');
            if (attachmentList) attachmentList.innerHTML = '';
            showToast('فرم بازنشانی شد! ↩️');
        }
    });
    
    // ===== CTRL + S =====
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            document.getElementById('lessonForm')?.dispatchEvent(new Event('submit'));
        }
    });
    
});