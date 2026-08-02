/* ============================================
   LOGIN PAGE - COMPLETE SCRIPT
   ============================================ */

   document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // TOGGLE PASSWORD - FIXED ID
    // ============================================

    const toggleBtn = document.getElementById('togglePassword');  // <-- اصلاح شد
    const passInput = document.getElementById('password');

    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', function() {
            const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passInput.setAttribute('type', type);
            this.querySelector('i').className = type === 'password' ? 'far fa-eye' : 'far fa-eye-slash';
        });
    }

    // ============================================
    // REMEMBER ME
    // ============================================

    const usernameInput = document.getElementById('username');
    const rememberCheck = document.getElementById('remember');

    // Load saved username
    const saved = localStorage.getItem('remembered_user');
    if (saved && usernameInput) {
        usernameInput.value = saved;
        if (rememberCheck) rememberCheck.checked = true;
    }

    // ============================================
    // FORM SUBMIT
    // ============================================

    const form = document.getElementById('loginForm');
    const btn = document.getElementById('loginBtn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            // Validate
            if (!username || !password) {
                showNotification('لطفاً نام کاربری و رمز عبور را وارد کنید', 'error');
                return;
            }

            // Save username
            if (rememberCheck && rememberCheck.checked) {
                localStorage.setItem('remembered_user', username);
            } else {
                localStorage.removeItem('remembered_user');
            }

            // Loading state
            btn.classList.add('loading');
            btn.disabled = true;

            // Simulate login
            setTimeout(function() {
                btn.classList.remove('loading');
                btn.disabled = false;

                showNotification('ورود با موفقیت انجام شد!', 'success');

                setTimeout(function() {
                    // window.location.href = '/dashboard/';
                }, 1000);

            }, 1500);
        });
    }

    // ============================================
    // ENTER KEY SHORTCUT
    // ============================================

    if (passInput) {
        passInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (form) form.dispatchEvent(new Event('submit'));
            }
        });
    }

    // ============================================
    // NOTIFICATION
    // ============================================

    function showNotification(message, type) {
        type = type || 'success';

        document.querySelectorAll('.login-notification').forEach(el => el.remove());

        const notif = document.createElement('div');
        notif.className = 'login-notification ' + type;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        notif.innerHTML = '<i class="fas ' + icon + '"></i> ' + message;
        document.body.appendChild(notif);

        setTimeout(function() {
            notif.style.opacity = '0';
            notif.style.transition = 'opacity 0.3s';
            setTimeout(function() { notif.remove(); }, 300);
        }, 3000);
    }

});