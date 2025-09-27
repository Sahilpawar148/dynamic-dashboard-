import React from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { removeWidget } from '../store/dashboardSlice';

const Widget = ({ widget, categoryId }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeWidget({ categoryId, widgetId: widget.id }));
  };

  if (!widget.isVisible) return null;


  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'donut-chart':
        return <DonutChart data={widget.data} />;
      case 'horizontal-bar':
      case 'bar-chart':
        return <BarChart data={widget.data} />;
      case 'risk-assessment':
        return <RiskAssessment data={widget.data} />;
      case 'empty-graph':
        return <EmptyGraph />;
      default:
        return <div className="widget-text">{widget.text}</div>;
    }
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <h3 className="widget-title">{widget.name}</h3>
        <button className="remove-btn" onClick={handleRemove}>
          <X size={16} />
        </button>
      </div>
      <div className="widget-content">
        {renderWidgetContent()}
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ data }) => {
  const { connected, notConnected, total } = data;
  const connectedPercentage = (connected / total) * 100;
  
  return (
    <div className="donut-chart-container">
      <div className="donut-chart">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
          />
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="20"
            strokeDasharray={`${connectedPercentage * 2.51} ${(100 - connectedPercentage) * 2.51}`}
            strokeDashoffset="0"
            transform="rotate(-90 60 60)"
            strokeLinecap="round"
          />
          <text x="60" y="55" textAnchor="middle" className="donut-number">
            {total}
          </text>
          <text x="60" y="70" textAnchor="middle" className="donut-label">
            Total
          </text>
        </svg>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{backgroundColor: '#3b82f6'}}></span>
          <span>Connected ({connected})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{backgroundColor: '#e5e7eb'}}></span>
          <span>Not Connected ({notConnected})</span>
        </div>
      </div>
    </div>
  );
};


const RiskAssessment = ({ data }) => {
  const { failed, warning, notAvailable, passed, total } = data;
  
  const segments = [
    { value: failed, color: '#ef4444', label: 'Failed' },
    { value: warning, color: '#f59e0b', label: 'Warning' },
    { value: notAvailable, color: '#d1d5db', label: 'Not Available' },
    { value: passed, color: '#10b981', label: 'Passed' }
  ];
  
  let cumulativePercentage = 0;
  
  return (
    <div className="risk-assessment-container">
      <div className="risk-donut-chart">
        <svg width="150" height="150" viewBox="0 0 150 150">
          {segments.map((segment, index) => {
            const percentage = (segment.value / total) * 100;
            const strokeDasharray = `${percentage * 3.14} ${(100 - percentage) * 3.14}`;
            const strokeDashoffset = -cumulativePercentage * 3.14;
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                cx="75"
                cy="75"
                r="50"
                fill="none"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 75 75)"
                strokeLinecap="round"
              />
            );
          })}
          <text x="75" y="70" textAnchor="middle" className="donut-number">
            {total}
          </text>
          <text x="75" y="85" textAnchor="middle" className="donut-label">
            Total
          </text>
        </svg>
      </div>
      <div className="risk-legend">
        {segments.map((segment, index) => (
          <div key={index} className="legend-item">
            <span className="legend-dot" style={{backgroundColor: segment.color}}></span>
            <span>{segment.label} ({segment.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Empty Graph Placeholder
const EmptyGraph = () => (
  <div className="empty-graph">
    <svg width="200" height="100" viewBox="0 0 200 100">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="200" height="100" fill="url(#grid)" />
      <path d="M 20 80 L 60 60 L 100 70 L 140 40 L 180 30" 
            stroke="#d1d5db" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="5,5"/>
    </svg>
    <div className="empty-graph-text">No Graph data available!</div>
  </div>
);

// Horizontal Progress Bar Component
const BarChart = ({ data }) => {
  const { critical, high, total } = data;
  const criticalPercentage = (critical / total) * 100;
  const highPercentage = (high / total) * 100;
  const remainingPercentage = 100 - criticalPercentage - highPercentage;
  
  return (
    <div className="progress-bar-container">
      <div className="progress-header">
        <span className="total-count">{total}</span>
        <span className="total-label">Total vulnerabilities</span>
      </div>
      
      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div 
            className="progress-segment critical-segment" 
            style={{width: `${criticalPercentage}%`}}
          ></div>
          <div 
            className="progress-segment high-segment" 
            style={{width: `${highPercentage}%`}}
          ></div>
          <div 
            className="progress-segment remaining-segment" 
            style={{width: `${remainingPercentage}%`}}
          ></div>
        </div>
      </div>
      
      <div className="progress-legend">
        <div className="legend-item">
          <span className="legend-dot critical-dot"></span>
          <span>Critical ({critical})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot high-dot"></span>
          <span>High ({high})</span>
        </div>
      </div>
    </div>
  );
};

export default Widget;