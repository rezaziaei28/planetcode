// مدیریت صفحه تأیید کد ۶ رقمی
document.addEventListener('DOMContentLoaded', function() {
    // ========== تعریف متغیرها ==========
    const elements = {
        // فرم‌ها و بخش‌ها
        verifyForm: document.getElementById('verifyForm'),
        changePhoneModal: document.getElementById('changePhoneModal'),
        
        // عناصر OTP
        otpContainer: document.getElementById('otpContainer'),
        otpDigits: document.querySelectorAll('.otp-digit'),
        otpError: document.getElementById('otpError'),
        otpSuccess: document.getElementById('otpSuccess'),
        
        // نمایش اطلاعات
        phoneNumber: document.getElementById('phoneNumber'),
        phoneInfo: document.getElementById('phoneInfo'),
        timer: document.getElementById('timer'),
        
        // تایمرها
        resendBtn: document.getElementById('resendSMS'),
        resendTimer: document.getElementById('resendTimer'),
        voiceBtn: document.getElementById('voiceCall'),
        
        // دکمه‌ها
        verifyBtn: document.getElementById('verifyBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        backBtn: document.getElementById('backBtn'),
        editPhoneBtn: document.getElementById('editPhone'),
        
        // Modal تغییر شماره
        newPhoneInput: document.getElementById('newPhone'),
        closeModalBtn: document.getElementById('closeModal'),
        cancelChangeBtn: document.getElementById('cancelChange'),
        confirmChangeBtn: document.getElementById('confirmChange'),
        
        // بارگذاری
        loadingOverlay: document.getElementById('loadingOverlay')
    };

    // ========== متغیرهای وضعیت ==========
    let state = {
        // اطلاعات کاربر
        currentPhone: localStorage.getItem('verificationPhone') || '09123456789',
        verificationCode: localStorage.getItem('verificationCode') || '',
        isLoginFlow: localStorage.getItem('authFlow') === 'login',
        
        // تایمرها
        countdown: 120, // 2 دقیقه
        resendCountdown: 60, // 1 دقیقه برای ارسال مجدد
        countdownInterval: null,
        resendInterval: null,
        
        // وضعیت‌ها
        isResendDisabled: true,
        attempts: 0,
        maxAttempts: 5,
        lastResendTime: Date.now()
    };

    // ========== توابع کمکی ==========
    
    // فرمت شماره تلفن برای نمایش
    function formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length !== 11) return phone;
        
        return `۰${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }

    // ایجاد تایمر معکوس
    function startCountdown() {
        clearInterval(state.countdownInterval);
        
        state.countdownInterval = setInterval(() => {
            state.countdown--;
            
            if (state.countdown <= 0) {
                clearInterval(state.countdownInterval);
                elements.timer.textContent = '۰۰:۰۰';
                showError('کد منقضی شده است. لطفا مجددا درخواست کنید.');
                return;
            }
            
            const minutes = Math.floor(state.countdown / 60);
            const seconds = state.countdown % 60;
            elements.timer.textContent = 
                `${minutes.toString().padStart(2, '۰')}:${seconds.toString().padStart(2, '۰')}`;
        }, 1000);
    }

    // تایمر ارسال مجدد
    function startResendCountdown() {
        state.isResendDisabled = true;
        state.resendCountdown = 60;
        elements.resendBtn.disabled = true;
        
        clearInterval(state.resendInterval);
        
        state.resendInterval = setInterval(() => {
            state.resendCountdown--;
            elements.resendTimer.textContent = state.resendCountdown;
            
            if (state.resendCountdown <= 0) {
                clearInterval(state.resendInterval);
                state.isResendDisabled = false;
                elements.resendBtn.disabled = false;
                elements.resendBtn.innerHTML = '<i class="fas fa-redo"></i> ارسال مجدد پیامک';
            }
        }, 1000);
    }

    // تولید کد تأیید تصادفی
    function generateVerificationCode() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        state.verificationCode = code;
        localStorage.setItem('verificationCode', code);
        
        // برای تست - نمایش کد در کنسول
        console.log('کد تأیید تولید شده:', code);
        return code;
    }

    // شبیه‌سازی ارسال پیامک
    function sendVerificationSMS(phone) {
        return new Promise((resolve) => {
            // شبیه‌سازی تاخیر شبکه
            setTimeout(() => {
                const code = generateVerificationCode();
                
                // در واقعیت اینجا کد به سرور ارسال می‌شود
                console.log(`پیامک کد ${code} به شماره ${phone} ارسال شد`);
                
                // ذخیره اطلاعات در localStorage
                localStorage.setItem('verificationPhone', phone);
                localStorage.setItem('verificationTime', Date.now());
                
                resolve(true);
            }, 1500);
        });
    }

    // شبیه‌سازی تماس صوتی
    function sendVoiceCall(phone) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // کد را در تماس صوتی اعلام می‌کنیم
                console.log(`تماس صوتی برای شماره ${phone} - کد: ${state.verificationCode}`);
                resolve(true);
            }, 2000);
        });
    }

    // نمایش پیام خطا
    function showError(message) {
        elements.otpError.querySelector('span').textContent = message;
        elements.otpError.classList.add('show');
        elements.otpSuccess.classList.remove('show');
        
        // لرزش ورودی‌ها
        elements.otpDigits.forEach(digit => {
            digit.classList.add('error');
        });
        
        // پنهان کردن خطا بعد از ۳ ثانیه
        setTimeout(() => {
            elements.otpError.classList.remove('show');
            elements.otpDigits.forEach(digit => {
                digit.classList.remove('error');
            });
        }, 3000);
    }

    // نمایش پیام موفقیت
    function showSuccess() {
        elements.otpError.classList.remove('show');
        elements.otpSuccess.classList.add('show');
    }

    // ریست کردن ورودی‌های OTP
    function resetOTPInputs() {
        elements.otpDigits.forEach(digit => {
            digit.value = '';
            digit.classList.remove('filled');
        });
        elements.otpDigits[0].focus();
    }

    // بررسی صحت شماره تلفن
    function validatePhoneNumber(phone) {
        const regex = /^09[0-9]{9}$/;
        return regex.test(phone.replace(/\D/g, ''));
    }

    // نمایش صفحه بارگذاری
    function showLoading() {
        elements.loadingOverlay.classList.add('show');
        elements.verifyBtn.disabled = true;
    }

    // پنهان کردن صفحه بارگذاری
    function hideLoading() {
        elements.loadingOverlay.classList.remove('show');
        elements.verifyBtn.disabled = false;
    }

    // ========== مدیریت OTP ==========
    
    // تنظیم اولیه OTP
    elements.otpDigits.forEach((digit, index) => {
        // مدیریت ورود داده
        digit.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // فقط اعداد پذیرفته شود
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // اگر حذف شد
            if (value === '') {
                e.target.classList.remove('filled');
                return;
            }
            
            // پر کردن و رفتن به خانه بعدی
            e.target.classList.add('filled');
            
            if (index < elements.otpDigits.length - 1 && value) {
                elements.otpDigits[index + 1].focus();
            }
            
            // بررسی کد کامل
            if (index === elements.otpDigits.length - 1 && value) {
                verifyOTP();
            }
        });
        
        // مدیریت کلیدهای ویژه
        digit.addEventListener('keydown', (e) => {
            // رفتن به خانه قبلی با Backspace
            if (e.key === 'Backspace' && !digit.value && index > 0) {
                e.preventDefault();
                elements.otpDigits[index - 1].focus();
                elements.otpDigits[index - 1].select();
            }
            
            // رفتن به خانه بعدی با فلش‌ها
            if (e.key === 'ArrowRight' && index < elements.otpDigits.length - 1) {
                e.preventDefault();
                elements.otpDigits[index + 1].focus();
            }
            
            if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                elements.otpDigits[index - 1].focus();
            }
        });
        
        // پیست کردن کد کامل
        digit.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').trim();
            
            if (/^\d{6}$/.test(pastedData)) {
                const digits = pastedData.split('');
                elements.otpDigits.forEach((input, i) => {
                    if (digits[i]) {
                        input.value = digits[i];
                        input.classList.add('filled');
                    }
                });
                
                // تأیید خودکار
                setTimeout(verifyOTP, 100);
            }
        });
    });

    // بررسی کد OTP
    function verifyOTP() {
        const enteredCode = Array.from(elements.otpDigits)
            .map(digit => digit.value)
            .join('');
        
        if (enteredCode.length !== 6) {
            return;
        }
        
        state.attempts++;
        
        if (enteredCode === state.verificationCode) {
            // کد صحیح
            showSuccess();
            showLoading();
            
            // شبیه‌سازی ارسال به سرور
            setTimeout(() => {
                hideLoading();
                
                // تعیین مقصد براساس نوع عملیات
                let redirectUrl;
                if (state.isLoginFlow) {
                    redirectUrl = 'dashboard.html';
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userPhone', state.currentPhone);
                } else {
                    redirectUrl = 'signup-info.html'; // صفحه تکمیل اطلاعات ثبت‌نام
                }
                
                // نمایش پیام موفقیت و انتقال
                alert('کد با موفقیت تأیید شد! در حال انتقال...');
                window.location.href = redirectUrl;
                
            }, 2000);
            
        } else {
            // کد اشتباه
            if (state.attempts >= state.maxAttempts) {
                showError('تعداد تلاش‌های شما بیش از حد مجاز است. لطفا کد جدیدی دریافت کنید.');
                elements.verifyBtn.disabled = true;
                startResendCountdown();
            } else {
                showError(`کد وارد شده صحیح نیست. (${state.maxAttempts - state.attempts} تلاش باقی مانده)`);
                resetOTPInputs();
            }
        }
    }

    // ========== مدیریت Modal تغییر شماره ==========
    
    // باز کردن Modal
    elements.editPhoneBtn.addEventListener('click', () => {
        elements.changePhoneModal.classList.add('show');
        elements.newPhoneInput.value = state.currentPhone;
        elements.newPhoneInput.focus();
    });
    
    // بستن Modal
    elements.closeModalBtn.addEventListener('click', () => {
        elements.changePhoneModal.classList.remove('show');
    });
    
    elements.cancelChangeBtn.addEventListener('click', () => {
        elements.changePhoneModal.classList.remove('show');
    });
    
    // تغییر شماره
    elements.confirmChangeBtn.addEventListener('click', async () => {
        const newPhone = elements.newPhoneInput.value.trim();
        
        if (!validatePhoneNumber(newPhone)) {
            alert('لطفا شماره موبایل معتبر وارد کنید (مثال: 09123456789)');
            return;
        }
        
        if (newPhone === state.currentPhone) {
            alert('این شماره همان شماره قبلی است!');
            return;
        }
        
        showLoading();
        
        try {
            // ارسال کد جدید
            await sendVerificationSMS(newPhone);
            
            // بروزرسانی وضعیت
            state.currentPhone = newPhone;
            state.attempts = 0;
            state.countdown = 120;
            elements.verifyBtn.disabled = false;
            
            // بروزرسانی نمایش
            elements.phoneNumber.textContent = formatPhoneNumber(newPhone);
            elements.phoneInfo.textContent = 
                `کد تأیید ۶ رقمی به شماره ${formatPhoneNumber(newPhone)} ارسال شد`;
            
            // ریست OTP
            resetOTPInputs();
            
            // راه‌اندازی مجدد تایمرها
            startCountdown();
            startResendCountdown();
            
            // بستن Modal
            elements.changePhoneModal.classList.remove('show');
            
            alert(`کد تأیید جدید به شماره ${formatPhoneNumber(newPhone)} ارسال شد.`);
            
        } catch (error) {
            alert('خطا در ارسال کد تأیید. لطفا مجددا تلاش کنید.');
        } finally {
            hideLoading();
        }
    });

    // ========== مدیریت ارسال مجدد ==========
    
    elements.resendBtn.addEventListener('click', async () => {
        if (state.isResendDisabled) return;
        
        showLoading();
        
        try {
            await sendVerificationSMS(state.currentPhone);
            
            // راه‌اندازی مجدد تایمرها
            state.countdown = 120;
            startCountdown();
            startResendCountdown();
            
            // ریست OTP
            resetOTPInputs();
            
            alert('کد تأیید جدید ارسال شد.');
            
        } catch (error) {
            alert('خطا در ارسال مجدد کد. لطفا مجددا تلاش کنید.');
        } finally {
            hideLoading();
        }
    });
    
    // تماس صوتی
    elements.voiceBtn.addEventListener('click', async () => {
        showLoading();
        
        try {
            await sendVoiceCall(state.currentPhone);
            
            alert('تماس صوتی برقرار شد. کد تأیید را گوش دهید.');
            
        } catch (error) {
            alert('خطا در برقراری تماس صوتی. لطفا مجددا تلاش کنید.');
        } finally {
            hideLoading();
        }
    });

    // ========== مدیریت فرم ==========
    
    elements.verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        verifyOTP();
    });
    
    elements.cancelBtn.addEventListener('click', () => {
        if (confirm('آیا از انصراف اطمینان دارید؟ تمام اطلاعات ورودی از بین خواهند رفت.')) {
            window.location.href = state.isLoginFlow ? 'login.html' : 'signup.html';
        }
    });
    
    elements.backBtn.addEventListener('click', () => {
        window.location.href = state.isLoginFlow ? 'login.html' : 'signup.html';
    });

    // ========== مقداردهی اولیه ==========
    function initializePage() {
        // تنظیم شماره تلفن
        elements.phoneNumber.textContent = formatPhoneNumber(state.currentPhone);
        elements.phoneInfo.textContent = 
            `کد تأیید ۶ رقمی به شماره ${formatPhoneNumber(state.currentPhone)} ارسال شد`;
        
        // اگر کد قبلی وجود نداشت، یک کد جدید تولید کن
        if (!state.verificationCode) {
            generateVerificationCode();
        }
        
        // راه‌اندازی تایمرها
        startCountdown();
        startResendCountdown();
        
        // فوکوس روی اولین خانه OTP
        setTimeout(() => {
            elements.otpDigits[0].focus();
        }, 500);
        
        // تنظیم event listener برای کلیک خارج از Modal
        elements.changePhoneModal.addEventListener('click', (e) => {
            if (e.target === elements.changePhoneModal) {
                elements.changePhoneModal.classList.remove('show');
            }
        });
        
        // مدیریت کلید Esc برای بستن Modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.changePhoneModal.classList.contains('show')) {
                elements.changePhoneModal.classList.remove('show');
            }
        });
        
        // مدیریت رویداد تغییر در input شماره جدید
        elements.newPhoneInput.addEventListener('input', function() {
            // حذف کاراکترهای غیرعددی
            this.value = this.value.replace(/\D/g, '');
            
            // اضافه کردن ۰۹ در صورت نیاز
            if (this.value.length > 0 && !this.value.startsWith('09')) {
                this.value = '09' + this.value.replace(/^09/, '');
            }
            
            // محدود کردن به ۱۱ رقم
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
    }

    // ========== راه‌اندازی صفحه ==========
    initializePage();
});