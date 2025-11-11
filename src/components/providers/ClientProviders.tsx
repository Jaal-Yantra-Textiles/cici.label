"use client";

import { ApiStatusProvider } from "@components/context/ApiStatusContext";
import store from "@redux/store";
import { Provider } from "react-redux";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApiStatusProvider>
      <Provider store={store}>
        {children}
      </Provider>
    </ApiStatusProvider>
  );
}
