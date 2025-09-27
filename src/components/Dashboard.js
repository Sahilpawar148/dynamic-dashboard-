import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, RotateCcw, MoreVertical, Clock } from 'lucide-react';
import Widget from './Widget';
import AddWidgetModal from './AddWidgetModal';
import '../App.css';

const Dashboard = () => {
  const { categories } = useSelector(state => state.dashboard);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState('');

  const handleAddWidget = (categoryId) => {
    setTargetCategoryId(categoryId);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <nav className="breadcrumb">
          <span>Home</span>
          <span className="separator">›</span>
          <span className="current">Dashboard V2</span>
        </nav>
        
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="search-input"
          />
          <button className="icon-btn">
            <RotateCcw size={16} />
          </button>
          <button className="icon-btn">
            <MoreVertical size={16} />
          </button>
          <div className="time-selector">
            <Clock size={16} />
            <select className="time-select">
              <option>Last 2 days</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-title">
          <h1>CNAPP Dashboard</h1>
          <button 
            className="add-widget-btn"
            onClick={() => handleAddWidget('')}
          >
            Add Widget <Plus size={16} />
          </button>
        </div>

        {categories.map(category => (
          <div key={category.id} className="category-section">
            <h2 className="category-title">{category.name}</h2>
            
            <div className="widgets-grid">
              {category.widgets
                .filter(widget => widget.isVisible)
                .map(widget => (
                  <Widget 
                    key={widget.id} 
                    widget={widget} 
                    categoryId={category.id}
                  />
                ))}
              
              <div className="add-widget-placeholder">
                <button 
                  className="add-widget-placeholder-btn"
                  onClick={() => handleAddWidget(category.id)}
                >
                  <Plus size={16} />
                  Add Widget
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetCategoryId={targetCategoryId}
      />
    </div>
  );
};

export default Dashboard;