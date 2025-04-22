import { createQwen } from 'qwen-ai-provider';

// Model provider configuration
interface ModelProviderConfig {
  apiKey?: string;
  baseURL?: string;
}

// Default configuration
const defaultConfig: ModelProviderConfig = {
  apiKey: process.env.QWEN_API_KEY ,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
};

// Initialize Qwen model provider
export const initializeModelProvider = (config: ModelProviderConfig = defaultConfig) => {
  const qwen = createQwen({
    apiKey: config.apiKey || defaultConfig.apiKey,
    baseURL: config.baseURL || defaultConfig.baseURL,
  });
  
  return qwen;
};

// Get default model provider
export const getModelProvider = () => {
  return initializeModelProvider();
};

// Create a model instance with specified model name
export const createModel = (modelName: string = 'qwen-plus-2024-11-27') => {
  const provider = getModelProvider();
  return provider(modelName);
}; 