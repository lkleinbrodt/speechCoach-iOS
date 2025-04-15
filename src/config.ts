const API_CONFIG = {
  development: {
    baseURL: 'http://127.0.0.1:5002/api',
    timeout: 30000,
  },
  production: {
    baseURL: 'https://www.coyote-ai.com/api',
    timeout: 30000,
  },
};

export const getApiConfig = () => {
  return (
    API_CONFIG[process.env.NODE_ENV as keyof typeof API_CONFIG] ||
    API_CONFIG.development
  );
};
