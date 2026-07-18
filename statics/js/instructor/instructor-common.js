document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SIDEBAR TOGGLE =====
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    }
    
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        }
    });
    
    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Toggle class on body
            document.body.classList.toggle('light-theme');
            
            // Change icon
            const icon = this.querySelector('i');
            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fas fa-sun';
                icon.style.color = '#ff6b35';
            } else {
                icon.className = 'fas fa-moon';
                icon.style.color = '';
            }
            
            // Save preference to localStorage
            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // ===== LOAD SAVED THEME =====
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = 'fas fa-sun';
            icon.style.color = '#ff6b35';
        }
    }
    
    // ===== NOTIFICATION CLICK =====
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', function() {
            alert('شما 3 اعلان جدید دارید!');
        });
    }
    
    // ===== LOGOUT BUTTON =====
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
                window.location.href = '/logout/';
            }
        });
    }
    
});