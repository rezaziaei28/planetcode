from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from .models import Category, Course


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for Category model.
    """
    list_display = ['title', 'slug', 'courses_count']
    search_fields = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['title']
    
    def courses_count(self, obj):
        """Display number of courses in this category."""
        count = obj.courses.filter(is_active=True).count()
        url = reverse('admin:courses_course_changelist') + f'?category__id__exact={obj.id}'
        return format_html('<a href="{}">{}</a>', url, count)
    courses_count.short_description = _('Active Courses')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """
    Admin configuration for Course model with comprehensive display and filters.
    """
    
    # List view configuration
    list_display = [
        'title', 
        'teacher', 
        'category', 
        'price_display', 
        'is_active', 
        'is_featured',
        'is_free',
        'students_count',
        'rating_display',
        'created_at'
    ]
    
    list_filter = [
        'is_active',
        'is_featured',
        'is_free',
        'level',
        'language',
        'category',
        'created_at',
        'published_at'
    ]
    
    search_fields = [
        'title',
        'slug',
        'description',
        'short_description',
        'teacher__username',
        'teacher__email',
        'teacher__first_name',
        'teacher__last_name',
        'category__title'
    ]
    
    prepopulated_fields = {'slug': ('title',)}
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'rating',
        'reviews_count',
        'students_count',
        'lessons_count',
        'duration'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'title',
                'slug',
                'description',
                'short_description'
            )
        }),
        ('Relationships', {
            'fields': (
                'category',
                'teacher'
            )
        }),
        ('Media', {
            'fields': (
                'image',
                'cover_video'
            ),
            'classes': ('collapse',)
        }),
        ('Pricing', {
            'fields': (
                'price',
                'discount_percent',
                'is_free'
            )
        }),
        ('Course Details', {
            'fields': (
                'level',
                'language',
                'duration',
                'lessons_count'
            )
        }),
        ('Statistics', {
            'fields': (
                'students_count',
                'rating',
                'reviews_count'
            ),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': (
                'is_active',
                'is_featured',
                'published_at'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        })
    )
    
    actions = [
        'make_active',
        'make_inactive',
        'make_featured',
        'make_unfeatured',
        'set_free',
        'set_paid'
    ]
    
    ordering = ['-created_at']
    
    # Custom methods for list display
    def price_display(self, obj):
        """Display price with discount badge."""
        if obj.is_free:
            return format_html('<span style="color: green; font-weight: bold;">Free</span>')
        
        if obj.has_discount:
            return format_html(
                '<span style="color: red; text-decoration: line-through;">{:,}</span> '
                '<span style="color: green; font-weight: bold;">{:,}</span> '
                '<span style="background: orange; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">-{}%</span>',
                obj.price,
                obj.final_price,
                obj.discount_percent
            )
        return format_html('{:,}', obj.price)
    price_display.short_description = _('Price')
    price_display.admin_order_field = 'price'
    
    def rating_display(self, obj):
        """Display rating with stars."""
        if obj.rating == 0:
            return '-'
        stars = '⭐' * int(obj.rating)
        return format_html('{} <span style="color: #666;">({})</span>', stars, obj.reviews_count)
    rating_display.short_description = _('Rating')
    
    # Custom actions
    def make_active(self, request, queryset):
        """Set selected courses as active."""
        queryset.update(is_active=True)
    make_active.short_description = _('Mark selected courses as active')
    
    def make_inactive(self, request, queryset):
        """Set selected courses as inactive."""
        queryset.update(is_active=False)
    make_inactive.short_description = _('Mark selected courses as inactive')
    
    def make_featured(self, request, queryset):
        """Set selected courses as featured."""
        queryset.update(is_featured=True)
    make_featured.short_description = _('Mark selected courses as featured')
    
    def make_unfeatured(self, request, queryset):
        """Remove selected courses from featured."""
        queryset.update(is_featured=False)
    make_unfeatured.short_description = _('Remove selected courses from featured')
    
    def set_free(self, request, queryset):
        """Set selected courses as free."""
        queryset.update(is_free=True, price=0)
    set_free.short_description = _('Set selected courses as free')
    
    def set_paid(self, request, queryset):
        """Set selected courses as paid."""
        queryset.update(is_free=False)
    set_paid.short_description = _('Set selected courses as paid')
    
    # Override save method to update statistics
    def save_model(self, request, obj, form, change):
        """Save model and update statistics."""
        super().save_model(request, obj, form, change)
        obj.update_statistics()
    

    def get_sections(self):
        """ Get all active sections ordered by order. """
        return self.sections.filter(is_active=True).order_by('order')
    
    def get_total_duration(self):
        """Get total course duration from all lessons."""
        total = 0
        for section in self.get_sections():
            total += section.get_total_duration()
        return total
    
    def get_lessons_count(self):
        """Get total number of lessons."""
        total = 0
        for section in self.get_sections():
            total += section.get_lessons_count()
        return total
    
    def get_free_lessons(self):
        """Get all free lessons."""
        lessons = []
        for section in self.get_sections():
            lessons.extend(section.get_lessons().filter(lesson_type='free'))
        return lessons
    
    def get_paid_lessons(self):
        """Get all paid lessons."""
        lessons = []
        for section in self.get_sections():
            lessons.extend(section.get_lessons().filter(lesson_type='paid'))
        return lessons
    
    def get_user_progress(self, user):
        """Get user's progress in this course."""
        if not user or not user.is_authenticated:
            return 0
        
        total_lessons = self.get_lessons_count()
        if total_lessons == 0:
            return 0
            
        completed = UserProgress.objects.filter(
            user=user,
            lesson__section__course=self,
            is_completed=True
        ).count()
        
        return int((completed / total_lessons) * 100)