/* ============================================
   FILE: static/js/instructor/instructor-sections.js
   DESCRIPTION: مدیریت فصل‌ها با Event Delegation
   ============================================ */

   document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ Instructor Sections Panel initialized');
    
    // ============================================
    // ===== TOAST =====
    // ============================================
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
    
    // ============================================
    // ===== BACK TO COURSES =====
    // ============================================
    document.getElementById('backToCoursesBtn')?.addEventListener('click', function() {
        window.location.href = '/instructor/courses/';
    });
    
    // ============================================
    // ===== ADD SECTION =====
    // ============================================
    function addNewSection() {
        const container = document.getElementById('sectionsContainer');
        if (!container) { showToast('خطا!', 'error'); return; }
        
        const count = container.querySelectorAll('.section-card').length + 1;
        const html = `
            <div class="section-card" data-section-id="${count}">
                <div class="section-header">
                    <div class="section-info">
                        <h3><i class="fas fa-folder-open" style="color: #ff6b35;"></i> بخش ${count}: فصل جدید</h3>
                        <span class="lesson-count">۰ درس</span>
                        <span class="section-duration">۰۰:۰۰</span>
                    </div>
                    <div class="section-actions">
                        <button class="action-btn edit-section-btn" data-action="edit-section" title="ویرایش فصل"><i class="fas fa-edit"></i></button>
                        <button class="action-btn add-lesson-btn" data-action="add-lesson" title="افزودن درس"><i class="fas fa-plus"></i></button>
                        <button class="action-btn delete-section-btn danger" data-action="delete-section" title="حذف فصل"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="lessons-list">
                    <div class="empty-lessons">
                        <i class="fas fa-video" style="font-size: 2rem; color: #6b6b6b;"></i>
                        <p>هنوز درسی به این فصل اضافه نشده است</p>
                        <button class="btn-sm add-lesson-empty-btn" data-action="add-lesson"><i class="fas fa-plus"></i> افزودن اولین درس</button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
        renumberSections();
        showToast('فصل جدید اضافه شد! ✅');
    }
    
    document.getElementById('addSectionBtn')?.addEventListener('click', addNewSection);
    document.getElementById('addSectionBottomBtn')?.addEventListener('click', addNewSection);
    
    // ============================================
    // ===== ADD LESSON =====
    // ============================================
    function addLessonToSection(section) {
        const lessonsList = section.querySelector('.lessons-list');
        if (!lessonsList) return;
        
        const empty = lessonsList.querySelector('.empty-lessons');
        if (empty) empty.remove();
        
        const count = lessonsList.querySelectorAll('.lesson-item').length + 1;
        const id = Date.now();
        
        const html = `
            <div class="lesson-item" data-lesson-id="${id}">
                <div class="lesson-header">
                    <div class="lesson-title-wrapper">
                        <i class="fas fa-play-circle" style="color: #ff6b35;"></i>
                        <span class="lesson-title">درس جدید ${count}</span>
                        <span class="lesson-duration">۰۰:۰۰</span>
                        <span class="status-badge free">رایگان</span>
                    </div>
                    <div class="lesson-actions">
                        <button class="action-btn edit-lesson-btn" data-action="edit-lesson" title="ویرایش درس"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-lesson-btn danger" data-action="delete-lesson" title="حذف درس"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="lesson-details">
                    <div class="lesson-description-box">
                        <div class="desc-title">
                            <label>عنوان توضیحات:</label>
                            <span class="desc-title-text">عنوان توضیحات</span>
                            <button class="edit-desc-title-btn" data-action="edit-desc-title">✏️</button>
                        </div>
                        <div class="desc-content">
                            <label>توضیحات:</label>
                            <p class="desc-content-text">توضیحات این درس را وارد کنید...</p>
                            <button class="edit-desc-content-btn" data-action="edit-desc-content">✏️ ویرایش</button>
                        </div>
                    </div>
                    <div class="lesson-file-upload">
                        <div class="file-upload-header">
                            <label>فایل ویدیو:</label>
                            <button class="remove-video-btn" data-action="remove-video" title="حذف ویدیو">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="file-upload-wrapper">
                            <input type="file" accept="video/*" class="file-input" data-lesson-id="${id}">
                            <div class="file-upload-area">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>آپلود ویدیو</span>
                                <span class="file-name">هیچ فایلی انتخاب نشده</span>
                            </div>
                        </div>
                        <div class="video-preview" data-preview="${id}">
                            <video controls>
                                <source src="#" type="video/mp4">
                            </video>
                        </div>
                    </div>
                    <div class="lesson-attachments">
                        <label>فایل‌های پیوست:</label>
                        <div class="attachment-list"></div>
                        <button class="add-attachment-btn" data-action="add-attachment"><i class="fas fa-plus"></i> افزودن فایل پیوست</button>
                    </div>
                </div>
            </div>
        `;
        lessonsList.insertAdjacentHTML('beforeend', html);
        section.classList.remove('empty-section');
        updateSectionInfo(section);
        showToast('درس جدید اضافه شد! 📚');
    }
    
    // ============================================
    // ===== UPDATE SECTION INFO =====
    // ============================================
    function updateSectionInfo(section) {
        const list = section.querySelector('.lessons-list');
        if (!list) return;
        const items = list.querySelectorAll('.lesson-item');
        const count = items.length;
        
        const countSpan = section.querySelector('.lesson-count');
        if (countSpan) countSpan.textContent = count + ' درس';
        
        let total = 0;
        items.forEach(item => {
            const dur = item.querySelector('.lesson-duration');
            if (dur) {
                const parts = dur.textContent.split(':');
                if (parts.length === 2) {
                    total += parseInt(parts[0]) || 0;
                    total += (parseInt(parts[1]) || 0) / 60;
                }
            }
        });
        const h = Math.floor(total / 60);
        const m = Math.floor(total % 60);
        const durSpan = section.querySelector('.section-duration');
        if (durSpan) {
            durSpan.textContent = h > 0 ? `${h}:${String(m).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:00`;
        }
    }
    
    // ============================================
    // ===== RENUMBER SECTIONS =====
    // ============================================
    function renumberSections() {
        document.querySelectorAll('.section-card').forEach((sec, i) => {
            const title = sec.querySelector('.section-info h3');
            if (title) {
                let text = title.textContent;
                let parts = text.split(':');
                let titlePart = parts.slice(1).join(':').trim();
                titlePart = titlePart.replace(/^بخش \d+:\s*/, '');
                title.innerHTML = `<i class="fas fa-folder-open" style="color: #ff6b35;"></i> بخش ${i + 1}: ${titlePart}`;
            }
        });
    }
    
    // ============================================
    // ===== EVENT DELEGATION =====
    // ============================================
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        
        // ===== EDIT SECTION =====
        if (action === 'edit-section') {
            const section = target.closest('.section-card');
            if (!section) return;
            const titleEl = section.querySelector('.section-info h3');
            if (!titleEl) return;
            const current = titleEl.textContent;
            const newTitle = prompt('ویرایش نام فصل:', current);
            if (newTitle && newTitle.trim() !== '') {
                const match = current.match(/بخش \d+:/);
                if (match) {
                    titleEl.innerHTML = `<i class="fas fa-folder-open" style="color: #ff6b35;"></i> ${match[0]} ${newTitle.trim()}`;
                } else {
                    titleEl.innerHTML = `<i class="fas fa-folder-open" style="color: #ff6b35;"></i> ${newTitle.trim()}`;
                }
                showToast('نام فصل تغییر کرد! ✏️');
            }
        }
        
        // ===== DELETE SECTION =====
        if (action === 'delete-section') {
            const section = target.closest('.section-card');
            if (!section) return;
            const titleEl = section.querySelector('.section-info h3');
            const title = titleEl ? titleEl.textContent.trim() : 'این فصل';
            if (confirm(`آیا از حذف "${title}" مطمئن هستید؟`)) {
                section.style.opacity = '0.3';
                section.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    section.remove();
                    renumberSections();
                    showToast('فصل حذف شد! 🗑️');
                }, 300);
            }
        }
        
        // ===== ADD LESSON =====
        if (action === 'add-lesson') {
            const section = target.closest('.section-card');
            if (section) addLessonToSection(section);
        }
        
        // ===== EDIT LESSON =====
        if (action === 'edit-lesson') {
            const lesson = target.closest('.lesson-item');
            if (!lesson) return;
            
            const titleEl = lesson.querySelector('.lesson-title');
            const descTitleEl = lesson.querySelector('.desc-title-text');
            const descEl = lesson.querySelector('.desc-content-text');
            
            const currentTitle = titleEl ? titleEl.textContent.trim() : '';
            const currentDescTitle = descTitleEl ? descTitleEl.textContent.trim() : '';
            const currentDesc = descEl ? descEl.textContent.trim() : '';
            
            const newTitle = prompt('ویرایش نام درس:', currentTitle);
            if (newTitle && newTitle.trim() !== '') {
                if (titleEl) titleEl.textContent = newTitle.trim();
                
                const newDescTitle = prompt('ویرایش عنوان توضیحات:', currentDescTitle);
                if (newDescTitle && newDescTitle.trim() !== '') {
                    if (descTitleEl) descTitleEl.textContent = newDescTitle.trim();
                }
                
                const newDesc = prompt('ویرایش توضیحات درس:', currentDesc);
                if (newDesc && newDesc.trim() !== '') {
                    if (descEl) descEl.textContent = newDesc.trim();
                }
                
                showToast('درس با موفقیت ویرایش شد! ✏️');
            }
        }
        
        // ===== DELETE LESSON =====
        if (action === 'delete-lesson') {
            const lesson = target.closest('.lesson-item');
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
                        const list = section.querySelector('.lessons-list');
                        if (list && list.querySelectorAll('.lesson-item').length === 0) {
                            list.innerHTML = `
                                <div class="empty-lessons">
                                    <i class="fas fa-video" style="font-size: 2rem; color: #6b6b6b;"></i>
                                    <p>هنوز درسی به این فصل اضافه نشده است</p>
                                    <button class="btn-sm add-lesson-empty-btn" data-action="add-lesson"><i class="fas fa-plus"></i> افزودن اولین درس</button>
                                </div>
                            `;
                            section.classList.add('empty-section');
                        }
                    }
                    showToast('درس حذف شد! 🗑️');
                }, 300);
            }
        }
        
        // ===== REMOVE VIDEO =====
        if (action === 'remove-video') {
            const lesson = target.closest('.lesson-item');
            if (!lesson) return;
            
            const videoPreview = lesson.querySelector('.video-preview');
            const fileInput = lesson.querySelector('.file-input');
            const fileNameSpan = lesson.querySelector('.file-name');
            const removeBtn = lesson.querySelector('.remove-video-btn');
            
            if (confirm('آیا از حذف فایل ویدیو مطمئن هستید؟')) {
                if (videoPreview) {
                    videoPreview.classList.remove('active');
                    const video = videoPreview.querySelector('video');
                    if (video) video.src = '#';
                }
                
                if (fileInput) {
                    fileInput.value = '';
                }
                
                if (fileNameSpan) {
                    fileNameSpan.textContent = 'هیچ فایلی انتخاب نشده';
                }
                
                if (removeBtn) {
                    removeBtn.classList.remove('visible');
                    removeBtn.style.display = 'none';
                }
                
                showToast('فایل ویدیو حذف شد! 🗑️');
            }
        }
        
        // ===== EDIT DESC TITLE =====
        if (action === 'edit-desc-title') {
            const box = target.closest('.lesson-description-box');
            if (!box) return;
            const span = box.querySelector('.desc-title-text');
            if (!span) return;
            const current = span.textContent.trim();
            const newTitle = prompt('ویرایش عنوان توضیحات:', current);
            if (newTitle && newTitle.trim() !== '') {
                span.textContent = newTitle.trim();
                showToast('عنوان توضیحات تغییر کرد! ✏️');
            }
        }
        
        // ===== EDIT DESC CONTENT =====
        if (action === 'edit-desc-content') {
            const box = target.closest('.lesson-description-box');
            if (!box) return;
            const p = box.querySelector('.desc-content-text');
            if (!p) return;
            const current = p.textContent.trim();
            const newDesc = prompt('ویرایش توضیحات:', current);
            if (newDesc && newDesc.trim() !== '') {
                p.textContent = newDesc.trim();
                showToast('توضیحات تغییر کرد! ✏️');
            }
        }
        
        // ===== ADD ATTACHMENT =====
        if (action === 'add-attachment') {
            const list = target.closest('.lesson-attachments').querySelector('.attachment-list');
            if (!list) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.zip,.rar,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
            input.multiple = true;
            input.style.display = 'none';
            document.body.appendChild(input);
            input.addEventListener('change', function() {
                for (let f of this.files) {
                    const item = document.createElement('div');
                    item.className = 'attachment-item';
                    let icon = 'fa-file';
                    if (f.name.endsWith('.pdf')) icon = 'fa-file-pdf';
                    else if (f.name.endsWith('.zip') || f.name.endsWith('.rar')) icon = 'fa-file-archive';
                    else if (f.name.endsWith('.doc') || f.name.endsWith('.docx')) icon = 'fa-file-word';
                    else if (f.name.endsWith('.xls') || f.name.endsWith('.xlsx')) icon = 'fa-file-excel';
                    else if (f.name.endsWith('.ppt') || f.name.endsWith('.pptx')) icon = 'fa-file-powerpoint';
                    else if (f.name.endsWith('.txt')) icon = 'fa-file-alt';
                    item.innerHTML = `
                        <i class="fas ${icon}" style="color: #ff6b35;"></i>
                        <span>${f.name}</span>
                        <button class="remove-attachment" data-action="remove-attachment">×</button>
                    `;
                    list.appendChild(item);
                }
                showToast(`${this.files.length} فایل اضافه شد! 📎`);
                this.remove();
            });
            input.click();
        }
        
        // ===== REMOVE ATTACHMENT =====
        if (action === 'remove-attachment') {
            const item = target.closest('.attachment-item');
            if (item) {
                item.remove();
                showToast('فایل پیوست حذف شد! 🗑️');
            }
        }
    });
    
    // ============================================
    // ===== FILE UPLOAD =====
    // ============================================
    document.addEventListener('change', function(e) {
        const input = e.target.closest('.file-input');
        if (!input) return;
        const file = input.files[0];
        if (!file) return;
        
        const lessonItem = input.closest('.lesson-item');
        if (!lessonItem) return;
        
        const area = lessonItem.querySelector('.file-upload-area');
        const nameSpan = area?.querySelector('.file-name');
        if (nameSpan) nameSpan.textContent = file.name;
        
        const preview = lessonItem.querySelector('.video-preview');
        if (preview && file.type.startsWith('video/')) {
            const video = preview.querySelector('video');
            if (video) {
                const url = URL.createObjectURL(file);
                video.src = url;
                preview.classList.add('active');
                video.onloadedmetadata = () => URL.revokeObjectURL(url);
            }
        }
        
        const removeBtn = lessonItem.querySelector('.remove-video-btn');
        if (removeBtn) {
            removeBtn.style.display = 'inline-flex';
            removeBtn.classList.add('visible');
        }
        
        showToast(`فایل "${file.name}" آپلود شد! 📤`);
    });
    
    // ============================================
    // ===== COURSE SELECTOR =====
    // ============================================
    document.getElementById('courseSelect')?.addEventListener('change', function() {
        showToast(`دوره "${this.options[this.selectedIndex].text}" انتخاب شد`, 'info');
    });
    
    // ============================================
    // ===== KEYBOARD SHORTCUT =====
    // ============================================
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'N' || e.key === 'n')) {
            e.preventDefault();
            addNewSection();
        }
    });
    
    // ============================================
    // ===== INIT =====
    // ============================================
    document.querySelectorAll('.section-card').forEach(sec => updateSectionInfo(sec));
    console.log('✅ همه چی درسته!');
});