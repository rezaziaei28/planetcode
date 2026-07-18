document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ADD LESSON BUTTON =====
    const addLessonBtn = document.getElementById('addLessonBtn');
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', function() {
            window.location.href = '/instructor/lesson/add/';
        });
    }
    
    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#lessonsTableBody tr');
            
            rows.forEach(row => {
                const title = row.querySelector('.lesson-info span')?.textContent.toLowerCase() || '';
                const course = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || course.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // ===== COURSE FILTER =====
    const courseFilter = document.getElementById('courseFilter');
    if (courseFilter) {
        courseFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = document.querySelectorAll('#lessonsTableBody tr');
            
            rows.forEach(row => {
                const course = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                const courseMap = {
                    'django': 'دوره جامع Django',
                    'react': 'React & Tailwind CSS',
                    'arduino': 'رباتیک با Arduino'
                };
                
                if (filterValue === 'all') {
                    row.style.display = '';
                } else if (course === courseMap[filterValue]) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // ===== STATUS FILTER =====
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = document.querySelectorAll('#lessonsTableBody tr');
            
            rows.forEach(row => {
                const status = row.querySelector('.status-badge');
                if (filterValue === 'all') {
                    row.style.display = '';
                } else if (status && status.classList.contains(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // ===== ACTION BUTTONS =====
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = '/instructor/lesson/edit/';
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('آیا از حذف این درس مطمئن هستید؟')) {
                const row = this.closest('tr');
                if (row) {
                    row.style.opacity = '0.3';
                    row.style.transition = 'all 0.3s ease';
                    setTimeout(() => {
                        row.remove();
                    }, 300);
                }
            }
        });
    });
    
    // ===== PAGINATION =====
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
});