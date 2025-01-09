"use client";

import React, { useState, useEffect } from 'react';

interface RateLimitResponse {
  status: number | 'Error';
  remaining: string | null;
  reset: string | null;
  timestamp: string;
  message: string;
}

export default function RateLimiterUI() {
  const [responses, setResponses] = useState<RateLimitResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const testRateLimit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rate-limiter');
      const data = await response.json();
      
      setResponses(prev => [{
        status: response.status,
        remaining: response.headers.get('X-RateLimit-Remaining'),
        reset: response.headers.get('X-RateLimit-Reset'),
        timestamp: new Date().toLocaleTimeString(),
        message: data.message
      }, ...prev.slice(0, 9)]);
    } catch (error) {
      setResponses(prev => [{
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        remaining: null,
        reset: null,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">API Rate Limiter Test</h1>
          <p className="text-gray-400">Test your rate limiting implementation</p>
        </div>

        {/* Test Button */}
        <button
          onClick={testRateLimit}
          disabled={loading}
          className="mb-8 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Testing...' : 'Test Rate Limit'}
        </button>

        {/* Response Log */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Request Log</h2>
          <div className="space-y-3">
            {responses.map((response, index) => (
              <div 
                key={index} 
                className={`p-3 rounded ${
                  response.status === 200 ? 'bg-gray-700' : 'bg-red-900/50'
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{response.timestamp}</span>
                  <span className={response.status === 200 ? 'text-green-400' : 'text-red-400'}>
                    Status: {response.status}
                  </span>
                </div>
                {response.remaining && (
                  <div className="text-sm text-gray-400">
                    Remaining requests: {response.remaining}
                  </div>
                )}
                <div className="text-sm">{response.message}</div>
              </div>
            ))}
            {responses.length === 0 && (
              <div className="text-gray-500 text-center py-4">
                No requests made yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}