import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Search } from 'lucide-react';
import { addWidget, toggleWidgetVisibility, setSearchTerm } from '../store/dashboardSlice';

const AddWidgetModal = ({ isOpen, onClose, targetCategoryId }) => {
  const dispatch = useDispatch();
  const { categories, searchTerm } = useSelector(state => state.dashboard);
  const [newWidget, setNewWidget] = useState({ name: '', text: '', type: 'text' });
  const [activeTab, setActiveTab] = useState('CSPM');

  if (!isOpen) return null;

  const handleAddWidget = () => {
    if (newWidget.name.trim() && newWidget.text.trim() && targetCategoryId) {
      const widgetToAdd = {
        name: newWidget.name,
        type: 'text', 
        text: newWidget.text
      };
      
      dispatch(addWidget({ 
        categoryId: targetCategoryId, 
        widget: widgetToAdd 
      }));
      setNewWidget({ name: '', text: '', type: 'text' });
      onClose();
    }
  };

  const handleToggleWidget = (categoryId, widgetId) => {
    dispatch(toggleWidgetVisibility({ categoryId, widgetId }));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    widgets: category.widgets.filter(widget =>
      widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.widgets.length > 0);

  const tabs = ['CSPM', 'CWPP', 'Image', 'Ticket'];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Widget</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p>Personalise your dashboard by adding the following widget</p>
          
          <div className="tab-container">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="widget-list">
            {filteredCategories.map(category => (
              <div key={category.id} className="category-section-modal">
                <h4>{category.name}</h4>
                {category.widgets.map(widget => (
                  <div key={widget.id} className="widget-checkbox-item">
                    <input
                      type="checkbox"
                      id={widget.id}
                      checked={widget.isVisible}
                      onChange={() => handleToggleWidget(category.id, widget.id)}
                    />
                    <label htmlFor={widget.id}>
                      {widget.name} {widget.type !== 'text' && <span className="widget-type-badge">({widget.type})</span>}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="add-new-widget">
            <h4>Add New Widget</h4>
            <div className="form-group">
              <input
                type="text"
                placeholder="Widget Name"
                value={newWidget.name}
                onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Widget Text/Description"
                value={newWidget.text}
                onChange={(e) => setNewWidget({ ...newWidget, text: e.target.value })}
                className="form-textarea"
                rows="3"
              />
            </div>
            <div className="widget-type-info">
              <small>Note: Custom widgets will display as text. Pre-built widgets include charts and graphs.</small>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleAddWidget}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;