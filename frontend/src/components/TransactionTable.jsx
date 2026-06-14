import React, { useState, useEffect } from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function TransactionTable({ 
  transactions, 
  categories, 
  filters, 
  onFilterChange, 
  onResetFilters 
}) {
  const [localCategory, setLocalCategory] = useState(filters.category || 'All');
  const [localStartDate, setLocalStartDate] = useState(filters.startDate || '');
  const [localEndDate, setLocalEndDate] = useState(filters.endDate || '');

  // Keep local filter inputs synced if filters change externally (e.g. on Reset)
  useEffect(() => {
    setLocalCategory(filters.category || 'All');
    setLocalStartDate(filters.startDate || '');
    setLocalEndDate(filters.endDate || '');
  }, [filters]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setLocalCategory(value);
    onFilterChange({ ...filters, category: value });
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setLocalStartDate(value);
    onFilterChange({ ...filters, startDate: value });
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setLocalEndDate(value);
    onFilterChange({ ...filters, endDate: value });
  };

  const handleClear = () => {
    onResetFilters();
  };

  return (
    <div className="glass-panel table-panel">
      <div className="panel-header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          Transactions history
        </h2>
      </div>

      {/* Filters Form */}
      <div className="filters-container">
        <div className="filter-item">
          <label htmlFor="filter-category">Filter Category</label>
          <select
            id="filter-category"
            value={localCategory}
            onChange={handleCategoryChange}
          >
            <option value="All">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="filter-start-date">Start Date</label>
          <input
            type="date"
            id="filter-start-date"
            value={localStartDate}
            onChange={handleStartDateChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="filter-end-date">End Date</label>
          <input
            type="date"
            id="filter-end-date"
            value={localEndDate}
            onChange={handleEndDateChange}
          />
        </div>

        <button type="button" className="btn-reset" onClick={handleClear}>
          Clear Filters
        </button>
      </div>

      {/* Transactions Table List */}
      <div className="table-responsive">
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💸</div>
            <h3>No Transactions Found</h3>
            <p>Try refining your filters or add a new transaction to get started.</p>
          </div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Note</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>
                    <span className={`pill ${t.type.toLowerCase()}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>
                    <span className="category-tag">{t.category}</span>
                  </td>
                  <td>
                    <div className="table-note" title={t.note || 'None'}>
                      {t.note || '-'}
                    </div>
                  </td>
                  <td>
                    <span className={`table-amount ${t.type.toLowerCase()}`}>
                      {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
