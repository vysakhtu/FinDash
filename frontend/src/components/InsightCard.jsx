import React from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function InsightCard({ summary }) {
  const {
    total_income = 0,
    total_expense = 0,
    expense_by_category = []
  } = summary;

 
  const generateInsight = () => {
    if (total_expense === 0) {
      return {
        title: 'Perfect Savings Rate',
        message: 'You have not recorded any expenses yet. Your current savings rate is 100%. Keep it up!',
        highlight: '100% savings',
        type: 'success'
      };
    }

  
    if (total_income > 0 && total_expense > total_income) {
      const percentage = Math.round((total_expense / total_income) * 100);
      return {
        title: 'Budget Deficit Alert',
        message: `Your total expenses account for ${percentage}% of your income. You are currently spending more than you earn.`,
        highlight: `${percentage}% of income`,
        type: 'danger'
      };
    }

 
    if (expense_by_category && expense_by_category.length > 0) {
      const topCategoryObj = expense_by_category[0]; // 
      const topCategoryName = topCategoryObj.name;
      const topCategoryValue = topCategoryObj.value;
      const percentage = Math.round((topCategoryValue / total_expense) * 100);

      if (percentage >= 40) {
        return {
          title: 'High Category Concentration',
          message: `You spend more than 40% of your expenses on ${topCategoryName}. Specifically, it accounts for ${percentage}% of your total expenses.`,
          highlight: `${percentage}% on ${topCategoryName}`,
          type: 'warning'
        };
      }

    
      return {
        title: 'Highest Spending Category',
        message: `${topCategoryName} is your highest spending category, representing ${percentage}% of your total monthly outflow (${formatCurrency(topCategoryValue)}).`,
        highlight: `${topCategoryName}`,
        type: 'info'
      };
    }

    return {
      title: 'Healthy Cash Flow',
      message: 'Your transactions are well distributed. Maintain your current tracking schedule to build long-term insights.',
      highlight: 'tracking schedule',
      type: 'info'
    };
  };

  const insight = generateInsight();

  const getColors = () => {
    switch (insight.type) {
      case 'danger':
        return { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', icon: '🚨' };
      case 'warning':
        return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: '⚠️' };
      case 'success':
        return { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: '🌱' };
      default:
        return { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', icon: '💡' };
    }
  };

  const colors = getColors();

  return (
    <div 
      className="glass-panel insight-panel" 
      style={{ 
        borderLeft: `4px solid ${colors.border}`,
      }}
    >
      <div 
        className="insight-icon-container" 
        style={{ 
          background: colors.bg,
          color: colors.color,
          boxShadow: `0 0 15px ${colors.bg}`
        }}
      >
        <span role="img" aria-label="insight-icon">{colors.icon}</span>
      </div>
      <div className="insight-body">
        <h3>{insight.title}</h3>
        <p className="insight-text">
          {insight.message.split(insight.highlight).map((text, idx, arr) => (
            <React.Fragment key={idx}>
              {text}
              {idx < arr.length - 1 && (
                <span className="insight-highlight" style={{ color: colors.color }}>
                  {insight.highlight}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
