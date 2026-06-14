import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';
import SummaryCards from '../components/SummaryCards';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionTable from '../components/TransactionTable';
import ExpenseChart from '../components/ExpenseChart';
import InsightCard from '../components/InsightCard';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: '',
  });

  // Fetch dashboard summary (runs once on mount and when a transaction is added)
  const fetchSummaryData = async () => {
    try {
      const summaryData = await transactionService.getSummary();
      setSummary(summaryData);
      setCategories(summaryData.categories || []);
    } catch (err) {
      console.error('Failed to load summary stats:', err);
      // We don't block the whole UI if just the summary fails, but we keep track
      setError(err.message || 'Failed to fetch summary data.');
    }
  };

  // Fetch transactions list (runs on mount, when filters change, and when transaction added)
  const fetchTransactionsList = async (currentFilters) => {
    try {
      const list = await transactionService.getTransactions(currentFilters);
      setTransactions(list);
    } catch (err) {
      console.error('Failed to load transactions list:', err);
      setError(err.message || 'Failed to fetch transactions list.');
    }
  };

  // Initial load
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchSummaryData(),
        fetchTransactionsList(filters)
      ]);
    } catch (err) {
      setError('An error occurred while loading dashboard data. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle filter changes
  const handleFilterChange = async (updatedFilters) => {
    setFilters(updatedFilters);
    // Fetch list immediately with updated filters
    try {
      setError(null);
      await fetchTransactionsList(updatedFilters);
    } catch (err) {
      setError(err.message || 'Failed to filter transactions.');
    }
  };

  // Reset filters
  const handleResetFilters = async () => {
    const defaultFilters = { category: 'All', startDate: '', endDate: '' };
    setFilters(defaultFilters);
    try {
      setError(null);
      await fetchTransactionsList(defaultFilters);
    } catch (err) {
      setError(err.message || 'Failed to reset filters.');
    }
  };

  // Callback after adding a transaction
  const handleTransactionAdded = async (newTransactionData) => {
    // 1. Submit POST request
    await transactionService.createTransaction(newTransactionData);
    
    // 2. Refresh both summary stats and transaction list to keep dashboard fully synced
    await fetchSummaryData();
    await fetchTransactionsList(filters);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Loading your financial overview...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Global Error Banner */}
      {error && (
        <div className="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
          <button type="button" onClick={loadDashboardData}>Retry</button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <SummaryCards summary={summary} />

      {/* Middle Sections: Charts & Insights */}
      <div className="bottom-section">
        <ExpenseChart chartData={summary.expense_by_category} />
        <InsightCard summary={summary} />
      </div>

      {/* Bottom Sections: Form and Table */}
      <div className="dashboard-content">
        <TransactionTable
          transactions={transactions}
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
        <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
      </div>
    </div>
  );
}
