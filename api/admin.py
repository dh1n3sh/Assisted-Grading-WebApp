from django.contrib import admin

# Register your models here.
from .models import Professor  # add this


class ProfessorAdmin(admin.ModelAdmin):  # add this
    list_display = ('name', 'department')  # add this


# Register your models here.
admin.site.register(Professor, ProfessorAdmin)  # add this
