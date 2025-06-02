import React, { useState } from 'react';
import { ReactDataTable, Column } from 'react-laravel-datatable';

// Define the Account interface based on your API
interface Account {
  id: number;
  name: string;
  description: string;
  slug: string;
  balance: string;
  account_no: string;
  guid: string;
  is_verified: boolean;
  registered_at: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

function App() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Define columns for the accounts table
  const columns: Column<Account>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      className: 'w-20',
    },
    {
      key: 'name',
      label: 'Account Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.account_no}</div>
        </div>
      ),
    },
    {
      key: 'balance',
      label: 'Balance',
      sortable: true,
      render: (value) => {
        const balance = parseFloat(value);
        const isNegative = balance < 0;
        return (
          <span className={`font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
            ${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      key: 'is_verified',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'registered_at',
      label: 'Registered',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  // Custom filters component
  const renderFilters = (filters: Record<string, any>, setFilters: (filters: Record<string, any>) => void) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Verification Status
        </label>
        <select
          value={filters.is_verified || ''}
          onChange={(e) => setFilters({ ...filters, is_verified: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Accounts</option>
          <option value="true">Verified Only</option>
          <option value="false">Unverified Only</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Balance
        </label>
        <input
          type="number"
          step="0.01"
          value={filters.min_balance || ''}
          onChange={(e) => setFilters({ ...filters, min_balance: e.target.value || undefined })}
          placeholder="e.g., 1000"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Balance
        </label>
        <input
          type="number"
          step="0.01"
          value={filters.max_balance || ''}
          onChange={(e) => setFilters({ ...filters, max_balance: e.target.value || undefined })}
          placeholder="e.g., 50000"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Laravel Accounts DataTable
          </h1>
          <p className="mt-2 text-gray-600">
            A complete example showing how easy it is to use React Laravel DataTable with your API
          </p>
        </div>

        {/* API Status */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                Connected to Laravel API: <code className="bg-blue-100 px-2 py-1 rounded">http://127.0.0.1:8000/api/v1/accounts</code>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Make sure your Laravel server is running on port 8000
              </p>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ReactDataTable<Account>
            apiUrl="/api/v1/accounts"
            columns={columns}
            initialPerPage={15}
            searchable={true}
            searchPlaceholder="Search accounts by name..."
            showPerPageSelector={true}
            perPageOptions={[10, 15, 25, 50]}
            onRowClick={(account) => setSelectedAccount(account)}
            renderFilters={renderFilters}
            loadingText="Loading accounts..."
            noDataText="No accounts found"
            errorText="Failed to load accounts"
          />
        </div>

        {/* Selected Account Modal */}
        {selectedAccount && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Account Details
                  </h3>
                  <button
                    onClick={() => setSelectedAccount(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAccount.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Number</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{selectedAccount.account_no}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Balance</label>
                      <p className={`mt-1 text-sm font-medium ${parseFloat(selectedAccount.balance) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${parseFloat(selectedAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedAccount.is_verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {selectedAccount.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAccount.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">GUID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedAccount.guid}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registered</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAccount.registered_at ? new Date(selectedAccount.registered_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Verified</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAccount.verified_at ? new Date(selectedAccount.verified_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedAccount(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Example */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">How Easy Is This?</h3>
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{`import { ReactDataTable, Column } from 'react-laravel-datatable';

interface Account {
  id: number;
  name: string;
  balance: string;
  is_verified: boolean;
  // ... other fields
}

const columns: Column<Account>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { 
    key: 'balance', 
    label: 'Balance',
    render: (value) => \`$\${parseFloat(value).toLocaleString()}\`
  },
  {
    key: 'is_verified',
    label: 'Status',
    render: (value) => value ? 'Verified' : 'Pending'
  }
];

function AccountsTable() {
  return (
    <ReactDataTable<Account>
      apiUrl="http://127.0.0.1:8000/api/v1/accounts"
      columns={columns}
      searchable={true}
      onRowClick={(account) => console.log('Clicked:', account)}
    />
  );
}`}</code>
          </pre>
          <p className="text-gray-300 text-sm mt-4">
            That's it! No complex setup, no manual pagination logic, no API handling. 
            Just define your columns and you're ready to go! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
