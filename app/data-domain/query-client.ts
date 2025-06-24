import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: () => 60 * 1000, // 60 seconds
    },
    hydrate: {
      queries:{
        networkMode: 'online', // tries cache first, then network
      }
    }
  },
});

export default queryClient;
