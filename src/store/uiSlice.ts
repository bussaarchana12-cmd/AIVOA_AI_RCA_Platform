import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ActiveNavTab =
  | 'dashboard'
  | 'new-investigation'
  | 'ai-assistant'
  | 'root-cause-analysis'
  | 'evidence-review'
  | 'capa-management'
  | 'investigation-history'
  | 'settings';

export type UserRole = 'Senior Quality Investigator' | 'QA Compliance Reviewer' | 'Regulatory GMP Auditor';

interface UiState {
  currentTab: ActiveNavTab;
  userRole: UserRole;
  userName: string;
  notifications: Array<{ id: string; title: string; message: string; type: 'info' | 'warning' | 'alert' | 'success'; time: string; read: boolean }>;
  isNotificationsOpen: boolean;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
}

const initialState: UiState = {
  currentTab: 'dashboard',
  userRole: 'Senior Quality Investigator',
  userName: 'Marcus Vance, M.Sc.',
  notifications: [
    {
      id: 'notif-1',
      title: 'CAPA Action Due Soon',
      message: 'CAPA-2026-001 (Valve rebuild on R-301) target date is in 7 days.',
      type: 'warning',
      time: '12m ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Evidence Record Uploaded',
      message: 'DeltaV SCADA thermal log ingested for Batch BATCH-2026-045.',
      type: 'info',
      time: '1h ago',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Critical Deviation Flagged',
      message: 'DEV-API-2026-052 (Dexamethasone Endotoxin) elevated to Critical QA priority.',
      type: 'alert',
      time: '3h ago',
      read: true
    }
  ],
  isNotificationsOpen: false,
  toastMessage: null
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<ActiveNavTab>) => {
      state.currentTab = action.payload;
    },
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      state.userRole = action.payload;
    },
    toggleNotifications: (state) => {
      state.isNotificationsOpen = !state.isNotificationsOpen;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => { n.read = true; });
    },
    showToast: (state, action: PayloadAction<{ text: string; type: 'success' | 'error' | 'info' }>) => {
      state.toastMessage = action.payload;
    },
    clearToast: (state) => {
      state.toastMessage = null;
    }
  }
});

export const {
  setCurrentTab,
  setUserRole,
  toggleNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
  showToast,
  clearToast
} = uiSlice.actions;

export default uiSlice.reducer;
