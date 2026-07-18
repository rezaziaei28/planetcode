/* ============================================
   FILE: static/js/instructor/instructor-sections.js
   DESCRIPTION: مدیریت کامل با Event Delegation
   ============================================ */

   document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ Instructor Sections Panel initializing...');
    
    // ============================================
    // ===== TOAST NOTIFICATION =====
    // ============================================
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        const colors = {
            success: '#ff6b35',
            error: '#ff4444',
            warning: '#ffe66d',
            info: '#4ecdc4'
        };
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1a1a1a;
            color: #ffffff;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            border: 2px solid ${colors[type] || colors.success};
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            font-size: 0.95rem;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            direction: rtl;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ============================================
    // ===== BACK TO COURSES =====
    // ============================================
    const backBtn = document.getElementById('backToCoursesBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '/instructor/courses/';
        });
    }
    
    // ============================================
    // ===== EVENT DELEGATION (کلید اصلی) =====
    // ============================================
    
    // ===== 1. EDIT SECTION =====
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.edit-section-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const section = btn.closest('.section-card');
        if (!section) return;
        
        const titleEl = section.querySelector('.section-info h3');
        if (!titleEl) return;
        
        const currentText = titleEl.textContent;
        const newTitle = prompt('ویرایش نام فصل:', currentText);
        
        if (newTitle && newTitle.trim() !== '') {
            const match = currentText.match(/بخش \d+:/);
            if (match) {
                titleEl.innerHTML = `<i class="fas fa-folder-open" style="color: #ff6b35;"></i> ${match[0]} ${newTitle.trim()}`;
            } else {
                titleEl.innerHTML = `<i class="fas fa-folder-open" style="color: #ff6b35;"></i> ${newTitle.trim()}`;
            }
            showToast('نام فصل با موفقیت تغییر کرد! ✏️');
        }
    });
    
    // ===== 2. DELETE SECTION =====
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.delete-section-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const section = btn.closest('.section-card');
        if (!section) return;
        
        const titleEl = section.querySelector('.section-info h3');
        const title = titleEl ? titleEl.textContent.trim() : 'این فصل';
        
        if (confirm(`آیا از حذف "${title}" مطمئن هستید؟`)) {
            section.style.opacity = '0.3';
            section.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                section.remove();
                renumberSections();
                showToast('فصل با موفقیت حذف شد! 🗑️');
            }, 300);
        }
    });
    
    // ===== 3. ADD LESSON =====
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.add-lesson-btn, .add-lesson-empty-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const section = btn.closest('.section-card');
        if (!section) return;
        
        addLessonToSection(section);
    });
    
    // ===== 4. EDIT LESSON =====
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.edit-lesson-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const lesson = btn.closest('.lesson-item');
        if (!lesson) return;
        
        // اول اسم درس رو ویرایش کن
        const titleEl = lesson.querySelector('.lesson-title');
        if (titleEl) {
            const currentTitle = titleEl.textContent.trim();
            const newTitle = prompt('ویرایش نام درس:', currentTitle);
            if (newTitle && newTitle.trim() !== '') {
                titleEl.textContent = newTitle.trim();
                showToast('نام درس با موفقیت تغییر کرد! ✏️');
                
                // بعد توضیحات رو بپرس
                const descEl = lesson.querySelector('.lesson-description p');
                if (descEl) {
                    const currentDesc = descEl.textContent.trim();
                    const newDesc = prompt('ویرایش توضیحات درس:', currentDesc);
                    if (newDesc && newDesc.trim() !== '') {
                        descEl.textContent = newDesc.trim();
                        showToast('توضیحات درس با موفقیت تغییر کرد! ✏️');
                    }
                }
            }
        }
    });
    
    // ===== 5. DELETE LESSON =====
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.delete-lesson-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const lesson = btn.closest('.lesson-item');
        if (!lesson) return;
        
        const titleEl = lesson.querySelector('.lesson-title');
        const title = titleEl ? titleEl.textContent.trim() : 'این درس';
        
        if (confirm(`آیا از حذف "${title}" مطمئن هستید؟`)) {
            lesson.style.opacity = '0.3';
            lesson.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                lesson.remove();
                const section = lesson.closest('.section-card');
                if (section) {
                    updateSectionInfo(section);
                    const lessonsList = section.querySelector('.lessons-list');
                    if (lessonsList && lessonsList.querySelectorAll('.lesson-item').length === 0) {
                        lessonsList.innerHTML = `
                            <div class="empty-lessons">
                                <i class="fas fa-video" style="font-size: 2rem; color: #6b6b6b;"></i>
                                <p>هنوز درسی به این فصل اضافه نشده است</p>
                                <button class="btn-sm add-lesson-empty-btn">
                                    <i class="fas fa-plus"></i> افزودن اولین درس
                                </button>
                            </div>
                        `;
                        section.classList.add('empty-section');
                    }
                }
                showToast('درس با موفقیت حذف شد! 🗑️');
            }, 300);
        }
    });
    
    // ===== 6. FILE UPLOAD =====
    document.addEventListener('change', function(e) {
        const input = e.target.closest('.file-input');
        if (!input) return;
        
        const file = input.files[0];
        if (!file) return;
        
        // Show file name
        const uploadArea = input.closest('.file-upload-wrapper').querySelector('.file-upload-area');
        const fileNameSpan = uploadArea?.querySelector('.file-name');
        if (fileNameSpan) {
            fileNameSpan.textContent = file.name;
        }
        
        // Show video preview
        const previewId = input.id.replace('video', 'videoPreview');
        const previewContainer = document.getElementById(previewId);
        if (previewContainer && file.type.startsWith('video/')) {
            const video = previewContainer.querySelector('video');
            if (video) {
                const url = URL.createObjectURL(file);
                video.src = url;
                previewContainer.classList.add('active');
                video.onloadedmetadata = () => {
                    URL.revokeObjectURL(url);
                };
            }
        }
        
        showToast(`فایل "${file.name}" با موفقیت آپلود شد! 📤`);
    });
    
    // ===== 7. ADD ATTACHMENT =====
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.add-attachment-btn');
        if (!btn) return;
        e.stopPropagation();
        
        const attachmentList = btn.closest('.lesson-attachments').querySelector('.attachment-list');
        if (!attachmentList) return;
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.zip,.rar,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        fileInput.addEventListener('change', function() {
            const files = this.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const item = document.createElement('div');
                item.className = 'attachment-item';
                
                let icon = 'fa-file';
                if (file.name.endsWith('.pdf')) icon = 'fa-file-pdf';
                else if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) icon = 'fa-file-archive';
                else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) icon = 'fa-file-word';
                else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) icon = 'fa-file-excel';
                else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) icon = 'fa-file-powerpoint';
                else if (file.name.endsWith('.txt')) icon = 'fa-file-alt';
                
                item.innerHTML = `
                    <i class="fas ${icon}" style="color: #ff6b35;"></i>
                    <span>${file.name}</span>
                    <button class="remove-attachment" title="حذف">×</button>
                `;
                attachmentList.appendChild(item);
            }
            showToast(`${files.length} فایل با موفقیت اضافه شد! 📎`);
            this.remove();
        });
        
        fileInput.click();
    });
    
    // ===== 8. REMOVE ATTACHMENT =====
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.remove-attachment');
        if (!btn) return;
        e.stopPropagation();
        
        const item = btn.closest('.attachment-item');
        if (item) {
            item.remove();
            showToast('فایل پیوست حذف شد! 🗑️');
        }
    });
    
    // ============================================
    // ===== ADD NEW SECTION =====
    // ============================================
    function addNewSection() {
        const container = document.getElementById('sectionsContainer');
        if (!container) {
            showToast('خطا: ظرف فصل‌ها پیدا نشد!', 'error');
            return;
        }
        
        const sectionCount = container.querySelectorAll('.section-card').length + 1;
        
        const newSection = document.createElement('div');
        newSection.className = 'section-card';
        newSection.dataset.sectionId = sectionCount;
        newSection.innerHTML = `
            <div class="section-header">
                <div class="section-info">
                    <h3><i class="fas fa-folder-open" style="color: #ff6b35;"></i> بخش ${sectionCount}: فصل جدید</h3>
                    <span class="lesson-count">۰ درس</span>
                    <span class="section-duration">۰۰:۰۰</span>
                </div>
                <div class="section-actions">
                    <button class="action-btn edit-section-btn" title="ویرایش فصل"><i class="fas fa-edit"></i></button>
                    <button class="action-btn add-lesson-btn" title="افزودن درس"><i class="fas fa-plus"></i></button>
                    <button class="action-btn delete-section-btn danger" title="حذف فصل"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="lessons-list">
                <div class="empty-lessons">
                    <i class="fas fa-video" style="font-size: 2rem; color: #6b6b6b;"></i>
                    <p>هنوز درسی به این فصل اضافه نشده است</p>
                    <button class="btn-sm add-lesson-empty-btn">
                        <i class="fas fa-plus"></i> افزودن اولین درس
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(newSection);
        renumberSections();
        newSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('فصل جدید با موفقیت اضافه شد! ✅');
    }
    
    // ============================================
    // ===== ADD LESSON TO SECTION =====
    // ============================================
    function addLessonToSection(section) {
        if (!section) {
            showToast('خطا: فصل پیدا نشد!', 'error');
            return;
        }
        
        const titleEl = section.querySelector('.section-info h3');
        const sectionTitle = titleEl ? titleEl.textContent.trim() : 'فصل';
        const lessonsList = section.querySelector('.lessons-list');
        
        if (!lessonsList) {
            showToast('خطا: لیست درس‌ها پیدا نشد!', 'error');
            return;
        }
        
        // Remove empty state
        const emptyState = lessonsList.querySelector('.empty-lessons');
        if (emptyState) emptyState.remove();
        
        const lessonCount = lessonsList.querySelectorAll('.lesson-item').length + 1;
        const lessonId = Date.now();
        
        const newLesson = document.createElement('div');
        newLesson.className = 'lesson-item';
        newLesson.dataset.lessonId = lessonId;
        newLesson.innerHTML = `
            <div class="lesson-main">
                <div class="lesson-header-info">
                    <div class="lesson-title-wrapper">
                        <i class="fas fa-play-circle" style="color: #ff6b35;"></i>
                        <span class="lesson-title">درس جدید ${lessonCount}</span>
                        <span class="lesson-duration">۰۰:۰۰</span>
                        <span class="status-badge free">رایگان</span>
                    </div>
                    <div class="lesson-actions">
                        <button class="action-btn edit-lesson-btn" title="ویرایش درس"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-lesson-btn danger" title="حذف درس"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                
                <div class="lesson-details">
                    <div class="lesson-description">
                        <label>توضیحات درس:</label>
                        <p>توضیحات این درس را وارد کنید...</p>
                    </div>
                    
                    <div class="lesson-file-upload">
                        <label>فایل ویدیو:</label>
                        <div class="file-upload-wrapper">
                            <input type="file" accept="video/*" class="file-input" id="video${lessonId}">
                            <div class="file-upload-area">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>آپلود ویدیو</span>
                                <span class="file-name">هیچ فایلی انتخاب نشده</span>
                            </div>
                        </div>
                        <div class="video-preview" id="videoPreview${lessonId}">
                            <video controls width="100%" style="max-height: 200px; border-radius: 8px;">
                                <source src="#" type="video/mp4">
                                مرورگر شما از نمایش ویدیو پشتیبانی نمی‌کند.
                            </video>
                        </div>
                    </div>
                    
                    <div class="lesson-attachments">
                        <label>فایل‌های پیوست:</label>
                        <div class="attachment-list"></div>
                        <button class="add-attachment-btn">
                            <i class="fas fa-plus"></i> افزودن فایل پیوست
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        lessonsList.appendChild(newLesson);
        section.classList.remove('empty-section');
        
        // Update section info
        updateSectionInfo(section);
        showToast(`درس جدید به "${sectionTitle}" اضافه شد! 📚`);
    }
    
    // ============================================
    // ===== UPDATE SECTION INFO =====
    // ============================================
    function updateSectionInfo(section) {
        if (!section) return;
        const lessonsList = section.querySelector('.lessons-list');
        if (!lessonsList) return;
        
        const lessons = lessonsList.querySelectorAll('.lesson-item');
        const count = lessons.length;
        
        const countSpan = section.querySelector('.lesson-count');
        if (countSpan) countSpan.textContent = count + ' درس';
        
        let totalMinutes = 0;
        lessons.forEach(lesson => {
            const durEl = lesson.querySelector('.lesson-duration');
            if (durEl) {
                const parts = durEl.textContent.split(':');
                if (parts.length === 2) {
                    totalMinutes += parseInt(parts[0]) || 0;
                    totalMinutes += (parseInt(parts[1]) || 0) / 60;
                }
            }
        });
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const durSpan = section.querySelector('.section-duration');
        if (durSpan) {
            durSpan.textContent = hours > 0 ? 
                `${hours}:${String(minutes).padStart(2, '0')}` : 
                `${String(minutes).padStart(2, '0')}:00`;
        }
    }
    
    // ============================================
    // ===== RENUMBER SECTIONS =====
    // ============================================
    function renumberSections() {
        document.querySelectorAll('.section-card').forEach((section, index) => {
            const title = section.querySelector('.section-info h3');
            if (title) {
                let text = title.textContent;
                let parts = text.split(':');
                let titlePart = parts.slice(1).join(':').trim();
                titlePart = titlePart.replace(/^بخش \d+:\s*/, '');
                title.innerHTML = `<i class="fas fa-folder-open" style="color: #ff6b35;"></i> بخش ${index + 1}: ${titlePart}`;
            }
        });
    }
    
    // ============================================
    // ===== BUTTONS =====
    // ============================================
    document.getElementById('addSectionBtn')?.addEventListener('click', addNewSection);
    document.getElementById('addSectionBottomBtn')?.addEventListener('click', addNewSection);
    
    // ============================================
    // ===== COURSE SELECTOR =====
    // ============================================
    document.getElementById('courseSelect')?.addEventListener('change', function() {
        showToast(`دوره "${this.options[this.selectedIndex].text}" انتخاب شد`, 'info');
    });
    
    // ============================================
    // ===== KEYBOARD SHORTCUTS =====
    // ============================================
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'N' || e.key === 'n')) {
            e.preventDefault();
            addNewSection();
        }
    });
    
    // ============================================
    // ===== INITIALIZE SECTION INFO =====
    // ============================================
    document.querySelectorAll('.section-card').forEach(section => {
        updateSectionInfo(section);
    });
    
    console.log('✅ Instructor Sections Panel initialized successfully!');
    console.log(`📖 ${document.querySelectorAll('.section-card').length} sections found`);
});