/* ============================================
   FILE: static/js/instructor/instructor-courses.js
   DESCRIPTION: مدیریت دوره‌ها
   ============================================ */

   document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ Courses Management initialized');
    
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
    // ===== ADD COURSE BUTTON =====
    // ============================================
    function goToAddCourse() {
        window.location.href = '/instructor/course/add/';
    }
    
    document.getElementById('addCourseBtn')?.addEventListener('click', goToAddCourse);
    document.getElementById('emptyAddCourseBtn')?.addEventListener('click', goToAddCourse);
    
    // ============================================
    // ===== SEARCH =====
    // ============================================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#coursesTableBody tr');
            let hasResults = false;
            
            rows.forEach(row => {
                const title = row.querySelector('.course-info-cell h4')?.textContent.toLowerCase() || '';
                if (title.includes(searchTerm)) {
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
                    emptyState.querySelector('p').textContent = `دوره‌ای با عبارت "${searchTerm}" پیدا نشد`;
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
            const rows = document.querySelectorAll('#coursesTableBody tr');
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
                    emptyState.querySelector('p').textContent = 'دوره‌ای با این وضعیت وجود ندارد';
                } else {
                    emptyState.style.display = 'none';
                }
            }
        });
    }
    
    // ============================================
    // ===== EDIT COURSE =====
    // ============================================
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = '/instructor/course/edit/';
        });
    });
    
    // ============================================
    // ===== LESSONS BUTTON - FIXED =====
    // ============================================
    document.querySelectorAll('.lessons-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = '/instructor/sections/';
        });
    });
    
    // ============================================
    // ===== DELETE COURSE =====
    // ============================================
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const title = row?.querySelector('.course-info-cell h4')?.textContent.trim() || 'این دوره';
            
            if (confirm(`آیا از حذف "${title}" مطمئن هستید؟`)) {
                if (row) {
                    row.style.opacity = '0.3';
                    row.style.transition = 'all 0.3s ease';
                    setTimeout(() => {
                        row.remove();
                        showToast(`دوره "${title}" با موفقیت حذف شد! 🗑️`);
                        
                        // Check if table is empty
                        const remainingRows = document.querySelectorAll('#coursesTableBody tr');
                        if (remainingRows.length === 0) {
                            const emptyState = document.querySelector('.empty-state');
                            if (emptyState) {
                                emptyState.style.display = 'block';
                                emptyState.querySelector('h3').textContent = 'هیچ دوره‌ای وجود ندارد';
                                emptyState.querySelector('p').textContent = 'اولین دوره خود را ایجاد کنید';
                            }
                        }
                    }, 300);
                }
            }
        });
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
    // ===== SORT FILTER =====
    // ============================================
    document.getElementById('sortFilter')?.addEventListener('change', function() {
        showToast(`مرتب‌سازی: ${this.options[this.selectedIndex].text}`, 'info');
    });
    
    console.log('✅ Courses Management ready!');
});