document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ANIMATED COUNTER FOR STATS =====
    function animateCounter(element, target, duration = 1500) {
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(easeOut * target);
            
            if (element.textContent.includes('$')) {
                element.textContent = '$' + current.toLocaleString();
            } else if (element.textContent.includes('.')) {
                element.textContent = (current / 10).toFixed(1);
            } else {
                element.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Get all stat values and animate them
    const totalCourses = document.getElementById('totalCourses');
    const totalStudents = document.getElementById('totalStudents');
    const totalRevenue = document.getElementById('totalRevenue');
    const avgRating = document.getElementById('avgRating');
    
    if (totalCourses) {
        const target = parseInt(totalCourses.textContent.replace(/,/g, ''));
        animateCounter(totalCourses, target, 1200);
    }
    
    if (totalStudents) {
        const target = parseInt(totalStudents.textContent.replace(/,/g, ''));
        animateCounter(totalStudents, target, 1500);
    }
    
    if (totalRevenue) {
        const target = parseInt(totalRevenue.textContent.replace(/[$,]/g, ''));
        animateCounter(totalRevenue, target, 1500);
    }
    
    if (avgRating) {
        const target = parseFloat(avgRating.textContent) * 10;
        animateCounter(avgRating, target, 1000);
    }
    
    // ===== NEW COURSE BUTTON =====
    const newCourseBtn = document.getElementById('newCourseBtn');
    if (newCourseBtn) {
        newCourseBtn.addEventListener('click', function() {
            window.location.href = '/instructor/course/add/';
        });
    }
    
    // ===== COURSE ACTION BUTTONS =====
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.classList.contains('danger')) {
                if (confirm('آیا از حذف این آیتم مطمئن هستید؟')) {
                    const item = this.closest('.course-item');
                    if (item) {
                        item.style.opacity = '0.3';
                        item.style.transition = 'all 0.3s ease';
                        setTimeout(() => {
                            item.remove();
                        }, 300);
                    }
                }
            } else if (this.title === 'ویرایش') {
                window.location.href = '/instructor/course/edit/';
            } else if (this.title === 'مدیریت درس‌ها') {
                window.location.href = '/instructor/lessons/';
            }
        });
    });
    
    // ===== VIEW ALL COURSES =====
    const viewAllLink = document.querySelector('.view-all');
    if (viewAllLink) {
        viewAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/instructor/courses/';
        });
    }
    
});