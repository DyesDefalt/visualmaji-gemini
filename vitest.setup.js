import '@testing-library/jest-dom';
import React from 'react';

// Make React available globally for JSX transformation
globalThis.React = React;

// Mock localStorage for testing
const localStorageMock = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});
