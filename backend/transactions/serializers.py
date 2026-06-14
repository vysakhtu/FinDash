from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'category', 'type', 'date', 'note', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate_type(self, value):
        if value not in ['INCOME', 'EXPENSE']:
            raise serializers.ValidationError("Type must be either INCOME or EXPENSE.")
        return value
