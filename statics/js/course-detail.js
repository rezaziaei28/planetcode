/* ==========================================
   COURSE DETAIL - SYLLABUS & COMMENT
   ========================================== */

   document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // SYLLABUS ACCORDION
    // ==========================================
    
    const syllabusHeaders = document.querySelectorAll('.syllabus-header');
    
    syllabusHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const parent = this.closest('.syllabus-item');
            parent.classList.toggle('open');
        });
    });
    
    // Open first section by default
    const firstSyllabus = document.querySelector('.syllabus-item');
    if (firstSyllabus) {
        firstSyllabus.classList.add('open');
    }
    
    
    // ==========================================
    // COMMENT FORM
    // ==========================================
    
    const commentForm = document.getElementById('commentForm');
    const submitBtn = document.getElementById('submitCommentBtn');
    const successDiv = document.getElementById('commentSuccess');
    
    if (!commentForm) return;
    
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset errors
        clearErrors();
        
        let isValid = true;
        
        // Validate Name
        const name = document.getElementById('commentName');
        if (!name.value.trim()) {
            showError(name);
            isValid = false;
        }
        
        // Validate Email
        const email = document.getElementById('commentEmail');
        if (!email.value.trim() || !isValidEmail(email.value)) {
            showError(email);
            isValid = false;
        }
        
        // Validate Subject
        const subject = document.getElementById('commentSubject');
        if (!subject.value.trim()) {
            showError(subject);
            isValid = false;
        }
        
        // Validate Message
        const message = document.getElementById('commentMessage');
        if (!message.value.trim()) {
            showError(message);
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Get rating
        const rating = document.querySelector('input[name="rating"]:checked');
        const ratingValue = rating ? rating.value : 3;
        
        // Collect data
        const commentData = {
            name: name.value.trim(),
            email: email.value.trim(),
            subject: subject.value.trim(),
            message: message.value.trim(),
            rating: ratingValue
        };
        
        console.log('Comment Data:', commentData);
        
        // Simulate sending
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
        
        setTimeout(() => {
            // Show success
            if (successDiv) {
                successDiv.classList.add('show');
                setTimeout(() => {
                    successDiv.classList.remove('show');
                }, 5000);
            }
            
            // Reset form
            commentForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال دیدگاه';
            
        }, 1500);
    });
    
    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    
    function showError(input) {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.classList.add('show');
        }
    }
    
    function clearErrors() {
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback.show').forEach(el => {
            el.classList.remove('show');
        });
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Real-time validation on blur
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
                const feedback = this.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.classList.remove('show');
                }
            }
        });
    });
    
});