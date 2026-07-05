
// // مدیریت منوی موبایل و سبد خرید (فقط باز و بسته کردن)
// document.addEventListener('DOMContentLoaded', function() {
//     // متغیرهای منوی موبایل
//     const hamburger = document.getElementById('hamburger');
//     const mobileMenu = document.getElementById('mobileMenu');
//     const closeMenu = document.getElementById('closeMenu');
//     const overlay = document.getElementById('overlay');
//     const cartBtn = document.getElementById('cartBtn');
//     const cartPanel = document.getElementById('cartPanel');
//     const closeCart = document.getElementById('closeCart');

//     // 1. مدیریت منوی موبایل
//     if (hamburger && mobileMenu && closeMenu && overlay) {
//         hamburger.addEventListener('click', function() {
//             mobileMenu.classList.add('active');
//             overlay.classList.add('active');
//             document.body.style.overflow = 'hidden';
//         });

//         closeMenu.addEventListener('click', function() {
//             mobileMenu.classList.remove('active');
//             overlay.classList.remove('active');
//             document.body.style.overflow = '';
//         });
//     }

//     // 2. مدیریت سبد خرید (فقط باز و بسته کردن)
//     if (cartBtn && cartPanel && closeCart && overlay) {
//         cartBtn.addEventListener('click', function() {
//             cartPanel.classList.add('active');
//             overlay.classList.add('active');
//             document.body.style.overflow = 'hidden';
//         });

//         closeCart.addEventListener('click', function() {
//             cartPanel.classList.remove('active');
//             overlay.classList.remove('active');
//             document.body.style.overflow = '';
//         });
//     }

//     // Overlay برای بستن هر دو
//     overlay.addEventListener('click', function() {
//         mobileMenu.classList.remove('active');
//         cartPanel.classList.remove('active');
//         overlay.classList.remove('active');
//         document.body.style.overflow = '';
//     });

//     // بستن با کلید ESC
//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Escape') {
//             mobileMenu.classList.remove('active');
//             cartPanel.classList.remove('active');
//             overlay.classList.remove('active');
//             document.body.style.overflow = '';
//         }
//     });

//     // مدیریت تغییر تم تاریک/روشن
//     const themeToggle = document.getElementById('themeToggle');
//     const mobileThemeToggle = document.getElementById('mobileThemeToggle');
//     const body = document.body;

//     // بررسی تم ذخیره شده در localStorage
//     const savedTheme = localStorage.getItem('theme') || 'dark';
//     body.classList.toggle('light-theme', savedTheme === 'light');
//     updateThemeIcons();

//     // تابع آپدیت آیکون‌ها
//     function updateThemeIcons() {
//         const isLightTheme = body.classList.contains('light-theme');
//         const icons = document.querySelectorAll('.theme-toggle i, #mobileThemeToggle i');
        
//         icons.forEach(icon => {
//             if (isLightTheme) {
//                 icon.className = 'fas fa-sun';
//                 // فقط اگر span وجود داشت، متن رو عوض کن
//                 const mobileButton = icon.closest('#mobileThemeToggle');
//                 if (mobileButton) {
//                     const span = mobileButton.querySelector('span');
//                     if (span) {
//                         span.textContent = 'تغییر به تم تاریک';
//                     }
//                 }
//             } else {
//                 icon.className = 'fas fa-moon';
//                 // فقط اگر span وجود داشت، متن رو عوض کن
//                 const mobileButton = icon.closest('#mobileThemeToggle');
//                 if (mobileButton) {
//                     const span = mobileButton.querySelector('span');
//                     if (span) {
//                         span.textContent = 'تغییر به تم روشن';
//                     }
//                 }
//             }
//         });
//     }

//     // تغییر تم با دکمه دسکتاپ
//     if (themeToggle) {
//         themeToggle.addEventListener('click', function() {
//             body.classList.toggle('light-theme');
//             const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
//             localStorage.setItem('theme', currentTheme);
//             updateThemeIcons();
//         });
//     }

//     // تغییر تم با دکمه موبایل
//     if (mobileThemeToggle) {
//         mobileThemeToggle.addEventListener('click', function() {
//             body.classList.toggle('light-theme');
//             const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
//             localStorage.setItem('theme', currentTheme);
//             updateThemeIcons();
//         });
//     }
// });

// // مدیریت منوهای کشویی موبایل
// document.addEventListener('DOMContentLoaded', function() {
//     const dropdownToggles = document.querySelectorAll('.mobile-dropdown .dropdown-toggle');
    
//     dropdownToggles.forEach(toggle => {
//         toggle.addEventListener('click', function(e) {
//             e.preventDefault();
//             const dropdown = this.closest('.mobile-dropdown');
//             dropdown.classList.toggle('active');
            
//             // بستن سایر منوهای باز
//             dropdownToggles.forEach(otherToggle => {
//                 if (otherToggle !== this) {
//                     const otherDropdown = otherToggle.closest('.mobile-dropdown');
//                     otherDropdown.classList.remove('active');
//                 }
//             });
//         });
//     });
    
//     // بستن منوها با کلیک خارج
//     document.addEventListener('click', function(e) {
//         if (!e.target.closest('.mobile-dropdown')) {
//             dropdownToggles.forEach(toggle => {
//                 const dropdown = toggle.closest('.mobile-dropdown');
//                 dropdown.classList.remove('active');
//             });
//         }
//     });
// });


// ----------------------------------------------
// مدیریت منوی موبایل و سبد خرید
document.addEventListener('DOMContentLoaded', function() {
    // متغیرهای منوی موبایل
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    const cartBtn = document.getElementById('cartBtn');
    const cartPanel = document.getElementById('cartPanel');
    const closeCart = document.getElementById('closeCart');

    // 1. مدیریت منوی موبایل
    if (hamburger && mobileMenu && closeMenu && overlay) {
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // 2. مدیریت سبد خرید
    if (cartBtn && cartPanel && closeCart && overlay) {
        cartBtn.addEventListener('click', function() {
            cartPanel.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeCart.addEventListener('click', function() {
            cartPanel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Overlay برای بستن هر دو
    overlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        cartPanel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // بستن با کلید ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            mobileMenu.classList.remove('active');
            cartPanel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // مدیریت تغییر تم تاریک/روشن
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const body = document.body;

    // بررسی تم ذخیره شده در localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.toggle('light-theme', savedTheme === 'light');
    updateThemeIcons();

    // تابع آپدیت آیکون‌ها
    function updateThemeIcons() {
        const isLightTheme = body.classList.contains('light-theme');
        const icons = document.querySelectorAll('.theme-toggle i, #mobileThemeToggle i');
        
        icons.forEach(icon => {
            if (isLightTheme) {
                icon.className = 'fas fa-sun';
                // فقط اگر span وجود داشت، متن رو عوض کن
                const mobileButton = icon.closest('#mobileThemeToggle');
                if (mobileButton) {
                    const span = mobileButton.querySelector('span');
                    if (span) {
                        span.textContent = 'تغییر به تم تاریک';
                    }
                }
            } else {
                icon.className = 'fas fa-moon';
                // فقط اگر span وجود داشت، متن رو عوض کن
                const mobileButton = icon.closest('#mobileThemeToggle');
                if (mobileButton) {
                    const span = mobileButton.querySelector('span');
                    if (span) {
                        span.textContent = 'تغییر به تم روشن';
                    }
                }
            }
        });
    }

    // تغییر تم با دکمه دسکتاپ
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('light-theme');
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            updateThemeIcons();
        });
    }

    // تغییر تم با دکمه موبایل
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
            body.classList.toggle('light-theme');
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            updateThemeIcons();
        });
    }

    // مدیریت منوهای کشویی موبایل - نسخه ساده و کارآمد
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown .dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.mobile-dropdown');
            const isActive = dropdown.classList.contains('active');
            
            // بستن تمام dropdown های دیگر
            document.querySelectorAll('.mobile-dropdown.active').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });
            
            // toggle dropdown جاری
            dropdown.classList.toggle('active', !isActive);
        });
    });
    
    // بستن منوها با کلیک خارج
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-dropdown')) {
            document.querySelectorAll('.mobile-dropdown.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // بستن منو هنگام کلیک روی لینک‌های معمولی
    const mobileLinks = document.querySelectorAll('.mobile-nav-link:not(.dropdown-toggle), .mobile-dropdown-item:not(.dropdown-toggle)');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});
// -----------------------------------------------














































































































// ================================

// // مدیریت منوی موبایل
// document.addEventListener('DOMContentLoaded', function() {
//     const hamburger = document.getElementById('hamburger');
//     const mobileMenu = document.getElementById('mobileMenu');
//     const closeMenu = document.getElementById('closeMenu');
//     const overlay = document.getElementById('overlay');
    
//     // باز کردن منوی موبایل
//     hamburger.addEventListener('click', function() {
//         mobileMenu.classList.add('active');
//         overlay.classList.add('active');
//         document.body.style.overflow = 'hidden';
//     });
    
//     // بستن منوی موبایل
//     closeMenu.addEventListener('click', function() {
//         mobileMenu.classList.remove('active');
//         overlay.classList.remove('active');
//         document.body.style.overflow = '';
//     });
    
//     // بستن با کلیک روی overlay
//     overlay.addEventListener('click', function() {
//         mobileMenu.classList.remove('active');
//         overlay.classList.remove('active');
//         document.body.style.overflow = '';
//     });
    
//     // مدیریت دراپ‌داون‌های موبایل
//     const dropdownToggles = document.querySelectorAll('.mobile-dropdown .dropdown-toggle');
    
//     dropdownToggles.forEach(toggle => {
//         toggle.addEventListener('click', function(e) {
//             e.preventDefault();
//             const dropdown = this.parentElement;
//             dropdown.classList.toggle('active');
//         });
//     });
    
//     // بستن منو هنگام کلیک روی لینک
//     const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-item:not(.dropdown-toggle)');
//     mobileLinks.forEach(link => {
//         link.addEventListener('click', function() {
//             mobileMenu.classList.remove('active');
//             overlay.classList.remove('active');
//             document.body.style.overflow = '';
//         });
//     });
// });

