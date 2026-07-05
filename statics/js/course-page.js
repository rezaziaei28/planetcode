// js/course-page.js (یا mobile-filters.js)
document.addEventListener('DOMContentLoaded', function () {
    const toggleFiltersBtn = document.querySelector('.toggle-filters-mobile');
    const closeFiltersBtn = document.querySelector('.close-filters-mobile');
    const filtersSidebar = document.querySelector('.filters-sidebar');
    const overlay = document.getElementById('overlay');

    const applyFiltersBtn = document.querySelector('.apply-filters-btn');
    const resetFiltersBtn = document.querySelector('.reset-filters-btn');
    const searchFilter = document.querySelector('.search-filter');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    const filterRadios = document.querySelectorAll('.filter-radio input[type="radio"]');
    const courseCards = document.querySelectorAll('.course-card');

    // باز کردن سایدبار در موبایل
    if (toggleFiltersBtn) {
        toggleFiltersBtn.addEventListener('click', () => {
            filtersSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // بستن با دکمه ×
    if (closeFiltersBtn) {
        closeFiltersBtn.addEventListener('click', closeSidebar);
    }

    // بستن با کلیک روی overlay
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // بستن با ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeSidebar();
    });

    function closeSidebar() {
        filtersSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // اعمال فیلترها
    if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', applyFilters);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
    if (searchFilter) {
        let timeout;
        searchFilter.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(applyFilters, 350);
        });
    }

    function applyFilters() {
        const searchTerm = searchFilter.value.trim().toLowerCase();
        const selectedCategories = Array.from(filterCheckboxes)
            .filter(cb => cb.checked && cb.name === 'category')
            .map(cb => cb.value);
        const selectedLevels = Array.from(filterCheckboxes)
            .filter(cb => cb.checked && cb.name === 'level')
            .map(cb => cb.value);
        const priceFilter = document.querySelector('input[name="price"]:checked')?.value || 'all';

        courseCards.forEach(card => {
            let show = true;

            // جستجو
            if (searchTerm) {
                const title = (card.querySelector('.course-title')?.textContent || '').toLowerCase();
                const desc = (card.querySelector('.course-description')?.textContent || '').toLowerCase();
                const instructor = (card.querySelector('.course-instructor span')?.textContent || '').toLowerCase();
                if (!title.includes(searchTerm) && !desc.includes(searchTerm) && !instructor.includes(searchTerm)) {
                    show = false;
                }
            }

            // دسته‌بندی
            if (selectedCategories.length > 0) {
                const cat = card.getAttribute('data-category') || '';
                if (!selectedCategories.includes(cat)) show = false;
            }

            // سطح
            if (selectedLevels.length > 0) {
                const level = card.getAttribute('data-level') || '';
                if (!selectedLevels.includes(level)) show = false;
            }

            // قیمت
            if (priceFilter !== 'all') {
                const priceEl = card.querySelector('.final-price');
                const isFree = priceEl && (priceEl.textContent.includes('رایگان') || priceEl.textContent.includes('۰'));
                if (priceFilter === 'free' && !isFree) show = false;
                if (priceFilter === 'paid' && isFree) show = false;
            }

            card.style.display = show ? 'flex' : 'none';
        });

        // فقط در موبایل بعد از اعمال فیلتر، سایدبار بسته بشه
        if (window.innerWidth <= 992) closeSidebar();
    }

    function resetFilters() {
        searchFilter.value = '';
        filterCheckboxes.forEach(cb => cb.checked = false);
        document.querySelector('input[name="price"][value="all"]').checked = true;
        courseCards.forEach(card => card.style.display = 'flex');
        if (window.innerWidth <= 992) closeSidebar();
    }
});