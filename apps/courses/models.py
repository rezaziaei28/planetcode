from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.utils.text import slugify


class Category(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['title']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Course(models.Model):
    """
    Course model representing educational courses on the platform.
    """
    
    # Basic information
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField()
    short_description = models.TextField(max_length=500, blank=True, help_text="Short description for course cards")
    
    # Relationships
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='courses'
    )
    teacher = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='courses'
    )
    
    # Media
    image = models.ImageField(upload_to='courses/', blank=True, null=True)
    cover_video = models.URLField(blank=True, null=True, help_text="Intro video URL (YouTube, Aparat, etc.)")
    
    # Pricing
    price = models.PositiveIntegerField(default=0)
    discount_percent = models.PositiveIntegerField(
        default=0, 
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Statistics (auto-updated or manually set)
    duration = models.PositiveIntegerField(default=0, help_text="Total course duration in minutes")
    lessons_count = models.PositiveIntegerField(default=0)
    students_count = models.PositiveIntegerField(default=0)
    rating = models.FloatField(default=0.0)
    reviews_count = models.PositiveIntegerField(default=0)
    
    # Course level
    LEVEL_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('all_levels', 'All Levels'),
    )
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    
    # Language
    LANGUAGE_CHOICES = (
        ('fa', 'Persian'),
        ('en', 'English'),
        ('both', 'Persian & English'),
    )
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='fa')
    
    # Status
    is_active = models.BooleanField(default=True)
    is_free = models.BooleanField(default=False, help_text="Mark as completely free course")
    is_featured = models.BooleanField(default=False, help_text="Show on homepage featured section")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['is_featured', 'is_active']),
            models.Index(fields=['level']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.teacher}"
    
    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Auto-update is_free based on price
        if self.price == 0:
            self.is_free = True
        else:
            self.is_free = False
        
        # Set published_at when first activating
        if self.is_active and not self.published_at:
            self.published_at = models.DateTimeField.now()
            
        super().save(*args, **kwargs)
    
    @property
    def final_price(self):
        """
        Calculate the final price after discount.
        """
        if self.discount_percent > 0:
            return self.price - (self.price * self.discount_percent // 100)
        return self.price
    
    @property
    def discount_amount(self):
        """
        Calculate the discount amount.
        """
        return self.price - self.final_price
    
    @property
    def has_discount(self):
        """
        Check if course has active discount.
        """
        return self.discount_percent > 0
    
    @property
    def is_free_course(self):
        """
        Check if course is completely free.
        """
        return self.is_free or self.price == 0
    
    @property
    def duration_hours(self):
        """
        Get duration in hours format.
        """
        if self.duration:
            return round(self.duration / 60, 1)
        return 0
    
    @property
    def formatted_duration(self):
        """
        Get human-readable duration.
        """
        if self.duration:
            hours = self.duration // 60
            minutes = self.duration % 60
            if hours > 0:
                return f"{hours}h {minutes}min"
            return f"{minutes}min"
        return "Not specified"
    
    def update_statistics(self):
        """
        Update course statistics from related data.
        """
        from django.db.models import Count, Avg
        
        # Update lessons count
        self.lessons_count = self.lessons.filter(is_active=True).count()
        
        # Update rating (if CourseRating model exists)
        if hasattr(self, 'ratings'):
            rating_data = self.ratings.aggregate(
                avg_rating=Avg('rating'),
                total_reviews=Count('id')
            )
            self.rating = rating_data['avg_rating'] or 0.0
            self.reviews_count = rating_data['total_reviews'] or 0
        
        # Update duration (sum of lesson durations)
        total_duration = self.lessons.filter(is_active=True).aggregate(
            total=Sum('duration_minutes')
        )['total'] or 0
        self.duration = total_duration
        
        self.save(update_fields=['lessons_count', 'rating', 'reviews_count', 'duration'])
    
    def get_lessons(self):
        """
        Get all active lessons ordered by order.
        """
        return self.lessons.filter(is_active=True).order_by('order')
    
    def get_free_lessons(self):
        """
        Get all free lessons.
        """
        return self.get_lessons().filter(lesson_type='free')
    
    def get_paid_lessons(self):
        """
        Get all paid lessons.
        """
        return self.get_lessons().filter(lesson_type='paid')
    
    def get_progress_for_user(self, user):
        """
        Calculate user's progress in this course.
        """
        if not user or not user.is_authenticated:
            return 0
        
        total_lessons = self.lessons_count
        if total_lessons == 0:
            return 0
            
        from apps.dashboard.models import UserProgress
        completed = UserProgress.objects.filter(
            user=user,
            lesson__course=self,
            is_completed=True
        ).count()
        
        return int((completed / total_lessons) * 100)
    
    def is_user_enrolled(self, user):
        """
        Check if a user is enrolled in this course.
        """
        if not user or not user.is_authenticated:
            return False
        
        from apps.dashboard.models import Enrollment
        return Enrollment.objects.filter(
            user=user,
            course=self,
            is_active=True
        ).exists()

class Section(models.Model):
    """
    Section model for organizing lessons within a course.
    """
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='sections'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Section"
        verbose_name_plural = "Sections"
        ordering = ['order', 'created_at']
        unique_together = ['course', 'order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    def get_lessons_count(self):
        """Get total active lessons in this section."""
        return self.lessons.filter(is_active=True).count()
    
    def get_total_duration(self):
        """Get total duration of all lessons in this section."""
        total = self.lessons.filter(is_active=True).aggregate(
            total=models.Sum('duration_minutes')
        )['total'] or 0
        return total
    
    def get_lessons(self):
        """Get all active lessons ordered by order."""
        return self.lessons.filter(is_active=True).order_by('order')


class Lesson(models.Model):
    """
    Lesson model representing individual lessons within a section.
    """
    LESSON_TYPES = (
        ('free', 'Free'),
        ('paid', 'Paid'),
    )
    
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True)
    
    # Video content (upload directly)
    video_file = models.FileField(
        upload_to='lessons/videos/%Y/%m/%d/',
        blank=True,
        null=True,
        help_text="Upload video file (MP4, MOV, AVI - max 500MB)"
    )
    video_duration = models.PositiveIntegerField(
        default=0,
        help_text="Duration in seconds (auto-calculated)"
    )
    thumbnail = models.ImageField(
        upload_to='lessons/thumbnails/%Y/%m/%d/',
        blank=True,
        null=True,
        help_text="Video thumbnail image"
    )
    
    # Attachments
    attachments = models.FileField(
        upload_to='lessons/attachments/%Y/%m/%d/',
        blank=True,
        null=True,
        help_text="PDF, ZIP, DOC, etc."
    )
    
    # Type and order
    lesson_type = models.CharField(max_length=10, choices=LESSON_TYPES, default='free')
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=0, help_text="Duration in minutes")
    
    # Status
    is_active = models.BooleanField(default=True)
    is_preview = models.BooleanField(default=False, help_text="Allow preview for non-enrolled users")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Lesson"
        verbose_name_plural = "Lessons"
        ordering = ['order', 'created_at']
        unique_together = ['section', 'order']
        indexes = [
            models.Index(fields=['section', 'order']),
            models.Index(fields=['lesson_type']),
        ]
    
    def __str__(self):
        return f"{self.section.title} - {self.title}"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def is_free(self):
        """Check if the lesson is free."""
        return self.lesson_type == 'free'
    
    @property
    def formatted_duration(self):
        """Get human-readable duration."""
        if self.duration_minutes:
            hours = self.duration_minutes // 60
            minutes = self.duration_minutes % 60
            if hours > 0:
                return f"{hours}h {minutes}min"
            return f"{minutes}min"
        return "Not specified"


class LessonAttachment(models.Model):
    """
    Additional attachments for a lesson (multiple files).
    """
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='additional_attachments'
    )
    file = models.FileField(upload_to='lessons/attachments/%Y/%m/%d/')
    title = models.CharField(max_length=255, blank=True)
    file_size = models.PositiveIntegerField(default=0, help_text="File size in bytes")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Lesson Attachment"
        verbose_name_plural = "Lesson Attachments"
        ordering = ['uploaded_at']
    
    def __str__(self):
        return f"{self.lesson.title} - {self.file.name}"
    
    def save(self, *args, **kwargs):
        if not self.title:
            self.title = self.file.name.split('/')[-1]
        super().save(*args, **kwargs)
    
    @property
    def file_size_mb(self):
        """Get file size in MB."""
        return round(self.file_size / (1024 * 1024), 2)


class UserProgress(models.Model):
    """
    Track user progress through lessons.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='user_progress'
    )
    is_completed = models.BooleanField(default=False)
    watched_duration = models.PositiveIntegerField(default=0, help_text="Watched duration in seconds")
    last_position = models.PositiveIntegerField(default=0, help_text="Last position in seconds")
    completed_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Progress"
        verbose_name_plural = "User Progress"
        unique_together = ['user', 'lesson']
        indexes = [
            models.Index(fields=['user', 'lesson']),
        ]
    
    def __str__(self):
        status = "✅" if self.is_completed else "🔄"
        return f"{status} {self.user.username} - {self.lesson.title}"
    
    def mark_completed(self):
        """Mark lesson as completed."""
        if not self.is_completed:
            self.is_completed = True
            self.completed_at = models.DateTimeField.now()
            self.save()