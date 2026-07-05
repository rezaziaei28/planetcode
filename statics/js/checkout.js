// checkout-main.js - پیشرفته
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 صفحه پرداخت پلنت کد بارگذاری شد');
    
    // متغیرهای اصلی
    let cartItems = JSON.parse(localStorage.getItem('plantcode_cart')) || [];
    let selectedGateway = 'zarinpal';
    let discountCode = null;
    let discountAmount = 0;
    let subtotal = 0;
    let timerInterval;
    let paymentTimer = 15 * 60; // 15 دقیقه
    
    // عناصر DOM
    const elements = {
        cartContainer: document.getElementById('cartItemsContainer'),
        cartCount: document.getElementById('cartCount'),
        suggestedCourses: document.getElementById('suggestedCourses'),
        subtotalPrice: document.getElementById('subtotalPrice'),
        discountAmount: document.getElementById('discountAmount'),
        totalPrice: document.getElementById('totalPrice'),
        paymentAmount: document.getElementById('paymentAmount'),
        discountCode: document.getElementById('discountCode'),
        applyDiscount: document.getElementById('applyDiscount'),
        discountMessage: document.getElementById('discountMessage'),
        termsAgreement: document.getElementById('termsAgreement'),
        termsAlert: document.getElementById('termsAlert'),
        finalPayment: document.getElementById('finalPayment'),
        clearCart: document.getElementById('clearCart'),
        savingsAmount: document.getElementById('savingsAmount'),
        orderNumber: document.getElementById('orderNumber'),
        paymentTimer: document.getElementById('paymentTimer')
    };
    
    // 1. بارگذاری اولیه
    init();
    
    function init() {
        // تنظیم شماره سفارش تصادفی
        elements.orderNumber.textContent = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        
        // بارگذاری سبد خرید
        loadCartItems();
        
        // بارگذاری دوره‌های پیشنهادی
        loadSuggestedCourses();
        
        // راه‌اندازی Swiper
        initSwiper();
        
        // شروع تایمر پرداخت
        startPaymentTimer();
        
        // تنظیم رویدادها
        setupEventListeners();
        
        // به‌روزرسانی قیمت‌ها
        updatePrices();
    }
    
    // 2. بارگذاری سبد خرید
    function loadCartItems() {
        if (!elements.cartContainer) return;
        
        // به‌روزرسانی تعداد
        elements.cartCount.textContent = `${cartItems.length} دوره`;
        
        if (cartItems.length === 0) {
            elements.cartContainer.innerHTML = `
                <div class="empty-cart-state">
                    <div class="empty-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>سبد خرید شما خالی است</h3>
                    <p>هنوز دوره‌ای به سبد خرید اضافه نکرده‌اید</p>
                    <a href="../pages/every-course.html" class="btn btn-gradient">
                        <i class="fas fa-shopping-bag"></i>
                        مشاهده دوره‌ها
                    </a>
                </div>
            `;
            return;
        }
        
        let html = '';
        subtotal = 0;
        
        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item animate__animated animate__fadeIn" style="animation-delay: ${index * 0.1}s">
                    <div class="course-image">
                        <img src="${item.image || '../img/default-course.jpg'}" alt="${item.title}">
                        <span class="course-badge">${item.badge || 'تخصصی'}</span>
                    </div>
                    
                    <div class="course-info">
                        <h3 class="course-title">${item.title}</h3>
                        <div class="course-meta">
                            <span class="instructor">
                                <i class="fas fa-user"></i>
                                ${item.instructor || 'محمدرضا ضیایی'}
                            </span>
                            <span class="rating">
                                <i class="fas fa-star"></i>
                                ${item.rating || '5.0'}
                            </span>
                        </div>
                        <div class="course-price">${formatPrice(itemTotal)} تومان</div>
                    </div>
                    
                    <div class="course-actions">
                        <div class="quantity-control">
                            <button class="qty-btn minus" onclick="updateQuantity(${index}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn plus" onclick="updateQuantity(${index}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        
                        <button class="remove-btn" onclick="removeItem(${index})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        elements.cartContainer.innerHTML = html;
    }
    
    // 3. بارگذاری دوره‌های پیشنهادی
    function loadSuggestedCourses() {
        if (!elements.suggestedCourses) return;
        
        const courses = [
            {
                id: 101,
                title: 'دوره متخصص React + Next.js',
                instructor: 'محمدرضا ضیایی',
                price: 4200000,
                originalPrice: 5200000,
                image: '../img/React.jpeg',
                rating: '5.0',
                badge: 'پرفروش'
            },
            {
                id: 102,
                title: 'هوش مصنوعی کاربردی با Python',
                instructor: 'محمدرضا ضیایی',
                price: 3800000,
                originalPrice: 4800000,
                image: '../img/python.jpeg',
                rating: '4.9',
                badge: 'جدید'
            },
            {
                id: 103,
                title: 'امنیت سایبری پیشرفته',
                instructor: 'محمدرضا ضیایی',
                price: 3500000,
                originalPrice: 4500000,
                image: '../img/hacker.jpg',
                rating: '4.8',
                badge: 'تخصصی'
            },
            {
                id: 104,
                title: 'توسعه بک‌اند با Node.js',
                instructor: 'محمدرضا ضیایی',
                price: 3200000,
                originalPrice: 4000000,
                image: '../img/Nestjs.jpeg',
                rating: '5.0',
                badge: 'پروژه‌محور'
            }
        ];
        
        let html = '';
        courses.forEach(course => {
            const discountPercent = Math.round((1 - course.price / course.originalPrice) * 100);
            
            html += `
                <div class="swiper-slide">
                    <div class="suggested-course">
                        <div class="suggested-course-image">
                            <img src="${course.image}" alt="${course.title}">
                            <span class="suggested-course-badge">${course.badge}</span>
                        </div>
                        <div class="suggested-course-content">
                            <h3 class="suggested-course-title">${course.title}</h3>
                            <div class="suggested-course-meta">
                                <span class="suggested-instructor">
                                    <i class="fas fa-user"></i>
                                    ${course.instructor}
                                </span>
                                <span class="suggested-rating">
                                    <i class="fas fa-star"></i>
                                    ${course.rating}
                                </span>
                            </div>
                            <div class="suggested-price">
                                <span class="current-price">${formatPrice(course.price)} تومان</span>
                                <span class="original-price">${formatPrice(course.originalPrice)}</span>
                                <span class="discount-badge">${discountPercent}٪</span>
                            </div>
                            <button class="suggested-add-btn" onclick="addToCart(${course.id})">
                                <i class="fas fa-plus"></i>
                                افزودن به سبد
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        elements.suggestedCourses.innerHTML = html;
    }
    
    // 4. تنظیم Swiper
    function initSwiper() {
        if (typeof Swiper === 'undefined') return;
        
        const swiper = new Swiper('.suggested-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });
    }
    
    // 5. به‌روزرسانی قیمت‌ها
    function updatePrices() {
        // محاسبه قیمت‌ها
        const tax = subtotal * 0.09; // 9% مالیات
        const total = subtotal + tax - discountAmount;
        const savings = discountAmount + (subtotal * 0.2); // 20% تخفیف ویژه
        
        // به‌روزرسانی UI
        elements.subtotalPrice.textContent = `${formatPrice(subtotal)} تومان`;
        elements.discountAmount.textContent = discountAmount > 0 ? `-${formatPrice(discountAmount)} تومان` : '۰ تومان';
        elements.totalPrice.textContent = `${formatPrice(total)} تومان`;
        elements.paymentAmount.textContent = `مبلغ: ${formatPrice(total)} تومان`;
        elements.savingsAmount.textContent = formatPrice(savings);
        
        // فعال/غیرفعال کردن دکمه پرداخت
        updatePaymentButton();
    }
    
    // 6. به‌روزرسانی دکمه پرداخت
    function updatePaymentButton() {
        const isCartEmpty = cartItems.length === 0;
        const isTermsAgreed = elements.termsAgreement.checked;
        
        elements.finalPayment.disabled = isCartEmpty || !isTermsAgreed;
        
        // نمایش/مخفی کردن اعلان
        if (!isTermsAgreed && !isCartEmpty) {
            elements.termsAlert.style.display = 'flex';
        } else {
            elements.termsAlert.style.display = 'none';
        }
    }
    
    // 7. شروع تایمر پرداخت
    function startPaymentTimer() {
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            if (paymentTimer <= 0) {
                clearInterval(timerInterval);
                showToast('زمان پرداخت شما به پایان رسید!', 'error');
                return;
            }
            
            paymentTimer--;
            
            const minutes = Math.floor(paymentTimer / 60);
            const seconds = paymentTimer % 60;
            
            elements.paymentTimer.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // تغییر رنگ در 5 دقیقه آخر
            if (paymentTimer <= 300) {
                elements.paymentTimer.parentElement.style.background = 'rgba(239, 68, 68, 0.2)';
                elements.paymentTimer.style.color = 'var(--danger)';
            }
        }, 1000);
    }
    
    // 8. تنظیم رویدادها
    function setupEventListeners() {
        // اعمال کد تخفیف
        if (elements.applyDiscount) {
            elements.applyDiscount.addEventListener('click', applyDiscount);
        }
        
        if (elements.discountCode) {
            elements.discountCode.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') applyDiscount();
            });
        }
        
        // تغییر شرایط و قوانین
        if (elements.termsAgreement) {
            elements.termsAgreement.addEventListener('change', updatePaymentButton);
        }
        
        // پرداخت نهایی
        if (elements.finalPayment) {
            elements.finalPayment.addEventListener('click', processPayment);
        }
        
        // پاک کردن سبد خرید
        if (elements.clearCart) {
            elements.clearCart.addEventListener('click', clearCart);
        }
        
        // انتخاب درگاه پرداخت
        document.querySelectorAll('.gateway-card').forEach(card => {
            card.addEventListener('click', () => {
                // حذف انتخاب قبلی
                document.querySelectorAll('.gateway-card').forEach(c => {
                    c.classList.remove('active');
                });
                
                // انتخاب جدید
                card.classList.add('active');
                selectedGateway = card.dataset.gateway;
                
                // نمایش پیام
                showToast(`درگاه ${getGatewayName(selectedGateway)} انتخاب شد`, 'success');
            });
        });
    }
    
    // 9. اعمال کد تخفیف
    function applyDiscount() {
        const code = elements.discountCode.value.trim().toUpperCase();
        
        if (!code) {
            showDiscountMessage('لطفاً کد تخفیف را وارد کنید', 'error');
            return;
        }
        
        // کدهای تخفیف معتبر
        const validCodes = {
            'PLANTCODE30': 0.3,  // 30% تخفیف
            'WELCOME20': 0.2,    // 20% تخفیف
            'SPECIAL15': 0.15,   // 15% تخفیف
            'SAVE500K': 500000   // 500,000 تومان تخفیف
        };
        
        if (!validCodes[code]) {
            showDiscountMessage('کد تخفیف معتبر نیست', 'error');
            return;
        }
        
        // محاسبه تخفیف
        const discountValue = validCodes[code];
        let discount = 0;
        
        if (discountValue <= 1) {
            // تخفیف درصدی
            discount = subtotal * discountValue;
        } else {
            // تخفیف ثابت
            discount = Math.min(discountValue, subtotal * 0.5); // حداکثر 50% قیمت
        }
        
        discountAmount = discount;
        discountCode = code;
        
        // به‌روزرسانی UI
        showDiscountMessage(`✅ کد تخفیف با موفقیت اعمال شد! ${formatPrice(discount)} تومان تخفیف`, 'success');
        updatePrices();
        
        // غیرفعال کردن فیلد
        elements.discountCode.disabled = true;
        elements.applyDiscount.disabled = true;
        elements.applyDiscount.innerHTML = '<i class="fas fa-check"></i> اعمال شد';
    }
    
    // 10. پرداخت نهایی
    async function processPayment() {
        if (cartItems.length === 0) {
            showToast('سبد خرید شما خالی است!', 'error');
            return;
        }
        
        if (!elements.termsAgreement.checked) {
            showToast('لطفاً شرایط و قوانین را تأیید کنید', 'warning');
            return;
        }
        
        // غیرفعال کردن دکمه
        elements.finalPayment.disabled = true;
        elements.finalPayment.innerHTML = `
            <div class="btn-content">
                <div class="btn-icon">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="btn-text">
                    <span class="btn-title">در حال پرداخت...</span>
                    <span class="btn-subtitle">لطفاً صبر کنید</span>
                </div>
            </div>
        `;
        
        // شبیه‌سازی پرداخت
        setTimeout(async () => {
            try {
                // ایجاد سفارش
                const order = createOrder();
                
                // ذخیره سفارش
                saveOrder(order);
                
                // خالی کردن سبد خرید
                cartItems = [];
                localStorage.setItem('plantcode_cart', JSON.stringify(cartItems));
                
                // به‌روزرسانی UI
                showSuccessPayment(order);
                
                // نمایش پیام موفقیت
                showToast('✅ پرداخت با موفقیت انجام شد!', 'success');
                
            } catch (error) {
                console.error('خطا در پرداخت:', error);
                showToast('خطا در پرداخت، لطفاً دوباره تلاش کنید', 'error');
                
                // فعال کردن مجدد دکمه
                elements.finalPayment.disabled = false;
                elements.finalPayment.innerHTML = `
                    <div class="btn-content">
                        <div class="btn-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="btn-text">
                            <span class="btn-title">پرداخت نهایی</span>
                            <span class="btn-subtitle" id="paymentAmount">${elements.paymentAmount.textContent}</span>
                        </div>
                        <div class="btn-arrow">
                            <i class="fas fa-arrow-left"></i>
                        </div>
                    </div>
                `;
            }
        }, 2000);
    }
    
    // 11. ایجاد سفارش
    function createOrder() {
        const tax = subtotal * 0.09;
        const total = subtotal + tax - discountAmount;
        
        return {
            id: `PLANT${Date.now()}`,
            items: [...cartItems],
            subtotal: subtotal,
            tax: tax,
            discount: discountAmount,
            total: total,
            gateway: selectedGateway,
            discountCode: discountCode,
            date: new Date().toLocaleString('fa-IR'),
            status: 'paid'
        };
    }
    
    // 12. ذخیره سفارش
    function saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('plantcode_orders')) || [];
        orders.push(order);
        localStorage.setItem('plantcode_orders', JSON.stringify(orders));
        
        // ارسال به سرور (در پروژه واقعی)
        console.log('سفارش ذخیره شد:', order);
    }
    
    // 13. نمایش موفقیت پرداخت
    function showSuccessPayment(order) {
        const successHTML = `
            <div class="empty-cart-state animate__animated animate__fadeIn">
                <div class="empty-icon">
                    <i class="fas fa-check-circle text-success"></i>
                </div>
                <h3>پرداخت با موفقیت انجام شد!</h3>
                <p>سفارش شما با شماره <strong>${order.id}</strong> ثبت شد.</p>
                
                <div class="order-summary" style="margin: 30px 0; text-align: left; max-width: 400px; margin: 30px auto;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>مبلغ پرداختی:</span>
                        <strong>${formatPrice(order.total)} تومان</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>روش پرداخت:</span>
                        <span>${getGatewayName(order.gateway)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>تاریخ:</span>
                        <span>${order.date}</span>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; margin-top: 30px;">
                    <a href="../index.html" class="btn btn-gradient">
                        <i class="fas fa-home"></i>
                        بازگشت به خانه
                    </a>
                    <button class="btn" style="background: var(--dark-lighter); color: var(--text);" onclick="printOrder()">
                        <i class="fas fa-print"></i>
                        چاپ فاکتور
                    </button>
                </div>
            </div>
        `;
        
        elements.cartContainer.innerHTML = successHTML;
        elements.finalPayment.style.display = 'none';
        elements.clearCart.style.display = 'none';
    }
    
    // 14. پاک کردن سبد خرید
    function clearCart() {
        if (cartItems.length === 0) return;
        
        if (confirm('آیا از پاک کردن همه آیتم‌های سبد خرید مطمئن هستید؟')) {
            cartItems = [];
            localStorage.setItem('plantcode_cart', JSON.stringify(cartItems));
            
            // به‌روزرسانی UI
            loadCartItems();
            updatePrices();
            updateCartCount();
            
            showToast('سبد خرید پاک شد', 'success');
        }
    }
    
    // 15. نمایش پیام تخفیف
    function showDiscountMessage(message, type) {
        elements.discountMessage.textContent = message;
        elements.discountMessage.className = `coupon-message ${type}`;
        
        // پاک کردن پیام بعد از 5 ثانیه
        setTimeout(() => {
            elements.discountMessage.textContent = '';
            elements.discountMessage.className = 'coupon-message';
        }, 5000);
    }
    
    // 16. نمایش Toast
    function showToast(message, type = 'info') {
        // حذف toast قبلی
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        // ایجاد toast جدید
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // نمایش
        setTimeout(() => toast.classList.add('show'), 100);
        
        // حذف بعد از 4 ثانیه
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 4000);
    }
    
    // 17. توابع کمکی
    function formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(Math.round(price));
    }
    
    function getGatewayName(gateway) {
        const names = {
            'zarinpal': 'زرین‌پال',
            'wallet': 'کیف پول',
            'mellat': 'ملت',
            'saman': 'سامان'
        };
        return names[gateway] || gateway;
    }
    
    function updateCartCount() {
        const cartIndicator = document.querySelector('.cart-count');
        if (cartIndicator) {
            cartIndicator.textContent = cartItems.length;
        }
    }
    
    // 18. توابع عمومی برای استفاده در HTML
    window.updateQuantity = function(index, change) {
        if (!cartItems[index]) return;
        
        const newQuantity = cartItems[index].quantity + change;
        if (newQuantity < 1) {
            removeItem(index);
            return;
        }
        
        cartItems[index].quantity = newQuantity;
        localStorage.setItem('plantcode_cart', JSON.stringify(cartItems));
        
        loadCartItems();
        updatePrices();
        updateCartCount();
        
        showToast(`تعداد به ${newQuantity} تغییر کرد`, 'success');
    };
    
    window.removeItem = function(index) {
        if (!cartItems[index]) return;
        
        if (confirm('آیا از حذف این دوره مطمئن هستید؟')) {
            const removedItem = cartItems.splice(index, 1)[0];
            localStorage.setItem('plantcode_cart', JSON.stringify(cartItems));
            
            loadCartItems();
            updatePrices();
            updateCartCount();
            
            showToast(`"${removedItem.title}" از سبد خرید حذف شد`, 'success');
        }
    };
    
    window.addToCart = function(courseId) {
        // یافتن دوره در لیست پیشنهادی
        const course = {
            id: courseId,
            title: 'دوره متخصص React + Next.js',
            instructor: 'محمدرضا ضیایی',
            price: 4200000,
            image: '../img/React.jpeg',
            badge: 'پرفروش',
            quantity: 1
        };
        
        // بررسی وجود دوره در سبد
        const existingIndex = cartItems.findIndex(item => item.id === courseId);
        
        if (existingIndex > -1) {
            // افزایش تعداد
            cartItems[existingIndex].quantity++;
        } else {
            // افزودن جدید
            cartItems.push(course);
        }
        
        localStorage.setItem('plantcode_cart', JSON.stringify(cartItems));
        
        // به‌روزرسانی UI
        loadCartItems();
        updatePrices();
        updateCartCount();
        
        showToast('دوره به سبد خرید اضافه شد!', 'success');
    };
    
    window.printOrder = function() {
        window.print();
    };
    
    // 19. مدیریت تم (مستقل)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('plantcode_theme', isLight ? 'light' : 'dark');
            
            // تغییر آیکون
            const icon = this.querySelector('i');
            icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        });
        
        // بارگذاری تم ذخیره شده
        const savedTheme = localStorage.getItem('plantcode_theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            const icon = themeToggle.querySelector('i');
            icon.className = 'fas fa-sun';
        }
    }
    
    // 20. توقف تایمر هنگام ترک صفحه
    window.addEventListener('beforeunload', () => {
        clearInterval(timerInterval);
    });
});

