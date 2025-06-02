# React Laravel DataTable

A TypeScript/JavaScript library for creating data tables with Laravel pagination API support and Tailwind CSS styling.

## Features

- 🚀 **Framework Agnostic**: Works with vanilla JavaScript, React, Vue, or any framework
- 📊 **Laravel Integration**: Seamless integration with Laravel's resource pagination
- 🎨 **Tailwind CSS**: Beautiful, responsive styling with Tailwind CSS
- 🔍 **Search & Sort**: Built-in search and sorting functionality
- 📱 **Responsive**: Mobile-friendly pagination and table design
- 🔧 **TypeScript**: Full TypeScript support with type definitions
- ⚡ **Lightweight**: Minimal dependencies, optimized for performance

## Installation

```bash
npm install @elselab-io/react-laravel-datatable
```

## Quick Start

### Vanilla JavaScript/TypeScript

```javascript
import { DataTable } from '@elselab-io/react-laravel-datatable';

// Define your columns
const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { 
    key: 'created_at', 
    label: 'Created', 
    render: (value) => new Date(value).toLocaleDateString() 
  }
];

// Configuration
const config = {
  apiUrl: '/api/users',
  perPage: 10,
  searchable: true,
  sortable: true
};

// Initialize the DataTable
const dataTable = new DataTable('#my-table', columns, config);
```

### React Component (Super Easy!)

```jsx
import React from 'react';
import { ReactDataTable, Column } from '@elselab-io/react-laravel-datatable';

// Define your data interface
interface Account {
  id: number;
  name: string;
  balance: string;
  is_verified: boolean;
}

// Define columns
const columns: Column<Account>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { 
    key: 'balance', 
    label: 'Balance',
    render: (value) => `${parseFloat(value).toLocaleString()}`
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
}
```

## Laravel Backend Setup

Your Laravel API should return paginated data in the standard Laravel format:

```php
// UserController.php
public function index(Request $request)
{
    $users = User::query()
        ->when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        })
        ->when($request->sort_by, function ($query, $sortBy) use ($request) {
            $query->orderBy($sortBy, $request->sort_direction ?? 'asc');
        })
        ->paginate($request->per_page ?? 10);

    return response()->json($users);
}
```

The response format should be:

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00.000000Z"
    }
  ],
  "first_page_url": "http://example.com/api/users?page=1",
  "from": 1,
  "last_page": 5,
  "last_page_url": "http://example.com/api/users?page=5",
  "links": [...],
  "next_page_url": "http://example.com/api/users?page=2",
  "path": "http://example.com/api/users",
  "per_page": 10,
  "prev_page_url": null,
  "to": 10,
  "total": 50
}
```

## API Reference

### DataTable Class

#### Constructor

```typescript
new DataTable<T>(container, columns, config)
```

**Parameters:**
- `container`: HTMLElement or string selector
- `columns`: Array of column definitions
- `config`: DataTable configuration object

#### Methods

- `refresh()`: Reload the current data
- `search(query: string)`: Perform a search
- `sort(key: string, direction: 'asc' | 'desc')`: Sort by column
- `getData()`: Get current pagination data

### Column Definition

```typescript
interface ColumnDefinition<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => any;
  className?: string;
}
```

### Configuration Options

```typescript
interface DataTableConfig {
  apiUrl: string;
  perPage?: number;
  searchable?: boolean;
  sortable?: boolean;
  className?: string;
  loadingText?: string;
  noDataText?: string;
  searchPlaceholder?: string;
}
```

## Styling

The library uses Tailwind CSS classes by default. Make sure you have Tailwind CSS included in your project:

```html
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
```

### Custom Styling

You can override the default classes by providing custom CSS:

```css
.datatable-container {
  /* Your custom styles */
}

.pagination-btn {
  /* Custom pagination button styles */
}

.pagination-btn.active {
  /* Active page button styles */
}
```

## Examples

### Advanced Column Rendering

```javascript
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => {
      const statusClass = value === 'active' ? 'text-green-600' : 'text-red-600';
      return `<span class="${statusClass}">${value}</span>`;
    }
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: (value, row) => `
      <button onclick="editUser(${row.id})" class="text-blue-600 hover:text-blue-800">
        Edit
      </button>
    `
  }
];
```

### Custom Search Parameters

```javascript
// You can extend the API parameters
const config = {
  apiUrl: '/api/users',
  // Add custom parameters that will be sent with each request
  customParams: {
    department: 'engineering',
    status: 'active'
  }
};
```

## TypeScript Support

The library is written in TypeScript and provides full type definitions:

```typescript
import { DataTable, LaravelPaginationResponse, ColumnDefinition } from '@elselab-io/react-laravel-datatable';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const columns: ColumnDefinition<User>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }
];

const dataTable = new DataTable<User>('#table', columns, config);
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
