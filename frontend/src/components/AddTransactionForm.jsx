import React, { useState } from 'react';

const COMMON_CATEGORIES = [
  'Food',
  'Rent',
  'Utilities',
  'Travel',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Salary',
  'Freelance',
  'Investments',
  'Other'
];

export default function AddTransactionForm({ onTransactionAdded }) {
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('EXPENSE'); // Default to EXPENSE
  const [date, setDate] = useState(getTodayDateString());
  const [note, setNote] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (!category.trim()) {
      setError('Category is required.');
      return;
    }
    if (!date) {
      setError('Date is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const transactionData = {
        amount: parseFloat(amount),
        category: category.trim(),
        type,
        date,
        note: note.trim() || null
      };

      await onTransactionAdded(transactionData);

      // Reset form on success
      setAmount('');
      setCategory('');
      setNote('');
      setDate(getTodayDateString());
    } catch (err) {
      setError(err.message || 'Failed to add transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel form-panel">
      <div className="panel-header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Transaction
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Income / Expense toggle buttons */}
        <div className="type-toggle-group">
          <button
            type="button"
            className={`type-toggle-btn ${type === 'INCOME' ? 'active income' : ''}`}
            onClick={() => setType('INCOME')}
          >
            Income
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${type === 'EXPENSE' ? 'active expense' : ''}`}
            onClick={() => setType('EXPENSE')}
          >
            Expense
          </button>
        </div>

        {error && (
          <div className="error-banner" style={{ marginBottom: '1.25rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              placeholder="e.g. Food"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              list="category-suggestions"
              required
            />
            <datalist id="category-suggestions">
              {COMMON_CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (Optional)</label>
          <textarea
            id="note"
            rows="2"
            placeholder="Add details..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', boxShadow: 'none' }} />
              Adding...
            </>
          ) : (
            'Add Transaction'
          )}
        </button>
      </form>
    </div>
  );
}
