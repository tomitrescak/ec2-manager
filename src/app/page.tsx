"use client";

import { useState, useEffect } from "react";
import { InstanceStatus } from "@/lib/aws";

export default function Home() {
  const [instanceStatus, setInstanceStatus] = useState<InstanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string, debug?: string } | null>(null);

  const fetchInstanceStatus = async () => {
    try {
      const response = await fetch('/api/ec2/status');
      if (response.ok) {
        const data = await response.json();
        setInstanceStatus(data);
      } else {
        const data = await response.json();
        if (data.debug) {
          setMessage({ type: 'error', text: data.error || 'Failed to fetch instance status', debug: data.debug });
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to fetch instance status' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching instance status' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'start' | 'stop') => {
    if (!password) {
      setMessage({ type: 'error', text: 'Password is required' });
      return;
    }

    setActionLoading(action);
    setMessage(null);

    try {
      const response = await fetch(`/api/ec2/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setPassword("");
        // Refresh status after a short delay
        setTimeout(fetchInstanceStatus, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Action failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to ${action} instance` });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchInstanceStatus();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchInstanceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'running': return 'text-green-600';
      case 'stopped': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      case 'stopping': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            EC2 Instance Monitor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and control your AWS EC2 instance
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : instanceStatus ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Instance Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Instance ID</label>
                <p className="text-lg font-mono text-gray-900 dark:text-white">{instanceStatus.instanceId}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">State</label>
                <p className={`text-lg font-semibold capitalize ${getStatusColor(instanceStatus.state)}`}>
                  {instanceStatus.state}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Instance Type</label>
                <p className="text-lg text-gray-900 dark:text-white">{instanceStatus.instanceType || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Public IP</label>
                <p className="text-lg font-mono text-gray-900 dark:text-white">{instanceStatus.publicIp || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Private IP</label>
                <p className="text-lg font-mono text-gray-900 dark:text-white">{instanceStatus.privateIp || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Launch Time</label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {instanceStatus.launchTime ? new Date(instanceStatus.launchTime).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="border-t dark:border-gray-600 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Instance Control
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction('start')}
                    disabled={actionLoading === 'start' || instanceStatus.state === 'running'}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {actionLoading === 'start' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : null}
                    Start
                  </button>
                  <button
                    onClick={() => handleAction('stop')}
                    disabled={actionLoading === 'stop' || instanceStatus.state === 'stopped'}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {actionLoading === 'stop' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : null}
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600 dark:text-red-400">
            Failed to load instance information
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-lg mb-4 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            <div>{message.text}</div>
            {message.debug && (
              <div className="mt-4" dangerouslySetInnerHTML={{ __html: message.debug }} />
            )}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={fetchInstanceStatus}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}
