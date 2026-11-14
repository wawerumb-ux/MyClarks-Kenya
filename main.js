// Toggle Cart Sidebar
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
    cartIcon.addEventListener('click', function() {
        document.querySelector('.cart-sidebar').classList.add('active');
    });
}

const closeCart = document.querySelector('.close-cart');
if (closeCart) {
    closeCart.addEventListener('click', function() {
        document.querySelector('.cart-sidebar').classList.remove('active');
    });
}

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });
}

// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter products (simplified example)
        const category = this.textContent.toLowerCase();
        filterProducts(category);
    });
});

// Search Button
const searchButtons = document.querySelectorAll('.search-btn');
searchButtons.forEach(button => {
    button.addEventListener('click', function() {
        const searchBar = this.closest('.search-bar');
        const input = searchBar ? searchBar.querySelector('input') : null;
        if (input) {
            input.focus();
        }
    });
});

// Add to Cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const cartCount = document.querySelector('.cart-count');
        let count = parseInt(cartCount.textContent);
        cartCount.textContent = count + 1;
        
        // Show cart sidebar
        document.querySelector('.cart-sidebar').classList.add('active');
        
        // Get product details
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.price').textContent.trim();
        const productImage = productCard.querySelector('.product-img img').src;
        
        // Add to cart items
        addToCartItems(productName, productPrice, productImage);
        
        // Animation
        this.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            this.style.backgroundColor = '';
        }, 500);
    });
});

// Add All to Cart
const addAllToCartButton = document.querySelector('.add-all-to-cart');
if (addAllToCartButton) {
    addAllToCartButton.addEventListener('click', function() {
        const wishlistItems = document.querySelectorAll('.wishlist-item');
        wishlistItems.forEach(item => {
            const productName = item.querySelector('.product-name') ? item.querySelector('.product-name').textContent.trim() : '';
            const productPrice = item.querySelector('.price') ? item.querySelector('.price').textContent.trim() : '';
            const productImage = item.querySelector('.product-img img') ? item.querySelector('.product-img img').src : '';
            if (productName && productPrice) {
                addToCartItems(productName, productPrice, productImage);
            }
        });
        updateCartCount();
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('active');
        }
    });
}

// Quantity Controls
const quantityBtns = document.querySelectorAll('.quantity-btn');
quantityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const quantityElement = this.parentElement.querySelector('span');
        let quantity = parseInt(quantityElement.textContent);
        
        if (this.textContent === '+') {
            quantity++;
        } else if (this.textContent === '-' && quantity > 1) {
            quantity--;
        }
        
        quantityElement.textContent = quantity;
        
        // Update total price
        updateCartTotal();
    });
});

// Add item to cart
function addToCartItems(name, price, image) {
    const cartItems = document.querySelector('.cart-items');
    
    // Check if item already exists in cart
    const existingItems = cartItems.querySelectorAll('.cart-item-name');
    for (let item of existingItems) {
        if (item.textContent === name) {
            // Increase quantity if item exists
            const quantityElement = item.closest('.cart-item').querySelector('.cart-item-actions span');
            let quantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = quantity + 1;
            
            updateCartTotal();
            return;
        }
    }
    
    // Create new cart item
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-img">
            <img src="${image}" alt="${name}">
        </div>
        <div class="cart-item-details">
            <div class="cart-item-name">${name}</div>
            <div class="cart-item-price">${price}</div>
            <div class="cart-item-actions">
                <div class="quantity-btn">-</div>
                <span>1</span>
                <div class="quantity-btn">+</div>
            </div>
        </div>
    `;
    
    cartItems.appendChild(cartItem);
    
    // Add event listeners to new quantity buttons
    const newQuantityBtns = cartItem.querySelectorAll('.quantity-btn');
    newQuantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const quantityElement = this.parentElement.querySelector('span');
            let quantity = parseInt(quantityElement.textContent);
            
            if (this.textContent === '+') {
                quantity++;
            } else if (this.textContent === '-' && quantity > 1) {
                quantity--;
            } else if (this.textContent === '-' && quantity === 1) {
                // Remove item if quantity becomes 0
                cartItem.remove();
                updateCartTotal();
                updateCartCount();
                return;
            }
            
            quantityElement.textContent = quantity;
            updateCartTotal();
        });
    });
    
    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    
    cartItems.forEach(item => {
        const priceText = item.querySelector('.cart-item-price').textContent;
        const price = parseInt(priceText.replace('KES ', '').replace(',', ''));
        const quantity = parseInt(item.querySelector('.cart-item-actions span').textContent);
        
        total += price * quantity;
    });
    
    document.querySelector('.cart-total span:last-child').textContent = 'KES ' + total.toLocaleString();
}

// Update cart count
function updateCartCount() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalCount = 0;
    
    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.cart-item-actions span').textContent);
        totalCount += quantity;
    });
    
    document.querySelector('.cart-count').textContent = totalCount;
}

// Filter products (simplified implementation)
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all') {
            product.style.display = 'block';
        } else {
            const productCategory = product.querySelector('.product-category').textContent.toLowerCase();
            if (productCategory.includes(category)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        }
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        if (email) {
            alert('Thank you for subscribing to our newsletter!');
            this.querySelector('input').value = '';
        }
    });
}