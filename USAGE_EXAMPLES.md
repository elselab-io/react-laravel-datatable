# React Laravel DataTable - Usage Examples

This document shows how incredibly easy it is to use the React Laravel DataTable library with your Laravel API.

## 🚀 Super Simple React Example

With your Laravel API running at `http://127.0.0.1:8000/api/v1/accounts`, here's all you need:

```tsx
import { ReactDataTable, Column } from 'react-laravel-datatable';

interface Account {
  id: number;
  name: string;
  balance: string;
  is_verified: boolean;
  account_no: string;
  registered_at: string;
}

const columns: Column<Account>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Account Name', sortable: true },
  { 
    key: 'balance', 
    label: 'Balance',
    render: (value) => `$${parseFloat(value).toLocaleString()}`
  },
  {
    key: 'is_verified',
    label: 'Status',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {value ? 'Verified' : 'Pending'}
      </span>
    )
  },
  {
    key: 'registered_at',
    label: 'Registered',
    render: (value) => new Date(value).toLocaleDateString()
  }
];

function AccountsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Accounts</h1>
      
      <ReactDataTable<Account>
        apiUrl="http://127.0.0.1:8000/api/v1/accounts"
        columns={columns}
        searchable={true}
        searchPlaceholder="Search accounts..."
        onRowClick={(account) => alert(`Clicked: ${account.name}`)}
      />
    </div>
  );
}
```

**That's it!** 🎉 You get:
- ✅ Automatic pagination
- ✅ Search functionality
- ✅ Column sorting
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ TypeScript support

## 🎯 With Custom Filters

Want to add filters for your Laravel API parameters? Easy:

```tsx
function AccountsWithFilters() {
  const renderFilters = (filters: any, setFilters: any) => (
    <div className="grid grid-cols-3 gap-4">
      <select
        value={filters.is_verified || ''}
        onChange={(e) => setFilters({ ...filters, is_verified: e.target.value || undefined })}
        className="px-3 py-2 border rounded-md"
      >
        <option value="">All Accounts</option>
        <option value="true">Verified Only</option>
        <option value="false">Unverified Only</option>
      </select>
      
      <input
        type="number"
        placeholder="Min Balance"
        value={filters.min_balance || ''}
        onChange={(e) => setFilters({ ...filters, min_balance: e.target.value || undefined })}
        className="px-3 py-2 border rounded-md"
      />
      
      <input
        type="number"
        placeholder="Max Balance"
        value={filters.max_balance || ''}
        onChange={(e) => setFilters({ ...filters, max_balance: e.target.value || undefined })}
        className="px-3 py-2 border rounded-md"
      />
    </div>
  );

  return (
    <ReactDataTable<Account>
      apiUrl="http://127.0.0.1:8000/api/v1/accounts"
      columns={columns}
      renderFilters={renderFilters}
      searchable={true}
    />
  );
}
```

The library automatically sends these as query parameters:
- `?is_verified=true&min_balance=1000&max_balance=50000`

## 🔧 Advanced Usage with Hook

Need more control? Use the hook directly:

```tsx
import { useLaravelDataTable } from 'react-laravel-datatable';

function CustomAccountsTable() {
  const {
    data,
    pagination,
    loading,
    error,
    search,
    setSearch,
    setSort,
    setPage,
    setFilters,
    refresh
  } = useLaravelDataTable<Account>({
    apiUrl: 'http://127.0.0.1:8000/api/v1/accounts',
    initialPerPage: 20,
    initialFilters: { is_verified: true }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      
      <table>
        <thead>
          <tr>
            <th onClick={() => setSort('name')}>Name</th>
            <th onClick={() => setSort('balance')}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map(account => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>${parseFloat(account.balance).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Custom pagination */}
      <div>
        Page {pagination?.currentPage} of {pagination?.lastPage}
        <button onClick={() => setPage((pagination?.currentPage || 1) - 1)}>
          Previous
        </button>
        <button onClick={() => setPage((pagination?.currentPage || 1) + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## 📱 Complete Example App

Check out the complete React example in `examples/react-app/`:

```bash
cd examples/react-app
npm install
npm start
```

This shows:
- ✅ Full account management interface
- ✅ Custom filters (verification status, balance range)
- ✅ Row click handling with modal details
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Search functionality
- ✅ Sorting on all columns
- ✅ Pagination controls

## 🎨 Styling Examples

### Custom Column Styling

```tsx
const columns: Column<Account>[] = [
  {
    key: 'balance',
    label: 'Balance',
    className: 'text-right font-mono',
    render: (value) => {
      const balance = parseFloat(value);
      const isNegative = balance < 0;
      return (
        <span className={`font-bold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
          {isNegative ? '-' : ''}${Math.abs(balance).toLocaleString()}
        </span>
      );
    }
  },
  {
    key: 'name',
    label: 'Account',
    render: (value, row) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{row.account_no}</div>
      </div>
    )
  }
];
```

### Custom Table Styling

```tsx
<ReactDataTable
  className="my-custom-wrapper"
  tableClassName="border-collapse border border-gray-300"
  // ... other props
/>
```

## 🔄 Laravel API Integration

Your Laravel controller just needs to return the standard format:

```php
public function index(Request $request)
{
    $accounts = Account::query()
        ->when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })
        ->when($request->is_verified, function ($query, $verified) {
            $query->where('is_verified', $verified === 'true');
        })
        ->when($request->min_balance, function ($query, $min) {
            $query->where('balance', '>=', $min);
        })
        ->when($request->max_balance, function ($query, $max) {
            $query->where('balance', '<=', $max);
        })
        ->when($request->sort_by, function ($query, $sortBy) use ($request) {
            $query->orderBy($sortBy, $request->sort_direction ?? 'asc');
        })
        ->paginate($request->per_page ?? 15);

    return response()->json([
        'status' => 'success',
        'data' => $accounts->items(),
        'pagination' => [
            'current_page' => $accounts->currentPage(),
            'last_page' => $accounts->lastPage(),
            'per_page' => $accounts->perPage(),
            'total' => $accounts->total(),
            'from' => $accounts->firstItem(),
            'to' => $accounts->lastItem(),
        ]
    ]);
}
```

## 🚀 Why This Library is Amazing

### Before (Traditional Approach)
```tsx
// 100+ lines of code for:
// - State management for pagination, search, sorting
// - API calls with proper error handling
// - Loading states
// - URL parameter building
// - Pagination component
// - Search debouncing
// - Sort direction handling
// - Filter management
```

### After (With This Library)
```tsx
<ReactDataTable
  apiUrl="/api/accounts"
  columns={columns}
  searchable={true}
/>
// That's it! 3 lines for everything! 🎉
```

## 📦 Installation & Setup

1. **Install the library:**
```bash
npm install react-laravel-datatable
```

2. **Add Tailwind CSS:**
```html
<script src="https://cdn.tailwindcss.com"></script>
```

3. **Use it:**
```tsx
import { ReactDataTable } from 'react-laravel-datatable';
// Start building amazing tables!
```

## 🎯 Perfect For

- ✅ Admin dashboards
- ✅ Data management interfaces  
- ✅ User management systems
- ✅ Financial applications
- ✅ Inventory management
- ✅ Any Laravel + React app with tables

## 🤝 Support

- 📖 Full TypeScript support
- 🎨 Tailwind CSS styling
- 📱 Mobile responsive
- ⚡ Optimized performance
- 🔧 Highly customizable
- 📚 Comprehensive documentation

**Start building amazing data tables in minutes, not hours!** 🚀
