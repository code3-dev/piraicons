// Custom logger that suppresses logs in production/deployment environments

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// Only log in development or test environments
const shouldLog = isDevelopment || isTest;

export const logger = {
  log: (...args: any[]) => {
    if (shouldLog) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (shouldLog) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (shouldLog) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (shouldLog) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (shouldLog) {
      console.debug(...args);
    }
  }
};