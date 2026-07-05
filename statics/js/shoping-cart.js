// مدیریت سبد خرید دوره‌ها
document.addEventListener('DOMContentLoaded', function() {
    
    // حذف محصولات پیش‌فرض از HTML
    const defaultCartItems = document.querySelectorAll('.cart-item');
    defaultCartItems.forEach(item => item.remove());
    
    // نمایش سبد خرید خالی
    showEmptyCart();
    updateCartCount();

    // افزودن دوره به سبد خرید
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseCard = this.closest('.course-card');
            addCourseToCart(courseCard);
            
            // افکت بصری برای تأیید اضافه شدن
            this.style.background = 'var(--success)';
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.style.background = 'var(--primary)';
                this.innerHTML = '<i class="fas fa-shopping-basket"></i>';
            }, 1000);
        });
    });

    function addCourseToCart(courseCard) {
        const courseTitle = courseCard.querySelector('.course-title').textContent.trim();
        const coursePrice = courseCard.querySelector('.final-price').textContent;
        const courseImage = courseCard.querySelector('.course-image img')?.src || '';
        
        console.log('Adding course:', courseTitle); // برای دیباگ
        
        // بررسی آیا دوره قبلاً اضافه شده
        const existingItem = findCartItemByTitle(courseTitle);
        
        if (existingItem) {
            // افزایش تعداد
            increaseQuantity(existingItem);
            showNotification('تعداد دوره افزایش یافت', 'success');
        } else {
            // اضافه کردن جدید
            addNewCartItem(courseTitle, coursePrice, courseImage);
            showNotification('دوره به سبد خرید اضافه شد', 'success');
        }
        
        updateCartCount();
        updateCartTotal();
    }

    function addNewCartItem(title, price, image) {
        const cartItems = document.querySelector('.cart-items');
        
        if (!cartItems) {
            console.error('عنصر .cart-items پیدا نشد!');
            return;
        }
        
        // حذف پیام سبد خرید خالی
        if (cartItems.querySelector('.empty-cart')) {
            cartItems.innerHTML = '';
        }

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <h4>${title}</h4>
                <span class="item-price">${price}</span>
            </div>
            <div class="item-actions">
                <button class="quantity-btn minus-btn">-</button>
                <span class="quantity">1</span>
                <button class="quantity-btn plus-btn">+</button>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        
        // اضافه کردن event listener به دکمه‌های جدید
        addCartItemEvents(cartItem);
    }

    function addCartItemEvents(cartItem) {
        const minusBtn = cartItem.querySelector('.minus-btn');
        const plusBtn = cartItem.querySelector('.plus-btn');
        const removeBtn = cartItem.querySelector('.remove-item');
        
        minusBtn.addEventListener('click', function() {
            const quantityElement = this.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                updateCartTotal();
                updateCartCount();
            }
        });

plusBtn.addEventListener('click', function() {
            const quantityElement = this.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (quantity < 10) {
                quantity++;
                quantityElement.textContent = quantity;
                updateCartTotal();
                updateCartCount();
            }
        });
        
        removeBtn.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            item.style.animation = 'fadeOut 0.3s ease';
            
            setTimeout(() => {
                item.remove();
                updateCartCount();
                updateCartTotal();
                
                if (document.querySelectorAll('.cart-item').length === 0) {
                    showEmptyCart();
                }
            }, 300);
        });
    }

    function findCartItemByTitle(title) {
        const cartItems = document.querySelectorAll('.cart-item');
        
        for (let i = 0; i < cartItems.length; i++) {
            const itemTitle = cartItems[i].querySelector('h4').textContent.trim();
            if (itemTitle === title) {
                return cartItems[i];
            }
        }
        return null;
    }

    function increaseQuantity(cartItem) {
        const quantityElement = cartItem.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);
        if (quantity < 10) {
            quantityElement.textContent = quantity + 1;
        }
    }

    function updateCartCount() {
        const items = document.querySelectorAll('.cart-item');
        const totalCount = Array.from(items).reduce((total, item) => {
            return total + parseInt(item.querySelector('.quantity').textContent);
        }, 0);
        
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalCount;
        }
    }

    function updateCartTotal() {
        const items = document.querySelectorAll('.cart-item');
        let total = 0;
        
        items.forEach(item => {
            const priceText = item.querySelector('.item-price').textContent;
            const quantity = parseInt(item.querySelector('.quantity').textContent);
            const price = parsePrice(priceText);
            total += price * quantity;
        });
        
        const totalPrice = document.querySelector('.total-price');
        if (totalPrice) {
            totalPrice.textContent = formatPrice(total) + ' تومان';
        }
    }

    function parsePrice(priceText) {
        // تبدیل "۴,۰۰۰,۰۰۰ تومان" به 4000000
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        let converted = priceText;
        persianNumbers.forEach((persian, index) => {
            converted = converted.replace(new RegExp(persian, 'g'), englishNumbers[index]);
        });
        
        return parseInt(converted.replace(/[^\d]/g, '')) || 0;
    }

    function formatPrice(price) {
        // تبدیل 4000000 به "۴,۰۰۰,۰۰۰"
        return new Intl.NumberFormat('fa-IR').format(price);
    }

    function showEmptyCart() {
        const cartItems = document.querySelector('.cart-items');
        if (cartItems && document.querySelectorAll('.cart-item').length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>سبد خرید شما خالی است</p>
                    <button class="continue-shopping">ادامه خرید</button>
                </div>
            `;
            
            const continueBtn = document.querySelector('.continue-shopping');
            if (continueBtn) {
                continueBtn.addEventListener('click', function() {
                    const cartPanel = document.getElementById('cartPanel');
                    const overlay = document.getElementById('overlay');
                    if (cartPanel && overlay) {
                        cartPanel.classList.remove('active');
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        }
    }

    function showNotification(message, type = 'success') {
        // ایجاد نوتیفیکیشن ساده
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius);
            z-index: 9999;
            box-shadow: var(--shadow);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // پاک کردن سبد خرید
    const clearCart = document.getElementById('clearCart');
    if (clearCart) {
        clearCart.addEventListener('click', function() {
            if (confirm('آیا از پاک کردن همه آیتم‌های سبد خرید مطمئن هستید؟')) {
                const cartItems = document.querySelectorAll('.cart-item');
                cartItems.forEach(item => item.remove());
                showEmptyCart();
                updateCartCount();
                showNotification('سبد خرید پاک شد', 'success');
            }
        });
    }

    console.log('سیستم سبد خرید لود شد');
});
