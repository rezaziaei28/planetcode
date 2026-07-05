// مدیریت پنل کاربری با منوی سریع موبایل
document.addEventListener('DOMContentLoaded', function() {
    // ========== تعریف متغیرها ==========
    const elements = {
        // ناوبری موبایل
        mobileToggle: document.getElementById('mobileToggle'),
        sidebar: document.getElementById('sidebar'),
        sidebarClose: document.getElementById('sidebarClose'),
        sidebarOverlay: document.getElementById('sidebarOverlay'),
        
        // منوی سریع
        quickMenuPopup: document.getElementById('quickMenuPopup'),
        closeQuickMenu: document.getElementById('closeQuickMenu'),
        fullSidebarBtn: document.getElementById('fullSidebarBtn'),
        quickMenuItems: document.querySelectorAll('.quick-menu-item'),
        
        // تغییر تم
        themeToggle: document.getElementById('themeToggle'),
        
        // اعلان‌ها
        notificationBtn: document.getElementById('notificationBtn'),
        notificationsPopup: document.getElementById('notificationsPopup'),
        
        // سبد خرید
        cartBtn: document.getElementById('cartBtn'),
        cartPopup: document.getElementById('cartPopup'),
        closeCart: document.getElementById('closeCart'),
        checkoutBtn: document.getElementById('checkoutBtn'),
        
        // عناصر اطلاعات
        userName: document.getElementById('userName'),
        userPhone: document.getElementById('userPhone'),
        currentDate: document.getElementById('currentDate'),
        courseCount: document.getElementById('courseCount'),
        qaCount: document.getElementById('qaCount'),
        ticketCount: document.getElementById('ticketCount'),
        walletBalance: document.getElementById('walletBalance'),
        
        // جستجو
        courseSearch: document.getElementById('courseSearch')
    };

    // ========== متغیرهای وضعیت ==========
    let state = {
        isMobileMenuOpen: false,
        isQuickMenuOpen: false,
        isSidebarOpen: false,
        isDarkTheme: localStorage.getItem('theme') === 'dark'
    };

    // ========== راه‌اندازی اولیه ==========
    function initializeDashboard() {
        // بارگذاری اطلاعات کاربر
        loadUserData();
        
        // تنظیم تاریخ جاری
        setCurrentDate();
        
        // بارگذاری آمار
        loadStats();
        
        // اعمال تم اولیه
        applyTheme();
        
        // راه‌اندازی رویدادها
        setupEventListeners();
        
        // تشخیص دستگاه
        detectDevice();
        
        // جلوگیری از اسکرول در حالت موبایل
        preventScrollOnMobile();
    }

    // ========== رویدادهای کلیک ==========
    function setupEventListeners() {
        // منوی همبرگر
        elements.mobileToggle.addEventListener('click', toggleMobileMenu);
        
        // بستن سایدبار
        elements.sidebarClose.addEventListener('click', closeSidebar);
        elements.sidebarOverlay.addEventListener('click', closeAllMenus);
        
        // تغییر تم
        elements.themeToggle.addEventListener('click', toggleTheme);
        
        // اعلان‌ها
        elements.notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePopup(elements.notificationsPopup);
        });
        
        // سبد خرید
        elements.cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePopup(elements.cartPopup);
        });
        
        elements.closeCart.addEventListener('click', function() {
            hidePopup(elements.cartPopup);
        });
        
        elements.checkoutBtn.addEventListener('click', function() {
            alert('در حال انتقال به صفحه پرداخت...');
            hidePopup(elements.cartPopup);
        });
        
        // منوی سریع
        elements.closeQuickMenu.addEventListener('click', closeQuickMenu);
        elements.fullSidebarBtn.addEventListener('click', openFullSidebar);
        
        // آیتم‌های منوی سریع
        elements.quickMenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('data-target');
                navigateToSection(target);
                closeQuickMenu();
            });
        });
        
        // کلیک خارج از پاپ‌آپ‌ها
        document.addEventListener('click', handleOutsideClick);
        
        // رویدادهای کیبورد
        document.addEventListener('keydown', handleKeyboardEvents);
        
        // تغییر سایز پنجره
        window.addEventListener('resize', handleResize);
    }

    // ========== مدیریت منوی موبایل ==========
    function toggleMobileMenu() {
        if (isMobile()) {
            if (state.isQuickMenuOpen) {
                closeQuickMenu();
            } else {
                openQuickMenu();
            }
        } else {
            toggleSidebar();
        }
    }

    function openQuickMenu() {
        state.isQuickMenuOpen = true;
        state.isMobileMenuOpen = true;
        
        elements.quickMenuPopup.style.display = 'block';
        elements.mobileToggle.classList.add('active');
        
        // انیمیشن
        setTimeout(() => {
            elements.quickMenuPopup.style.opacity = '1';
            elements.quickMenuPopup.style.transform = 'translateY(0)';
        }, 10);
    }

    function closeQuickMenu() {
        state.isQuickMenuOpen = false;
        state.isMobileMenuOpen = false;
        
        elements.quickMenuPopup.style.opacity = '0';
        elements.quickMenuPopup.style.transform = 'translateY(-20px)';
        elements.mobileToggle.classList.remove('active');
        
        setTimeout(() => {
            elements.quickMenuPopup.style.display = 'none';
        }, 300);
    }

    function openFullSidebar() {
        closeQuickMenu();
        
        state.isSidebarOpen = true;
        elements.sidebar.classList.add('active');
        elements.sidebarOverlay.style.display = 'block';
        
        setTimeout(() => {
            elements.sidebarOverlay.style.opacity = '1';
        }, 10);
        
        document.body.style.overflow = 'hidden';
    }

    function toggleSidebar() {
        if (state.isSidebarOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    function openSidebar() {
        state.isSidebarOpen = true;
        elements.sidebar.classList.add('active');
        elements.sidebarOverlay.style.display = 'block';
        
        setTimeout(() => {
            elements.sidebarOverlay.style.opacity = '1';
        }, 10);
        
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        state.isSidebarOpen = false;
        elements.sidebar.classList.remove('active');
        elements.sidebarOverlay.style.opacity = '0';
        
        setTimeout(() => {
            elements.sidebarOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    function closeAllMenus() {
        closeQuickMenu();
        closeSidebar();
        hidePopup(elements.cartPopup);
        hidePopup(elements.notificationsPopup);
    }

    // ========== مدیریت تم ==========
    function toggleTheme() {
        state.isDarkTheme = !state.isDarkTheme;
        applyTheme();
        localStorage.setItem('theme', state.isDarkTheme ? 'dark' : 'light');
    }

    function applyTheme() {
        if (state.isDarkTheme) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    // ========== توابع پاپ‌آپ ==========
    function togglePopup(popup) {
        if (popup.style.display === 'block') {
            hidePopup(popup);
        } else {
            showPopup(popup);
        }
    }

    function showPopup(popup) {
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    }

    function hidePopup(popup) {
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }

    // ========== بارگذاری اطلاعات ==========
    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('currentUser')) || {
            fullName: 'علی محمدی',
            phone: '09123456789'
        };

        elements.userName.textContent = userData.fullName;
        elements.userPhone.textContent = formatPhoneNumber(userData.phone);
    }

    function formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length !== 11) return phone;
        
        return `۰${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }

    function setCurrentDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const persianDate = now.toLocaleDateString('fa-IR', options);
        elements.currentDate.textContent = persianDate;
    }

    function loadStats() {
        const stats = JSON.parse(localStorage.getItem('userStats')) || {
            courses: 3,
            questions: 0,
            tickets: 0,
            wallet: 0
        };

        elements.courseCount.textContent = stats.courses;
        elements.qaCount.textContent = stats.questions;
        elements.ticketCount.textContent = stats.tickets;
        elements.walletBalance.textContent = formatCurrency(stats.wallet);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('fa-IR').format(amount);
    }

    // ========== ناوبری ==========
    function navigateToSection(section) {
        // غیرفعال کردن همه لینک‌ها
        document.querySelectorAll('.quick-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // فعال کردن لینک هدف
        const targetLink = document.querySelector(`.quick-links a[data-section="${section}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
        
        // اسکرول به بخش مورد نظر (در واقعیت)
        alert(`در حال انتقال به بخش ${section}...`);
        // window.location.hash = section;
    }

    // ========== توابع کمکی ==========
    function isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    function detectDevice() {
        if (isMobile()) {
            document.body.classList.add('is-mobile');
        } else {
            document.body.classList.remove('is-mobile');
        }
    }

    function handleOutsideClick(e) {
        // بستن منوی سریع با کلیک خارج
        if (!elements.quickMenuPopup.contains(e.target) && 
            !elements.mobileToggle.contains(e.target) &&
            state.isQuickMenuOpen) {
            closeQuickMenu();
        }
        
        // بستن پاپ‌آپ اعلان‌ها
        if (!elements.notificationsPopup.contains(e.target) && 
            !elements.notificationBtn.contains(e.target)) {
            hidePopup(elements.notificationsPopup);
        }
        
        // بستن پاپ‌آپ سبد خرید
        if (!elements.cartPopup.contains(e.target) && 
            !elements.cartBtn.contains(e.target)) {
            hidePopup(elements.cartPopup);
        }
        
        // بستن منوی اعلان‌ها
        const notificationDropdown = document.querySelector('.notification-dropdown');
        if (notificationDropdown && !notificationDropdown.contains(e.target) && 
            !elements.notificationBtn.contains(e.target)) {
            notificationDropdown.style.display = 'none';
        }
    }

    function handleKeyboardEvents(e) {
        // بستن با Escape
        if (e.key === 'Escape') {
            closeAllMenus();
        }
        
        // باز کردن جستجو با Ctrl+K
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            elements.courseSearch.focus();
            elements.courseSearch.select();
        }
        
        // ناوبری با اعداد (برای منوی سریع)
        if (state.isQuickMenuOpen && e.key >= '1' && e.key <= '3') {
            const index = parseInt(e.key) - 1;
            if (elements.quickMenuItems[index]) {
                elements.quickMenuItems[index].click();
            }
        }
    }

    function handleResize() {
        // بستن منوها در دسکتاپ
        if (!isMobile() && (state.isQuickMenuOpen || state.isSidebarOpen)) {
            closeAllMenus();
        }
        
        // به‌روزرسانی نمایش تاریخ
        if (isMobile()) {
            setCurrentDate(true);
        } else {
            setCurrentDate(false);
        }
        
        // تنظیم مجدد grid دوره‌ها
        adjustCoursesGrid();
    }

    function adjustCoursesGrid() {
        const grid = document.querySelector('.courses-grid');
        if (!grid) return;
        
        if (isMobile()) {
            grid.style.gridTemplateColumns = '1fr';
        } else if (window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches) {
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (window.matchMedia('(min-width: 1025px) and (max-width: 1399px)').matches) {
            grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else if (window.matchMedia('(min-width: 1400px)').matches) {
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }

    function preventScrollOnMobile() {
        if (isMobile()) {
            document.body.style.overscrollBehavior = 'contain';
        }
    }

    // ========== رویدادهای کارت دوره‌ها ==========
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseTitle = this.closest('.course-card').querySelector('h3').textContent;
            alert(`شروع یادگیری "${courseTitle}"`);
        });
    });

    document.querySelectorAll('.certificate-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('در حال نمایش گواهینامه...');
        });
    });

    // ========== ارتقاء به پرمیوم ==========
    document.querySelector('.upgrade-btn').addEventListener('click', function() {
        alert('در حال انتقال به صفحه ارتقاء به پرمیوم...');
    });

    // ========== جستجو ==========
    elements.courseSearch.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        filterCourses(searchTerm);
    }, 300));

    function filterCourses(searchTerm) {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ========== شبیه‌سازی داده‌های زنده ==========
    function simulateLiveUpdates() {
        // به‌روزرسانی موجودی کیف پول
        setInterval(() => {
            const wallet = Math.floor(Math.random() * 100000);
            elements.walletBalance.textContent = formatCurrency(wallet);
        }, 10000);
        
        // به‌روزرسانی تاریخ
        setInterval(() => {
            setCurrentDate();
        }, 60000);
    }

    // ========== شروع سیستم ==========
    initializeDashboard();
    setTimeout(simulateLiveUpdates, 2000);
});

// 1. کش کردن داده‌ها
const cache = new Map();

// 2. لودینگ تدریجی تصاویر
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

// 3. انیمیشن‌های پیشرفته
const animateValue = (element, start, end, duration) => {
    // انیمیشن شمارنده‌ها
};