document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ADD COURSE BUTTON =====
    const addCourseBtn = document.getElementById('addCourseBtn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', function() {
            window.location.href = '/instructor/course/add/';
        });
    }
    
    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#coursesTableBody tr');
            
            rows.forEach(row => {
                const title = row.querySelector('.course-info-cell h4')?.textContent.toLowerCase() || '';
                if (title.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // ===== FILTER FUNCTIONALITY =====
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = document.querySelectorAll('#coursesTableBody tr');
            
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
            window.location.href = '/instructor/course/edit/';
        });
    });
    
    document.querySelectorAll('.lessons-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = '/instructor/lessons/';
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('آیا از حذف این دوره مطمئن هستید؟')) {
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