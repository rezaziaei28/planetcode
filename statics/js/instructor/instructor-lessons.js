/* ============================================
   FILE: static/js/instructor/instructor-lessons.js
   DESCRIPTION: مدیریت درس‌ها - اسکریپت کامل
   ============================================ */

   document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ Lessons Management initialized');
    
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
    // ===== ADD LESSON BUTTON =====
    // ============================================
    function goToAddLesson() {
        window.location.href = '/instructor/lesson/add/';
    }
    
    document.getElementById('addLessonBtn')?.addEventListener('click', goToAddLesson);
    document.getElementById('emptyAddLessonBtn')?.addEventListener('click', goToAddLesson);
    
    // ============================================
    // ===== SEARCH FUNCTIONALITY =====
    // ============================================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#lessonsTableBody tr');
            let hasResults = false;
            
            rows.forEach(row => {
                const title = row.querySelector('.lesson-info span')?.textContent.toLowerCase() || '';
                const course = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || course.includes(searchTerm)) {
                    row.style.display = '';
                    hasResults = true;
                } else {
                    row.style.display = 'none';
                }
            });
            
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) {
                if (!hasResults && rows.length > 0) {
                    emptyState.style.display = 'block';
                    emptyState.querySelector('h3').textContent = 'نتیجه‌ای یافت نشد';
                    emptyState.querySelector('p').textContent = `درسی با عبارت "${searchTerm}" پیدا نشد`;
                } else {
                    emptyState.style.display = 'none';
                }
            }
        });
    }
    
    // ============================================
    // ===== COURSE FILTER =====
    // ============================================
    const courseFilter = document.getElementById('courseFilter');
    if (courseFilter) {
        courseFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = document.querySelectorAll('#lessonsTableBody tr');
            let hasResults = false;
            
            const courseMap = {
                'django': 'دوره جامع Django',
                'react': 'React & Tailwind CSS',
                'arduino': 'رباتیک با Arduino'
            };
            
            rows.forEach(row => {
                const course = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                
                if (filterValue === 'all') {
                    row.style.display = '';
                    hasResults = true;
                } else if (course === courseMap[filterValue]) {
                    row.style.display = '';
                    hasResults = true;
                } else {
                    row.style.display = 'none';
                }
            });
            
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) {
                if (!hasResults) {
                    emptyState.style.display = 'block';
                    emptyState.querySelector('h3').textContent = 'نتیجه‌ای یافت نشد';
                    emptyState.querySelector('p').textContent = 'درسی برای این دوره وجود ندارد';
                } else {
                    emptyState.style.display = 'none';
                }
            }
        });
    }
    
    // ============================================
    // ===== STATUS FILTER =====
    // ============================================
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = document.querySelectorAll('#lessonsTableBody tr');
            let hasResults = false;
            
            rows.forEach(row => {
                const status = row.querySelector('.status-badge');
                if (filterValue === 'all') {
                    row.style.display = '';
                    hasResults = true;
                } else if (status && status.classList.contains(filterValue)) {
                    row.style.display = '';
                    hasResults = true;
                } else {
                    row.style.display = 'none';
                }
            });
            
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) {
                if (!hasResults) {
                    emptyState.style.display = 'block';
                    emptyState.querySelector('h3').textContent = 'نتیجه‌ای یافت نشد';
                    emptyState.querySelector('p').textContent = 'درسی با این وضعیت وجود ندارد';
                } else {
                    emptyState.style.display = 'none';
                }
            }
        });
    }
    
    // ============================================
    // ===== EDIT LESSON =====
    // ============================================
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = '/instructor/lesson/edit/';
        });
    });
    
    // ============================================
    // ===== DELETE LESSON =====
    // ============================================
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row?.querySelector('.lesson-info span')?.textContent.trim() || 'این درس';
            
            if (confirm(`آیا از حذف "${title}" مطمئن هستید؟`)) {
                if (row) {
                    row.style.opacity = '0.3';
                    row.style.transition = 'all 0.3s ease';
                    setTimeout(() => {
                        row.remove();
                        showToast(`درس "${title}" با موفقیت حذف شد! 🗑️`);
                        
                        // Check if table is empty
                        const remainingRows = document.querySelectorAll('#lessonsTableBody tr');
                        if (remainingRows.length === 0) {
                            const emptyState = document.querySelector('.empty-state');
                            if (emptyState) {
                                emptyState.style.display = 'block';
                                emptyState.querySelector('h3').textContent = 'هیچ درسی وجود ندارد';
                                emptyState.querySelector('p').textContent = 'اولین درس خود را ایجاد کنید';
                            }
                        }
                    }, 300);
                }
            }
        });
    });
    
    // ============================================
    // ===== BACK BUTTON =====
    // ============================================
    document.getElementById('backToCoursesBtn')?.addEventListener('click', function() {
        window.location.href = '/instructor/courses/';
    });
    
    // ============================================
    // ===== PAGINATION =====
    // ============================================
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ============================================
    // ===== KEYBOARD SHORTCUTS =====
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Ctrl + N = Add new lesson
        if (e.ctrlKey && (e.key === 'n' || e.key === 'N')) {
            e.preventDefault();
            goToAddLesson();
        }
        
        // Ctrl + F = Focus search
        if (e.ctrlKey && (e.key === 'f' || e.key === 'F')) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
    
    console.log('✅ Lessons Management ready!');
});