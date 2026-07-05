// مدیریت ثبت‌نام با شماره تلفن
document.addEventListener('DOMContentLoaded', function() {
    // فرم‌ها
    const phoneForm = document.querySelector('#signupPhoneForm');
    const verifyForm = document.querySelector('#signupVerifyForm');
    const infoForm = document.querySelector('#signupInfoForm');
    
    // عناصر فرم شماره
    const phoneInput = document.querySelector('#signupPhone');
    const phoneError = document.querySelector('#phoneError');
    const phoneDisplay = document.querySelector('#signupPhoneDisplay');
    
    // عناصر فرم تأیید
    const otpInputs = document.querySelectorAll('.otp-input');
    const verificationCodeInput = document.querySelector('#signupVerificationCode');
    const codeError = document.querySelector('#signupCodeError');
    const resendBtn = document.querySelector('#signupResendBtn');
    const countdownSpan = document.querySelector('#signupCountdown');
    const backToPhoneBtn = document.querySelector('#signupBackToPhone');
    
    // عناصر فرم اطلاعات
    const fullNameInput = document.querySelector('#fullName');
    const passwordInput = document.querySelector('#signupPassword');
    const togglePassword = document.querySelector('#togglePassword');
    const termsCheckbox = document.querySelector('#terms');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    
    // متغیرها
    let verificationCode = '';
    let countdown = 120;
    let countdownInterval;
    let currentPhone = '';
    let userData = {};
    
    // شبیه‌سازی ارسال پیامک
    function sendSMS(phone) {
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCodeInput.value = verificationCode;
        
        console.log(`کد تأیید ثبت‌نام برای ${phone}: ${verificationCode}`);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }
    
    // اعتبارسنجی شماره تلفن
    function validatePhone(phone) {
        const regex = /^09[0-9]{9}$/;
        return regex.test(phone);
    }
    
    // فرمت شماره تلفن برای نمایش
    function formatPhoneNumber(phone) {
        // حذف 0 اول اگر وجود دارد
        let cleanPhone = phone;
        if (cleanPhone.startsWith('0')) {
            cleanPhone = cleanPhone.substring(1);
        }
        
        // فرمت: +98 XXX XXX XXXX
        return `+98 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
    }
    
    // نمایش فرم تأیید
    function showVerificationForm(phone) {
        currentPhone = phone;
        phoneDisplay.textContent = formatPhoneNumber(phone);
        userData.phone = phone;
        
        phoneForm.style.display = 'none';
        verifyForm.style.display = 'block';
        
        startCountdown();
        
        setTimeout(() => {
            otpInputs[0].focus();
        }, 300);
    }
    
    // نمایش فرم اطلاعات
    function showInfoForm() {
        verifyForm.style.display = 'none';
        infoForm.style.display = 'block';
        
        setTimeout(() => {
            fullNameInput.focus();
        }, 300);
    }
    
    // بازگشت به فرم شماره
    function showPhoneForm() {
        verifyForm.style.display = 'none';
        phoneForm.style.display = 'block';
        clearInterval(countdownInterval);
        resendBtn.disabled = false;
        countdown = 120;
        countdownSpan.textContent = countdown;
        
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
        
        phoneInput.focus();
    }
    
    // شروع تایمر
    function startCountdown() {
        resendBtn.disabled = true;
        countdown = 120;
        countdownSpan.textContent = countdown;
        
        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            countdown--;
            countdownSpan.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                resendBtn.disabled = false;
                resendBtn.innerHTML = 'ارسال مجدد';
            }
        }, 1000);
    }
    
    // مدیریت OTP inputs - اصلاح شده برای LTR
    otpInputs.forEach((input, index) => {
        // تنظیم جهت متن برای نمایش اعداد به صورت صحیح
        input.style.direction = 'ltr';
        input.style.textAlign = 'center';
        input.style.fontFamily = 'monospace';
        
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // فقط اعداد مجاز هستند
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // اگر بیش از یک عدد وارد شده، فقط آخرین عدد را بگیر
            if (value.length > 1) {
                e.target.value = value.slice(-1);
            }
            
            if (e.target.value) {
                e.target.classList.add('filled');
                
                // رفتن به خانه بعدی
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            } else {
                e.target.classList.remove('filled');
            }
            
            // اگر آخرین خانه پر شده، بررسی کد
            if (index === otpInputs.length - 1 && e.target.value) {
                verifyCode();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                if (!e.target.value && index > 0) {
                    // اگر خانه خالی است، به خانه قبلی برو
                    otpInputs[index - 1].focus();
                    otpInputs[index - 1].value = '';
                    otpInputs[index - 1].classList.remove('filled');
                } else if (e.target.value) {
                    // اگر خانه پر است، آن را خالی کن
                    e.target.value = '';
                    e.target.classList.remove('filled');
                }
                e.preventDefault();
            }
            
            // پشتیبانی از کلیدهای جهت‌دار
            if (e.key === 'ArrowLeft' && index > 0) {
                otpInputs[index - 1].focus();
                e.preventDefault();
            }
            if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
                e.preventDefault();
            }
        });
        
        input.addEventListener('focus', (e) => {
            e.target.select();
        });
        
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const numbers = pastedData.replace(/\D/g, '').split('');
            
            // پر کردن خانه‌ها با اعداد کپی شده
            numbers.forEach((num, idx) => {
                if (idx < otpInputs.length) {
                    otpInputs[idx].value = num;
                    otpInputs[idx].classList.add('filled');
                }
            });
            
            // فوکوس به آخرین خانه پر شده
            const lastFilledIndex = Math.min(numbers.length - 1, otpInputs.length - 1);
            if (lastFilledIndex < otpInputs.length - 1) {
                otpInputs[lastFilledIndex + 1].focus();
            }
            
            // اگر 6 عدد وارد شده، بررسی کن
            if (numbers.length >= 6) {
                setTimeout(verifyCode, 100);
            }
        });
    });
    
    // بررسی کد تأیید
    function verifyCode() {
        const enteredCode = Array.from(otpInputs)
            .map(input => input.value)
            .join('');
        
        if (enteredCode.length === 6) {
            if (enteredCode === verificationCode) {
                codeError.classList.remove('show');
                otpInputs.forEach(input => {
                    input.classList.remove('error');
                });
                showInfoForm();
            } else {
                codeError.classList.add('show');
                otpInputs.forEach(input => {
                    input.classList.add('error');
                });
                
                verifyForm.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    verifyForm.style.animation = '';
                }, 500);
            }
        }
    }
    
    // بررسی قدرت رمز عبور
    function checkPasswordStrength(password) {
        if (!password) {
            strengthMeter.className = 'strength-meter';
            strengthText.textContent = '';
            return 'empty';
        }
        
        let strength = 0;
        let text = '';
        
        if (password.length >= 6) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        strengthMeter.className = 'strength-meter';
        
        if (strength <= 1) {
            strengthMeter.classList.add('weak');
            text = 'ضعیف';
            strengthText.style.color = 'var(--auth-error)';
        } else if (strength === 2) {
            strengthMeter.classList.add('medium');
            text = 'متوسط';
            strengthText.style.color = 'var(--auth-warning)';
        } else {
            strengthMeter.classList.add('strong');
            text = 'قوی';
            strengthText.style.color = 'var(--auth-success)';
        }
        
        strengthText.textContent = text;
        return strength;
    }
    
    // نمایش/مخفی کردن رمز عبور
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' 
            ? '<i class="far fa-eye"></i>' 
            : '<i class="far fa-eye-slash"></i>';
    });
    
    // ارسال فرم شماره تلفن
    phoneForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = phoneInput.value.trim();
        
        if (!validatePhone(phone)) {
            phoneError.classList.add('show');
            phoneInput.classList.add('error');
            return;
        }
        
        phoneError.classList.remove('show');
        phoneInput.classList.remove('error');
        
        const submitBtn = this.querySelector('.auth-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        sendSMS(phone).then(success => {
            if (success) {
                showVerificationForm(phone);
            }
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    });
    
    // ارسال مجدد کد
    resendBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        this.classList.add('loading');
        this.disabled = true;
        
        sendSMS(currentPhone).then(success => {
            if (success) {
                startCountdown();
                alert('کد تأیید جدید ارسال شد.');
            }
            this.classList.remove('loading');
        });
    });
    
    // تغییر شماره
    backToPhoneBtn.addEventListener('click', showPhoneForm);
    
    // بررسی رمز عبور در حین تایپ
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
    
    // ارسال فرم اطلاعات
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // اعتبارسنجی نام
        if (fullNameInput.value.trim().length < 3) {
            showError('nameError', 'لطفا نام کامل خود را وارد کنید');
            fullNameInput.classList.add('error');
            return;
        }
        
        // اعتبارسنجی رمز عبور
        if (passwordInput.value.length < 6) {
            showError('passwordError', 'رمز عبور باید حداقل ۶ کاراکتر باشد');
            passwordInput.classList.add('error');
            return;
        }
        
        // اعتبارسنجی قوانین
        if (!termsCheckbox.checked) {
            showError('termsError', 'لطفا قوانین را بپذیرید');
            return;
        }
        
        // جمع‌آوری اطلاعات کاربر
        userData.fullName = fullNameInput.value.trim();
        userData.password = passwordInput.value;
        userData.newsletter = document.getElementById('newsletter').checked;
        userData.createdAt = new Date().toISOString();
        
        // ارسال اطلاعات به سرور
        const submitBtn = this.querySelector('.auth-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // ذخیره در localStorage (برای نمونه)
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // ذخیره در لیست کاربران
            let users = JSON.parse(localStorage.getItem('users') || '{}');
            users[userData.phone] = userData;
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('ثبت‌نام با موفقیت انجام شد! خوش آمدید.');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // ریدایرکت به پنل کاربری
            // window.location.href = 'dashboard.html';
        }, 2000);
    });
    
    // اعتبارسنجی در حین تایپ
    fullNameInput.addEventListener('input', function() {
        if (this.value.trim().length >= 3) {
            hideError('nameError');
            this.classList.remove('error');
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.value.length >= 6) {
            hideError('passwordError');
            this.classList.remove('error');
        }
    });
    
    termsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            hideError('termsError');
        }
    });
    
    // توابع کمکی
    function showError(id, message) {
        const element = document.getElementById(id);
        element.textContent = message;
        element.classList.add('show');
    }
    
    function hideError(id) {
        const element = document.getElementById(id);
        element.classList.remove('show');
    }
    
    // شماره تست برای توسعه
    phoneInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            this.value = '09123456789';
            phoneForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // تنظیم جهت برای فیلدهای عددی
    phoneInput.style.direction = 'ltr';
    phoneInput.style.textAlign = 'left';
});