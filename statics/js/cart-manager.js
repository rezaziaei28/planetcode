// cart-manager.js
document.addEventListener('DOMContentLoaded', function() {
    // مدیریت سبد خرید
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartCount = document.getElementById('cartCount');
    const subtotalPrice = document.getElementById('subtotalPrice');
    const discountAmount = document.getElementById('discountAmount');
    const totalPrice = document.getElementById('totalPrice');
    const finalPayment = document.getElementById('finalPayment');
    const termsAgreement = document.getElementById('termsAgreement');

    // نمونه سبد خرید (در واقعیت از localStorage یا API می‌آید)
    let cartItems = JSON.parse(localStorage.getItem('plantcode_cart')) || [];
    let discountRate = 0;

    // بارگذاری سبد خرید
    function loadCartItems() {
        if (!cartItemsContainer) return;
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart text-center py-5">
                    <i class="fas fa-shopping-cart fa-4x mb-3 text-muted"></i>
                    <h4 class="text-muted">سبد خرید شما خالی است</h4>
                    <p class="text-muted mb-4">هنوز دوره‌ای به سبد خرید اضافه نکرده‌اید</p>
                    <a href="../pages/every-course.html" class="btn btn-primary">
                        <i class="fas fa-shopping-bag me-2"></i>
                        مشاهده دوره‌ها
                    </a>
                </div>
            `;
            cartCount.textContent = '0 دوره';
            updatePaymentSummary();
            return;
        }

        let html = '';
        let total = 0;

        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            html += `
                <div class="cart-item-checkout" data-id="${item.id}">
                    <div class="course-image-checkout">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    
                    <div class="course-info-checkout">
                        <h3>${item.title}</h3>
                        <div class="course-instructor-checkout">
                            <i class="fas fa-user"></i>
                            <span>${item.instructor}</span>
                        </div>
                        <div class="course-price-checkout">
                            ${formatPrice(itemTotal)} تومان
                        </div>
                    </div>
                    
                    <div class="course-actions-checkout">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        
                        <button class="remove-item-checkout" onclick="removeItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        cartCount.textContent = `${cartItems.length} دوره`;
        updatePaymentSummary();
    }

    // فرمت قیمت
    function formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price);
    }

    // بروزرسانی تعداد
    window.updateQuantity = function(index, change) {
        if (cartItems[index]) {
            const newQuantity = cartItems[index].quantity + change;
            if (newQuantity < 1) {
                removeItem(index);
                return;
            }
            
            cartItems[index].quantity = newQuantity;
            saveCart();
            loadCartItems();
        }
    }

    // حذف آیتم
    window.removeItem = function(index) {
        if (confirm('آیا از حذف این دوره مطمئن هستید؟')) {
            cartItems.splice(index, 1);
            saveCart();
            loadCartItems();
            
            // به‌روزرسانی شمارنده در هدر
            updateHeaderCartCount();
        }
    }

    // ذخیره سبد خرید
    function saveCart() {
        localStorage.setItem('plantcode_cart', JSON.stringify(cartItems));
    }

    // به‌روزرسانی خلاصه پرداخت
    function updatePaymentSummary() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * discountRate;
        const total = subtotal - discount;
        
        subtotalPrice.textContent = `${formatPrice(subtotal)} تومان`;
        discountAmount.textContent = `${formatPrice(discount)} تومان`;
        totalPrice.textContent = `${formatPrice(total)} تومان`;
        
        // فعال/غیرفعال کردن دکمه پرداخت
        updatePaymentButton();
    }

    // فعال کردن دکمه پرداخت
    function updatePaymentButton() {
        if (cartItems.length > 0 && termsAgreement.checked) {
            finalPayment.disabled = false;
        } else {
            finalPayment.disabled = true;
        }
    }

    // به‌روزرسانی شمارنده در هدر
    function updateHeaderCartCount() {
        const headerCartCount = document.querySelector('.cart-count');
        if (headerCartCount) {
            headerCartCount.textContent = cartItems.length;
        }
    }

    // اعمال کد تخفیف
    window.applyDiscount = function(code) {
        // کدهای تخفیف نمونه
        const discountCodes = {
            'PLANTCODE10': 0.1,  // 10% تخفیف
            'WELCOME20': 0.2,    // 20% تخفیف
            'SPECIAL30': 0.3     // 30% تخفیف
        };

        if (discountCodes[code]) {
            discountRate = discountCodes[code];
            updatePaymentSummary();
            showDiscountMessage('کد تخفیف با موفقیت اعمال شد!', 'success');
        } else {
            showDiscountMessage('کد تخفیف معتبر نیست!', 'error');
        }
    }

    // نمایش پیام تخفیف
    function showDiscountMessage(message, type) {
        const discountMessage = document.getElementById('discountMessage');
        if (discountMessage) {
            discountMessage.textContent = message;
            discountMessage.className = `discount-message small ${type}`;
            
            // پاک کردن پیام بعد از 5 ثانیه
            setTimeout(() => {
                discountMessage.textContent = '';
                discountMessage.className = 'discount-message small';
            }, 5000);
        }
    }

    // رویداد دکمه اعمال تخفیف
    const applyDiscountBtn = document.getElementById('applyDiscount');
    const discountCodeInput = document.getElementById('discountCode');
    
    if (applyDiscountBtn && discountCodeInput) {
        applyDiscountBtn.addEventListener('click', function() {
            const code = discountCodeInput.value.trim().toUpperCase();
            if (code) {
                applyDiscount(code);
            }
        });
        
        discountCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const code = discountCodeInput.value.trim().toUpperCase();
                if (code) {
                    applyDiscount(code);
                }
            }
        });
    }

    // رویداد توافق‌نامه
    if (termsAgreement) {
        termsAgreement.addEventListener('change', updatePaymentButton);
    }

    // رویداد پرداخت نهایی
    if (finalPayment) {
        finalPayment.addEventListener('click', function() {
            if (cartItems.length === 0) {
                alert('سبد خرید شما خالی است!');
                return;
            }

            if (!termsAgreement.checked) {
                alert('لطفاً شرایط و قوانین را مطالعه و تأیید کنید.');
                return;
            }

            // در اینجا می‌توانید پرداخت واقعی را انجام دهید
            simulatePayment();
        });
    }

    // شبیه‌سازی پرداخت
    function simulatePayment() {
        finalPayment.disabled = true;
        finalPayment.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> در حال پرداخت...';
        
        // شبیه‌سازی تأخیر پرداخت
        setTimeout(() => {
            // ذخیره سفارش
            const order = {
                id: Date.now(),
                items: cartItems,
                total: calculateTotal(),
                date: new Date().toLocaleString('fa-IR'),
                status: 'paid'
            };
            
            // ذخیره در localStorage
            saveOrder(order);
            
            // خالی کردن سبد خرید
            cartItems = [];
            saveCart();
            updateHeaderCartCount();
            
            // نمایش پیام موفقیت
            showPaymentSuccess(order);
            
        }, 2000);
    }

    // محاسبه کل مبلغ
    function calculateTotal() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return subtotal - (subtotal * discountRate);
    }

    // ذخیره سفارش
    function saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('plantcode_orders')) || [];
        orders.push(order);
        localStorage.setItem('plantcode_orders', JSON.stringify(orders));
    }

    // نمایش موفقیت پرداخت
    function showPaymentSuccess(order) {
        const successHTML = `
            <div class="text-center py-5">
                <div class="success-icon mb-4">
                    <i class="fas fa-check-circle fa-5x text-success"></i>
                </div>
                <h2 class="text-success mb-3">پرداخت با موفقیت انجام شد!</h2>
                <p class="text-muted mb-4">سفارش شما با شماره <strong>#${order.id}</strong> ثبت شد.</p>
                <div class="order-details mb-4">
                    <p><strong>مبلغ پرداختی:</strong> ${formatPrice(order.total)} تومان</p>
                    <p><strong>تاریخ:</strong> ${order.date}</p>
                </div>
                <div class="actions mt-4">
                    <a href="../index.html" class="btn btn-primary me-2">
                        <i class="fas fa-home me-2"></i>
                        بازگشت به خانه
                    </a>
                    <a href="#" class="btn btn-outline-primary">
                        <i class="fas fa-file-invoice me-2"></i>
                        مشاهده فاکتور
                    </a>
                </div>
            </div>
        `;
        
        cartItemsContainer.innerHTML = successHTML;
        finalPayment.style.display = 'none';
    }

    // بارگذاری دوره‌های پیشنهادی
    function loadSuggestedCourses() {
        const suggestedCourses = document.getElementById('suggestedCourses');
        if (!suggestedCourses) return;

        // نمونه دوره‌های پیشنهادی
        const courses = [
            {
                id: 1,
                title: 'دوره متخصص React',
                instructor: 'محمدرضا ضیایی',
                price: 3200000,
                image: '../img/React.jpeg',
                badge: 'تخصصی'
            },
            {
                id: 2,
                title: 'دوره متخصص JavaScript',
                instructor: 'محمدرضا ضیایی',
                price: 3200000,
                image: '../img/javascript.jpeg',
                badge: 'تخصصی'
            },
            {
                id: 3,
                title: 'دوره متخصص Python',
                instructor: 'محمدرضا ضیایی',
                price: 3200000,
                image: '../img/python.jpeg',
                badge: 'تخصصی'
            },
            {
                id: 4,
                title: 'دوره متخصص PHP',
                instructor: 'محمدرضا ضیایی',
                price: 3200000,
                image: '../img/php.jpeg',
                badge: 'تخصصی'
            }
        ];

        let html = '';
        courses.forEach(course => {
            html += `
                <div class="col-6 col-md-3">
                    <div class="suggested-course-card">
                        <div class="suggested-course-image">
                            <img src="${course.image}" alt="${course.title}">
                            <span class="course-badge">${course.badge}</span>
                        </div>
                        <div class="suggested-course-content">
                            <h3 class="suggested-course-title">${course.title}</h3>
                            <div class="suggested-course-instructor small text-muted">
                                ${course.instructor}
                            </div>
                            <div class="suggested-course-price">
                                ${formatPrice(course.price)} تومان
                            </div>
                            <button class="add-to-cart-btn" onclick="addToCart(${course.id})">
                                <i class="fas fa-plus"></i>
                                افزودن به سبد
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        suggestedCourses.innerHTML = html;
    }

    // افزودن به سبد خرید
    window.addToCart = function(courseId) {
        // در اینجا می‌توانید دوره را از API بگیرید
        const course = {
            id: courseId,
            title: 'دوره متخصص React',
            instructor: 'محمدرضا ضیایی',
            price: 3200000,
            image: '../img/React.jpeg',
            quantity: 1
        };

        // بررسی وجود دوره در سبد
        const existingItem = cartItems.find(item => item.id === courseId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push(course);
        }

        saveCart();
        loadCartItems();
        updateHeaderCartCount();
        
        // نمایش اعلان
        showToast('دوره با موفقیت به سبد خرید اضافه شد!');
    }

    // نمایش Toast
    function showToast(message) {
        // ایجاد toast
        const toast = document.createElement('div');
        toast.className = 'checkout-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle text-success me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // انیمیشن
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // حذف بعد از 3 ثانیه
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // استایل toast
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        .checkout-toast {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--dark-light);
            color: var(--text);
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid var(--border);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .checkout-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
        }
    `;
    document.head.appendChild(toastStyle);

    // شروع بارگذاری
    loadCartItems();
    loadSuggestedCourses();
});