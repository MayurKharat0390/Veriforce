import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
try:
    import django
    django.setup()
    print("Setup successful")
except Exception as e:
    import traceback
    traceback.print_exc()
