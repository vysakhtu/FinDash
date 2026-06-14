from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Transaction

class AuthAndTransactionAPITests(APITestCase):
    def setUp(self):
        # Create user 1 and authenticating token
        self.user1 = User.objects.create_user(username='user1', password='password123', email='user1@example.com')
        self.token1 = Token.objects.create(user=self.user1)
        
        # Create user 2 and authenticating token
        self.user2 = User.objects.create_user(username='user2', password='password123', email='user2@example.com')
        self.token2 = Token.objects.create(user=self.user2)

        # Create transactions for user 1
        self.t1 = Transaction.objects.create(
            user=self.user1,
            amount=100.00,
            category='Food',
            type='EXPENSE',
            date='2026-06-01',
            note='Groceries user1'
        )
        self.t2 = Transaction.objects.create(
            user=self.user1,
            amount=500.00,
            category='Salary',
            type='INCOME',
            date='2026-06-02',
            note='Freelance pay user1'
        )

        # Create transactions for user 2
        self.t3 = Transaction.objects.create(
            user=self.user2,
            amount=250.00,
            category='Utilities',
            type='EXPENSE',
            date='2026-06-03',
            note='Electric bill user2'
        )

    def test_unauthenticated_request_fails(self):
        # Making request without headers should fail with 401
        url = reverse('transaction-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_can_register(self):
        url = reverse('auth-register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['username'], 'newuser')
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_user_can_login(self):
        url = reverse('auth-login')
        data = {
            'username': 'user1',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['token'], self.token1.key)

    def test_user_can_logout(self):
        url = reverse('auth-logout')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Token should be deleted
        self.assertFalse(Token.objects.filter(key=self.token1.key).exists())

    def test_list_transactions_scoped_to_user(self):
        url = reverse('transaction-list-create')
        
        # Authenticate as user1
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see user1's 2 transactions (t1 and t2)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['user'], 'user1')

        # Authenticate as user2
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see user2's 1 transaction (t3)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user'], 'user2')

    def test_create_transaction_bound_to_user(self):
        url = reverse('transaction-list-create')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        data = {
            'amount': 300.00,
            'category': 'Travel',
            'type': 'EXPENSE',
            'date': '2026-06-04',
            'note': 'Flight'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user'], 'user1')
        
        created_transaction = Transaction.objects.get(id=response.data['id'])
        self.assertEqual(created_transaction.user, self.user1)

    def test_summary_scoped_to_user(self):
        url = reverse('dashboard-summary')
        
        # Authenticate as user1
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_income'], 500.00) # t2
        self.assertEqual(response.data['total_expense'], 100.00) # t1
        self.assertEqual(response.data['net_balance'], 400.00)
        self.assertEqual(response.data['top_spending_category'], 'Food')
