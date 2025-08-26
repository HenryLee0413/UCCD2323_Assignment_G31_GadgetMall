// ==================== Add product to cart ====================
$(document).on("click", ".add-to-cart", function () {
    const $product = $(this).parent();
    const id = $product.data("id");
    const name = $product.data("name");
    const price = parseFloat($product.data("price"));

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
});
/* 
Purpose: Adds products to shopping cart when "Add to Cart" button is clicked.
Key Features: 
Finds product info (id, name, price) from HTML attributes.
Stores cart in localStorage so it persists across pages.
If item already exists, increase quantity; otherwise add a new product.
Shows an alert when added.
*/ 


// ==================== Display cart items ====================
$(function () {
    const $tbody = $("#cart-table-body");
    const $overall = $("#overall-total");

    if ($tbody.length) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let overallTotal = 0;
        $tbody.empty();

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            overallTotal += itemTotal;

            $tbody.append(`
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${itemTotal.toFixed(2)}</td>
                    <td><button class="remove-item" data-id="${item.id}">❌</button></td>
                </tr>
            `);
        });

        if ($overall.length) {
            $overall.text(overallTotal.toFixed(2));
        }

        $(document).on("click", ".remove-item", function () {
            const id = $(this).data("id");
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload();
        });
    }
});
/*
Purpose: Shows cart contents inside cart.html.
Key Features: 
Reads cart from localStorage.
Displays items in table with name, price, quantity, subtotal.
Updates overall total price.
Allows removing an item (❌ button).
*/

// ==================== Confirm Order (Session) ====================
$(function () {
    $("#customer-form").on("submit", function (e) {
        e.preventDefault();

        const customer = {
            name: $("#name").val(),
            phone: $("#phone").val(),
            email: $("#email").val()
        };

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const order = {
            customer: customer,
            cart: cart,
            date: new Date().toISOString()
        };

        sessionStorage.setItem("order", JSON.stringify(order));
        alert("Order saved successfully!");
    });
});
/* 
Purpose: Saves order when user confirms checkout.
Key Features:
Collects customer details from form.
Combines with cart info.
Saves to sessionStorage (temporary; cleared when browser closes).
Prepares for Order Summary page.
*/

// ==================== Slider ====================
$(function () {
    $(".slider").each(function () {
        const $slider = $(this);
        const $slides = $slider.find(".slide");
        const $prev = $slider.find(".prev");
        const $next = $slider.find(".next");
        const $dotsContainer = $slider.find(".dots");
        let currentIndex = 0;

        $slides.each((i) => {
            const $dot = $("<span>").on("click", () => {
                currentIndex = i;
                updateSlides();
            });
            $dotsContainer.append($dot);
        });

        const $dots = $dotsContainer.find("span");

        function updateSlides() {
            $slides.removeClass("active").eq(currentIndex).addClass("active");
            $dots.removeClass("active").eq(currentIndex).addClass("active");
        }

        $prev.on("click", () => {
            currentIndex = (currentIndex - 1 + $slides.length) % $slides.length;
            updateSlides();
        });

        $next.on("click", () => {
            currentIndex = (currentIndex + 1) % $slides.length;
            updateSlides();
        });

        updateSlides();
    });
});
/*
Purpose: Handles product/image slideshow.
Key Features:
Dots = quick navigation.
Prev/Next buttons = scroll slides.
Adds/removes active class to show correct slide.
*/


// ==================== Dropdown Menu ====================
$(function () {
    function setupDropdown(linkId, menuId) {
        const $link = $("#" + linkId);
        const $menu = $("#" + menuId);
        if (!$link.length || !$menu.length) return;

        $menu.hide().css("visibility", "visible");

        $link.on("click", function (e) {
            e.preventDefault();
            $menu.toggle();
        });

        $(document).on("click", function (e) {
            if (!$link.is(e.target) && !$menu.is(e.target) && $menu.has(e.target).length === 0) {
                $menu.hide();
            }
        });
    }

    setupDropdown("categoriesLink", "categoriesMenu");
    setupDropdown("footerCategoriesLink", "footerCategoriesMenu");
});
/*
Purpose: Controls dropdown menus (header & footer).
Key Features:
Toggle menu open/close on click.
Closes menu when clicking outside.
*/

// ==================== FAQ ====================
document.addEventListener('DOMContentLoaded', function() {
    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').classList.remove('open');
            });
            
            // Open clicked item if it was closed
            if (!isOpen) {
                item.classList.add('active');
                answer.classList.add('open');
            }
        });
    });
    
    // Back to top button functionality for Frequantly ask question(FAQ) page
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Search functionality for Frequantly ask question(FAQ) page
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all FAQs
            faqItems.forEach(item => {
                item.style.display = 'block';
            });
            return;
        }
        
        // Search through FAQs
        let foundResults = false;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                foundResults = true;
                
                // Open the matching FAQ
                item.classList.add('active');
                item.querySelector('.faq-answer').classList.add('open');
            } else {
                item.style.display = 'none';
            }
        });
        
        if (!foundResults) {
            alert('No results found for "' + searchTerm + '". Please try a different search term.');
        }
    }
});
/*
Purpose: Enhances FAQ page.
Key Features:
Expand/collapse questions.
Back-to-top button.
Search FAQs by keyword.
*/

// ==================== Save User Message ====================
function SaveMessage() {
    const formData = {
        userName: document.getElementById("username").value,
        email: document.getElementById("Email").value,
        phoneNum: document.getElementById("phoneNum").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };
    
    localStorage.setItem("formData", JSON.stringify(formData));
    alert("Message saved");
    }
/*
Purpose: Saves contact form inputs to localStorage.
Key Features:
Stores user messages for debugging or offline persistence.
*/

// ==================== Header Search (Direct Redirect) ====================
document.addEventListener("DOMContentLoaded", function () {
    const headerSearchInput = document.querySelector(".search input");

    if (!headerSearchInput) return;

    // Trigger on Enter key
    headerSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            doDirectSearch();
        }
    });

    // Optional: Add search button
    if (!document.querySelector(".search-btn")) {
        const btn = document.createElement("button");
        btn.innerHTML = '<i class="fas fa-magnifying-glass"></i>';
        btn.type = "button";
        btn.classList.add("search-btn");

        // ✅ Inline style to make it plain white background with no border
        btn.style.background = "white";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.padding = "5px";    // optional small padding
        btn.style.marginLeft = "5px"; // spacing from input
        btn.style.borderRadius = "5px"; // optional rounded
        headerSearchInput.insertAdjacentElement("afterend", btn);

        btn.addEventListener("click", doDirectSearch);
    }

    function doDirectSearch() {
        const query = headerSearchInput.value.trim().toLowerCase();

        if (query === "") {
            alert("Please enter something to search.");
            return;
        }

        // Map of keywords to pages
        const pageMap = {
            "car gadget": "Car Gadget.html",
            "gaming": "GamingAccessories.html",
            "keyboard": "Keyboard.html",
            "mouse": "Mouse.html",
            "best seller": "BestSeller.html",
            "faq": "FAQ.html",
            "contact": "ContactUs.html"
            // 👉 add more keywords here
        };

        // Try to find matching page
        let foundPage = null;
        for (const key in pageMap) {
            if (query.includes(key)) {
                foundPage = pageMap[key];
                break;
            }
        }

        if (foundPage) {
            window.location.href = foundPage;
        } else {
            alert(`No matching page found for "${query}".`);
        }
    }
});
/*
Purpose: Search bar in header.
Key Features:
Maps keywords to site pages.
Redirects to relevant page.
Alerts if nothing matches.
*/


// ==================== Mobile Menu Toggle ====================
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.style.display = (menu.style.display === "block") ? "none" : "block";
        });
    }
});
/*
Purpose: Mobile hamburger menu toggle.
Key Features: Show/hide menu on click.
*/


// ==================== Cookie Consent ====================
document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const declineBtn = document.getElementById("decline-cookies");

    // Check if user already made a choice
    if (!localStorage.getItem("cookieConsent")) {
        banner.style.display = "block";

        // Auto-hide after 10 seconds if no action
        const autoHide = setTimeout(() => {
            banner.style.display = "none";
            localStorage.setItem("cookieConsent", "ignored"); // Mark as shown
        }, 10000);

        acceptBtn.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "accepted");
            banner.style.display = "none";
            clearTimeout(autoHide);
        });

        declineBtn.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "declined");
            banner.style.display = "none";
            clearTimeout(autoHide);
        });
    }
});
/*
Purpose: Handles GDPR-style cookie consent.
Key Features:
Shows banner if no choice is stored.
Auto-hide after 10s if ignored.
Saves choice (accepted / declined / ignored) in localStorage.
*/
