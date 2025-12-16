import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes";
import { GlobalProvider } from "./context/GlobalContext";
import { Toaster } from "sonner";
import { WagmiProvider } from "wagmi";
import { config } from "./config/wagmi";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          {/* <Header /> */}
          <AppRoutes />
          <Toaster theme="light" />
          {/* <Footer /> */}
        </GlobalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
