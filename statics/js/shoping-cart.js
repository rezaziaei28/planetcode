    /* ============================================
    SHOPPING CART MANAGEMENT
    ============================================ */

    document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // INITIALIZATION
    // ==========================================

    // Remove default cart items from HTML
    const defaultCartItems = document.querySelectorAll('.cart-item');
    defaultCartItems.forEach(item => item.remove());

    // Show empty cart state
    showEmptyCart();
    updateCartCount();

    // ==========================================
    // ADD TO CART BUTTONS
    // ==========================================

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn, .btn-add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            let courseTitle, coursePrice, courseImage;
            
            // Method 1: Get data from course card (index, all_courses pages)
            const courseCard = this.closest('.course-card');
            
            if (courseCard) {
                courseTitle = courseCard.querySelector('.course-title')?.textContent.trim();
                coursePrice = courseCard.querySelector('.final-price')?.textContent;
                courseImage = courseCard.querySelector('.course-image img')?.src || '';
            } 
            // Method 2: Get data from data-* attributes (course_detail page)
            else {
                courseTitle = this.dataset.courseTitle;
                coursePrice = this.dataset.coursePrice;
                courseImage = this.dataset.courseImage || '';
            }
            
            // Validate data
            if (!courseTitle || !coursePrice) {
                console.warn('Course information not found!');
                return;
            }
            
            // Add to cart
            const existingItem = findCartItemByTitle(courseTitle);
            
            if (existingItem) {
                increaseQuantity(existingItem);
                showNotification('تعداد دوره افزایش یافت', 'success');
            } else {
                addNewCartItem(courseTitle, coursePrice, courseImage);
                showNotification('دوره به سبد خرید اضافه شد', 'success');
            }
            
            // Visual feedback
            this.style.background = 'var(--success)';
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.style.background = '';
                this.innerHTML = '<i class="fas fa-shopping-basket"></i>';
            }, 1500);
            
            updateCartCount();
            updateCartTotal();
        });
    });

    // ==========================================
    // CART FUNCTIONS
    // ==========================================

    function addNewCartItem(title, price, image) {
        const cartItems = document.querySelector('.cart-items');
        
        if (!cartItems) {
            console.error('Cart items container not found!');
            return;
        }
        
        // Remove empty cart message
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
        addCartItemEvents(cartItem);
    }

    // ==========================================
    // CART ITEM EVENTS
    // ==========================================

    function addCartItemEvents(cartItem) {
        const minusBtn = cartItem.querySelector('.minus-btn');
        const plusBtn = cartItem.querySelector('.plus-btn');
        const removeBtn = cartItem.querySelector('.remove-item');
        
        // Decrease quantity
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
        
        // Increase quantity
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
        
        // Remove item
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

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    function findCartItemByTitle(title) {
        const cartItems = document.querySelectorAll('.cart-item');
        
        for (let i = 0; i < cartItems.length; i++) {
            const itemTitle = cartItems[i].querySelector('h4')?.textContent.trim();
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
            const priceText = item.querySelector('.item-price')?.textContent || '0';
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
        // Convert "۴,۰۰۰,۰۰۰ تومان" to 4000000
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        let converted = priceText;
        persianNumbers.forEach((persian, index) => {
            converted = converted.replace(new RegExp(persian, 'g'), englishNumbers[index]);
        });
        
        const cleaned = converted.replace(/[^\d]/g, '');
        return parseInt(cleaned) || 0;
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price);
    }

    // ==========================================
    // EMPTY CART STATE
    // ==========================================

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

    // ==========================================
    // NOTIFICATION SYSTEM
    // ==========================================

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-weight: 500;
            animation: slideDown 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }

    // ==========================================
    // CLEAR CART
    // ==========================================

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

    console.log('🛒 Shopping cart system loaded successfully!');

    });