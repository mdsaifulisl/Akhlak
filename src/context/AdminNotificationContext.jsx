import { createContext, useContext, useState } from "react";

const AdminNotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminNotification = () => useContext(AdminNotificationContext);

export const AdminNotificationProvider = ({ children }) => {
  const [hasNewOrder, setHasNewOrder] = useState(
    localStorage.getItem("newOrder") === "true"
  );

  const showNewOrderNotification = () => {
    setHasNewOrder(true);
    localStorage.setItem("newOrder", "true");
  };

  const clearNotification = () => {
    setHasNewOrder(false);
    localStorage.removeItem("newOrder");
  };

  return (
    <AdminNotificationContext.Provider
      value={{ hasNewOrder, showNewOrderNotification, clearNotification }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};
