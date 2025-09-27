import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    {
      id: 'cspm-executive',
      name: 'CSPM Executive Dashboard',
      widgets: [
        {
          id: 'cloud-accounts',
          name: 'Cloud Accounts',
          type: 'donut-chart',
          data: {
            connected: 2,
            notConnected: 2,
            total: 2
          },
          isVisible: true
        },
        {
          id: 'cloud-risk-assessment',
          name: 'Cloud Account Risk Assessment',
          type: 'risk-assessment',
          data: {
            failed: 1689,
            warning: 681,
            notAvailable: 36,
            passed: 7253,
            total: 9659
          },
          isVisible: true
        }
      ]
    },
    {
      id: 'cwpp-dashboard',
      name: 'CWPP Dashboard',
      widgets: [
        {
          id: 'top-5-namespace-alerts',
          name: 'Top 5 Namespace Specific Alerts',
          type: 'empty-graph',
          isVisible: true
        },
        {
          id: 'workload-alerts',
          name: 'Workload Alerts',
          type: 'empty-graph',
          isVisible: true
        }
      ]
    },
    {
      id: 'registry-scan',
      name: 'Registry Scan',
      widgets: [
        {
          id: 'image-risk-assessment',
          name: 'Image Risk Assessment',
          type: 'horizontal-bar',
          data: {
            critical: 9,
            high: 150,
            total: 1470
          },
          isVisible: true
        },
        {
          id: 'image-security-issues',
          name: 'Image Security Issues',
          type: 'horizontal-bar',
          data: {
            critical: 2,
            high: 2,
            total: 2
          },
          isVisible: true
        }
      ]
    }
  ],
  searchTerm: ''
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addWidget: (state, action) => {
      const { categoryId, widget } = action.payload;
      let targetCategory = null;
      
      if (categoryId) {
        targetCategory = state.categories.find(cat => cat.id === categoryId);
      } else {
        targetCategory = state.categories[0];
      }
      
      if (targetCategory) {
        const newWidget = {
          ...widget,
          id: `widget-${Date.now()}`,
          isVisible: true
        };
        targetCategory.widgets.push(newWidget);
      }
    },
    removeWidget: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets = category.widgets.filter(widget => widget.id !== widgetId);
      }
    },
    toggleWidgetVisibility: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        const widget = category.widgets.find(w => w.id === widgetId);
        if (widget) {
          widget.isVisible = !widget.isVisible;
        }
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  }
});

export const { addWidget, removeWidget, toggleWidgetVisibility, setSearchTerm } = dashboardSlice.actions;
export default dashboardSlice.reducer;