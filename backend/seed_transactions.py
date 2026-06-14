import os
import django
from datetime import datetime, timedelta

# Setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fintech_backend.settings')
django.setup()

from django.contrib.auth.models import User
from transactions.models import Transaction

def seed_data():
    demo_username = 'demo_user'
    demo_password = 'password123'
    demo_email = 'demo@example.com'

    print("Checking for demo user...")
    user, created = User.objects.get_or_create(username=demo_username, defaults={'email': demo_email})
    if created:
        user.set_password(demo_password)
        user.save()
        print(f"Successfully created demo user '{demo_username}' with password '{demo_password}'")
    else:
        print(f"Demo user '{demo_username}' already exists.")

    print("Clearing old transactions...")
    Transaction.objects.all().delete()

    base_date = datetime.now().date()
    
    incomes = [
        ('Salary', 5000.00, base_date - timedelta(days=28), 'Main Job Salary'),
        ('Freelance', 1200.00, base_date - timedelta(days=15), 'Landing page design'),
        ('Freelance', 650.00, base_date - timedelta(days=5), 'Code debugging contract'),
        ('Investments', 150.00, base_date - timedelta(days=20), 'Quarterly stock dividend'),
        ('Other', 50.00, base_date - timedelta(days=10), 'Sold old textbooks')
    ]

    for category, amount, date, note in incomes:
        Transaction.objects.create(
            user=user,
            amount=amount,
            category=category,
            type='INCOME',
            date=date,
            note=note
        )

    expenses = [
        # Rent
        ('Rent', 1200.00, base_date - timedelta(days=27), 'June Apartment Rent'),
        # Utilities
        ('Utilities', 120.00, base_date - timedelta(days=25), 'Electricity Bill'),
        ('Utilities', 45.00, base_date - timedelta(days=24), 'High-speed Fiber Internet'),
        ('Utilities', 15.00, base_date - timedelta(days=14), 'Mobile Prep-aid recharge'),
        # Food (frequent purchases)
        ('Food', 75.50, base_date - timedelta(days=26), 'Weekly Groceries at Costco'),
        ('Food', 12.80, base_date - timedelta(days=25), 'Starbucks coffee and bagel'),
        ('Food', 45.00, base_date - timedelta(days=22), 'Sushi dinner'),
        ('Food', 82.30, base_date - timedelta(days=19), 'Groceries'),
        ('Food', 35.40, base_date - timedelta(days=15), 'UberEats delivery'),
        ('Food', 68.10, base_date - timedelta(days=12), 'Supermarket haul'),
        ('Food', 18.50, base_date - timedelta(days=8), 'Lunch bowl'),
        ('Food', 55.00, base_date - timedelta(days=3), 'Dinner at Italian Bistro'),
        ('Food', 22.00, base_date - timedelta(days=1), 'Groceries quick stop'),
        # Travel
        ('Travel', 14.50, base_date - timedelta(days=23), 'Uber ride to office'),
        ('Travel', 42.00, base_date - timedelta(days=20), 'Gas refill'),
        ('Travel', 250.00, base_date - timedelta(days=18), 'Train ticket for weekend trip'),
        ('Travel', 18.00, base_date - timedelta(days=17), 'Uber ride back'),
        ('Travel', 45.00, base_date - timedelta(days=5), 'Gas refill'),
        # Entertainment
        ('Entertainment', 15.99, base_date - timedelta(days=22), 'Netflix Premium monthly subscription'),
        ('Entertainment', 35.00, base_date - timedelta(days=14), 'Cinema tickets'),
        ('Entertainment', 60.00, base_date - timedelta(days=7), 'New video game'),
        # Shopping
        ('Shopping', 120.00, base_date - timedelta(days=21), 'Summer jacket'),
        ('Shopping', 85.00, base_date - timedelta(days=10), 'Wireless headphones'),
        ('Shopping', 30.00, base_date - timedelta(days=4), 'Kitchen utensils'),
        # Healthcare
        ('Healthcare', 25.00, base_date - timedelta(days=13), 'Multivitamins & medicines'),
    ]

    for category, amount, date, note in expenses:
        Transaction.objects.create(
            user=user,
            amount=amount,
            category=category,
            type='EXPENSE',
            date=date,
            note=note
        )

    print(f"Successfully seeded {Transaction.objects.count()} transactions for user '{demo_username}'!")

if __name__ == '__main__':
    seed_data()
