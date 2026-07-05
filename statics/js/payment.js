// discount.js - مدیریت کدهای تخفیف
document.addEventListener('DOMContentLoaded', function() {
    // کدهای تخفیف معتبر
    const validDiscounts = {
        'WELCOME10': {
            type: 'percentage',
            value: 10,
            maxAmount: 500000,
            description: 'تخفیف ۱۰٪ ویژه کاربران جدید'
        },
        'PLANTCODE20': {
            type: 'percentage',
            value: 20,
            maxAmount: 1000000,
            description: 'تخفیف ۲۰٪ پلنت کد'
        },
        'SPECIAL30': {
            type: 'percentage',
            value: 30,
            maxAmount: 1500000,
            description: 'تخفیف ویژه ۳۰٪'
        },
        'SAVE50': {
            type: 'fixed',
            value: 50000,
            description: '۵۰,۰۰۰ تومان تخفیف'
        }
    };

    // ذخیره کدهای استفاده شده
    const usedDiscounts = JSON.parse(localStorage.getItem('used_discounts')) || [];

    // اعمال کد تخفیف
    window.applyDiscountCode = function() {
        const codeInput = document.getElementById('discountCode');
        const messageDiv = document.getElementById('discountMessage');
        
        if (!codeInput || !messageDiv) return;
        
        const code = codeInput.value.trim().toUpperCase();
        
        // بررسی خالی بودن
        if (!code) {
            showMessage('لطفاً کد تخفیف را وارد کنید', 'error');
            return;
        }
        
        // بررسی استفاده قبلی
        if (usedDiscounts.includes(code)) {
            showMessage('این کد تخفیف قبلاً استفاده شده است', 'error');
            return;
        }
        
        // بررسی معتبر بودن کد
        if (!validDiscounts[code]) {
            showMessage('کد تخفیف معتبر نیست', 'error');
            return;
        }
        
        // اعمال تخفیف
        const discount = validDiscounts[code];
        let discountValue = 0;
        let discountType = '';
        
        if (discount.type === 'percentage') {
            discountValue = calculateSubtotal() * (discount.value / 100);
            if (discount.maxAmount && discountValue > discount.maxAmount) {
                discountValue = discount.maxAmount;
            }
            discountType = `تخفیف ${discount.value}٪`;
        } else {
            discountValue = discount.value;
            discountType = `${formatPrice(discountValue)} تومان تخفیف`;
        }
        
        // ذخیره کد استفاده شده
        usedDiscounts.push(code);
        localStorage.setItem('used_discounts', JSON.stringify(usedDiscounts));
        
        // نمایش پیام موفقیت
        showMessage(`✅ ${discount.description} با موفقیت اعمال شد!`, 'success');
        
        // به‌روزرسانی UI
        updateDiscountUI(discountValue, discountType, code);
    };

    // محاسبه مبلغ کل سبد خرید
    function calculateSubtotal() {
        const cartItems = JSON.parse(localStorage.getItem('plantcode_cart')) || [];
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // نمایش پیام
    function showMessage(text, type) {
        const messageDiv = document.getElementById('discountMessage');
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = `discount-message small ${type}`;
            
            // پاک کردن بعد از 5 ثانیه
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'discount-message small';
            }, 5000);
        }
    }

    // به‌روزرسانی UI تخفیف
    function updateDiscountUI(amount, type, code) {
        // به‌روزرسانی مبلغ تخفیف
        const discountAmount = document.getElementById('discountAmount');
        if (discountAmount) {
            discountAmount.textContent = `-${formatPrice(amount)} تومان`;
            discountAmount.title = type;
        }
        
        // به‌روزرسانی مبلغ کل
        updateTotalPrice(amount);
        
        // غیرفعال کردن فیلد کد
        const codeInput = document.getElementById('discountCode');
        if (codeInput) {
            codeInput.disabled = true;
            codeInput.value = code;
        }
        
        // غیرفعال کردن دکمه اعمال
        const applyBtn = document.getElementById('applyDiscount');
        if (applyBtn) {
            applyBtn.disabled = true;
            applyBtn.innerHTML = '<i class="fas fa-check"></i> اعمال شد';
        }
    }

    // به‌روزرسانی مبلغ کل
    function updateTotalPrice(discountAmount) {
        const subtotal = calculateSubtotal();
        const total = subtotal - discountAmount;
        
        const totalPrice = document.getElementById('totalPrice');
        if (totalPrice) {
            totalPrice.textContent = `${formatPrice(total)} تومان`;
        }
    }

    // فرمت قیمت
    function formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price);
    }

    // تنظیم رویدادها
    const applyBtn = document.getElementById('applyDiscount');
    const codeInput = document.getElementById('discountCode');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyDiscountCode);
    }
    
    if (codeInput) {
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyDiscountCode();
            }
        });
    }
});