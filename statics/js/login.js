// مدیریت فرم ورود
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // نمایش/مخفی کردن رمز عبور
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' 
            ? '<i class="far fa-eye"></i>' 
            : '<i class="far fa-eye-slash"></i>';
    });
    
    // اعتبارسنجی ایمیل
    emailInput.addEventListener('blur', function() {
        if (!validateEmail(this.value)) {
            showError(emailError, this);
        } else {
            hideError(emailError, this);
        }
    });
    
    // اعتبارسنجی رمز عبور
    passwordInput.addEventListener('blur', function() {
        if (this.value.length < 8) {
            showError(passwordError, this);
        } else {
            hideError(passwordError, this);
        }
    });
    
    // ارسال فرم
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // بررسی ایمیل
        if (!validateEmail(emailInput.value)) {
            showError(emailError, emailInput);
            isValid = false;
        }
        
        // بررسی رمز عبور
        if (passwordInput.value.length < 8) {
            showError(passwordError, passwordInput);
            isValid = false;
        }
        
        if (isValid) {
            // شبیه‌سازی ارسال فرم
            const submitBtn = this.querySelector('.auth-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // در واقعیت اینجا درخواست AJAX ارسال می‌شود
                alert('ورود با موفقیت انجام شد!');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // ریدایرکت به صفحه اصلی
                // window.location.href = 'dashboard.html';
            }, 1500);
        }
    });
    
    // توابع کمکی
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showError(errorElement, inputElement) {
        errorElement.classList.add('show');
        inputElement.classList.add('error');
    }
    
    function hideError(errorElement, inputElement) {
        errorElement.classList.remove('show');
        inputElement.classList.remove('error');
    }
    
    // ورود با شبکه‌های اجتماعی
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'GitHub';
            alert(`ورود با ${provider} در حال توسعه است...`);
        });
    });
});