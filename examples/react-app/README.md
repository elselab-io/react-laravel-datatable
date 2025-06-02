# React Laravel DataTable Example

This is a complete React application demonstrating how to use the React Laravel DataTable library with your Laravel API.

## Features Demonstrated

- ✅ **Easy Setup**: Just define columns and API URL
- ✅ **Search**: Real-time search functionality
- ✅ **Sorting**: Click column headers to sort
- ✅ **Pagination**: Automatic pagination with page controls
- ✅ **Filtering**: Custom filters (verification status, balance range)
- ✅ **Row Actions**: Click rows to view details
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Loading States**: Proper loading and error handling
- ✅ **TypeScript**: Full type safety

## Prerequisites

1. **Laravel API Running**: Make sure your Laravel server is running on `http://127.0.0.1:8000`
2. **Node.js**: Version 16 or higher
3. **npm or yarn**: Package manager

## Quick Start

### 1. Install Dependencies

```bash
cd examples/react-app
npm install
```

### 2. Start the React App

```bash
npm start
```

The app will open at `http://localhost:3000` and automatically proxy API requests to your Laravel server.

### 3. Verify Laravel API

Make sure your Laravel API is accessible:
```bash
curl http://127.0.0.1:8000/api/v1/accounts
```

## Code Overview

### Main Component (`src/App.tsx`)

```tsx
import { ReactDataTable, Column } from 'react-laravel-datatable';

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
    render: (value) => `$${parseFloat(value).toLocaleString()}`
  },
  {
    key: 'is_verified',
    label: 'Status',
    render: (value) => value ? 'Verified' : 'Pending'
  }
];

function App() {
  return (
    <ReactDataTable<Account>
      apiUrl="/api/v1/accounts"
      columns={columns}
      searchable={true}
      onRowClick={(account) => console.log('Clicked:', account)}
    />
  );
}
```

### Key Features

#### 1. **Column Definitions**
```tsx
const columns: Column<Account>[] = [
  {
    key: 'name',
    label: 'Account Name',
    sortable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium">{value}</div>
        <div className="text-sm text-gray-500">{row.account_no}</div>
      </div>
    ),
  },
  // ... more columns
];
```

#### 2. **Custom Filters**
```tsx
const renderFilters = (filters, setFilters) => (
  <div className="grid grid-cols-3 gap-4">
    <select
      value={filters.is_verified || ''}
      onChange={(e) => setFilters({ ...filters, is_verified: e.target.value })}
    >
      <option value="">All Accounts</option>
      <option value="true">Verified Only</option>
      <option value="false">Unverified Only</option>
    </select>
    {/* More filters... */}
  </div>
);

<ReactDataTable
  // ... other props
  renderFilters={renderFilters}
/>
```

#### 3. **Row Click Handling**
```tsx
const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

<ReactDataTable
  // ... other props
  onRowClick={(account) => setSelectedAccount(account)}
/>
```

## API Integration

The component automatically handles:

- **Pagination**: `?page=1&per_page=15`
- **Search**: `?search=company+name`
- **Sorting**: `?sort_by=balance&sort_direction=desc`
- **Filters**: `?is_verified=true&min_balance=1000`

### Expected API Response Format

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "balance": "25000.50",
      "is_verified": true,
      // ... other fields
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 67,
    "per_page": 15,
    "total": 1000,
    "from": 1,
    "to": 15
  }
}
```

## Customization

### Styling

The component uses Tailwind CSS classes. You can customize the appearance by:

1. **Override default classes**:
```tsx
<ReactDataTable
  className="my-custom-table"
  tableClassName="custom-table-styles"
  // ... other props
/>
```

2. **Custom column styling**:
```tsx
const columns: Column<Account>[] = [
  {
    key: 'balance',
    label: 'Balance',
    className: 'text-right font-mono',
    render: (value) => {
      const balance = parseFloat(value);
      return (
        <span className={balance < 0 ? 'text-red-600' : 'text-green-600'}>
          ${Math.abs(balance).toLocaleString()}
        </span>
      );
    }
  }
];
```

### Advanced Usage

#### Using the Hook Directly

```tsx
import { useLaravelDataTable } from 'react-laravel-datatable';

function CustomTable() {
  const {
    data,
    pagination,
    loading,
    error,
    setSearch,
    setSort,
    setPage,
    setFilters,
  } = useLaravelDataTable({
    apiUrl: '/api/v1/accounts',
    initialPerPage: 20,
    initialFilters: { is_verified: true },
  });

  // Build your own custom UI
  return (
    <div>
      {/* Custom search input */}
      <input onChange={(e) => setSearch(e.target.value)} />
      
      {/* Custom table */}
      <table>
        {/* Your custom table implementation */}
      </table>
      
      {/* Custom pagination */}
      <div>
        {/* Your custom pagination controls */}
      </div>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure your Laravel API has CORS enabled
   - Check that the proxy in `package.json` points to the correct Laravel URL

2. **API Not Found**
   - Verify Laravel server is running: `php artisan serve`
   - Check the API endpoint: `curl http://127.0.0.1:8000/api/v1/accounts`

3. **TypeScript Errors**
   - Make sure all dependencies are installed: `npm install`
   - Check that the interface matches your API response

### Development Tips

1. **Debug API Calls**: Open browser DevTools → Network tab to see API requests
2. **Check Console**: Look for any JavaScript errors in the browser console
3. **Verify Data**: Use `console.log` in render functions to inspect data

## Production Deployment

When deploying to production:

1. **Update API URL**: Change from localhost to your production API URL
2. **Build the App**: Run `npm run build`
3. **Serve Static Files**: Deploy the `build` folder to your web server
4. **Configure CORS**: Ensure your Laravel API allows requests from your domain

## Next Steps

- Explore more column render options
- Add custom loading spinners
- Implement bulk actions
- Add export functionality
- Create reusable filter components

## Support

If you encounter any issues:

1. Check the main library documentation
2. Review the TypeScript interfaces for proper usage
3. Look at the browser console for error messages
4. Verify your Laravel API is returning the expected format
