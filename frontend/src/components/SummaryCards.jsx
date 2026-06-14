import React from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function SummaryCards({ summary }) {
  const {
    total_income = 0,
    total_expense = 0,
    net_balance = 0,
    top_spending_category = 'N/A'
  } = summary;

  const cardData = [
    {
      title: 'Total Income',
      value: formatCurrency(total_income),
      type: 'income',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      )
    },
    {
      title: 'Total Expense',
      value: formatCurrency(total_expense),
      type: 'expense',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      )
    },
    {
      title: 'Net Balance',
      value: formatCurrency(net_balance),
      type: 'balance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
          <line x1="12" y1="4" x2="12" y2="20"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
        </svg>
      )
    },
    {
      title: 'Top Category',
      value: top_spending_category,
      type: 'top-category',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      )
    }
  ];

  return (
    <div className="summary-grid">
      {cardData.map((card, idx) => (
        <div key={idx} className={`glass-panel summary-card ${card.type}`}>
          <div className="summary-info">
            <h3>{card.title}</h3>
            <div className="summary-value">{card.value}</div>
          </div>
          <div className="summary-icon">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
