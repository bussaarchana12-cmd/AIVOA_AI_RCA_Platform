import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleNotifications, markNotificationAsRead, markAllNotificationsRead } from '../../store/uiSlice';
import { Bell, X, CheckCheck, AlertTriangle, Info, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.isNotificationsOpen);
  const notifications = useAppSelector(state => state.ui.notifications);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/20 backdrop-blur-xs flex justify-end">
      <div className="w-96 bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-900">Quality & CAPA Notifications</h3>
          </div>
          <button
            onClick={() => dispatch(toggleNotifications())}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Recent Activity</span>
          <button
            onClick={() => dispatch(markAllNotificationsRead())}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.map((notif) => {
            const Icon = notif.type === 'alert' ? AlertOctagon : notif.type === 'warning' ? AlertTriangle : notif.type === 'success' ? CheckCircle2 : Info;
            const iconColor = notif.type === 'alert' ? 'text-red-600 bg-red-50' : notif.type === 'warning' ? 'text-amber-600 bg-amber-50' : notif.type === 'success' ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50';

            return (
              <div
                key={notif.id}
                onClick={() => dispatch(markNotificationAsRead(notif.id))}
                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !notif.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center">
          21 CFR Part 11 electronic audit trail logs active
        </div>
      </div>
    </div>
  );
};
