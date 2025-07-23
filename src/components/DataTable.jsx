"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card } from './ui/card';
import { 
  PencilIcon,
  PlusIcon, 
  TrashIcon,
  EyeIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  Loader2Icon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DataTable({
  title,
  data = [],
  columns = [],
  loading = false,
  error = null,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchFields = [],
  filterOptions = {},
  entityType = 'item',
  showView = false
}) {
  // For agent assignment dropdown
  const [agents, setAgents] = useState([]);
  useEffect(() => {
    // Only fetch agents if assignedTo column is present
    if (columns.some(col => col.field === 'assignedTo')) {
      fetch('/api/agents')
        .then(res => res.json())
        .then(data => setAgents(data || []));
    }
  }, [columns]);

  // Inline update for assignedTo
  const handleAssignAgent = async (ticketId, newAssigned) => {
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: newAssigned })
      });
    } catch (err) {
      alert('Failed to assign agent');
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((value, key) => value?.[key], obj);
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      result = result.filter(item =>
        searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key);
          return itemValue === value;
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, searchFields]);

  // Render cell content based on column configuration
  const renderCellContent = (item, column) => {
    const value = getNestedValue(item, column.field);
    // Inline agent assignment for assignedTo column
    if (column.field === 'assignedTo') {
      return (
        <Select
          value={Array.isArray(value) ? value[0] : value}
          onValueChange={async (newValue) => {
            await handleAssignAgent(item._id, [newValue]);
            // Optionally, update UI optimistically
            if (item.assignedTo) item.assignedTo = [newValue];
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map(agent => (
              <SelectItem key={agent._id} value={agent.email}>
                {agent.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    switch (column.type) {
      case 'avatar':
        return (
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 text-sm font-medium",
            value ? "overflow-hidden" : ""
          )}>
            {value ? (
              <img src={value} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              column.fallback ? getNestedValue(item, column.fallback)?.charAt(0).toUpperCase() : '?'
            )}
          </div>
        );
      case 'chips':
        return (
          <div className="flex flex-wrap gap-1">
            {value?.map((chipValue, index) => (
              <span
                key={`${item._id}-${column.field}-${index}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
              >
                {chipValue}
              </span>
            ))}
          </div>
        );
      case 'status':
        return (
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs",
            column.statusColors?.[value] === 'success' && "bg-green-100 text-green-800",
            column.statusColors?.[value] === 'warning' && "bg-yellow-100 text-yellow-800",
            column.statusColors?.[value] === 'error' && "bg-red-100 text-red-800",
            column.statusColors?.[value] === 'info' && "bg-blue-100 text-blue-800",
            !column.statusColors?.[value] && "bg-gray-100 text-gray-800"
          )}>
            {value}
          </span>
        );
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '';
      default:
        return value || '';
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item || !onDelete) return;
    
    setDeleting(true);
    try {
      await onDelete(deleteDialog.item._id);
      setDeleteDialog({ open: false, item: null });
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">
          {title}
        </h1>
        {onAdd && (
          <Button onClick={onAdd}>
            <PlusIcon className="w-4 h-4 mr-2" />
            New {entityType}
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Search */}
        {searchFields.length > 0 && (
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${entityType}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Filters */}
        {Object.entries(filterOptions).map(([filterKey, options]) => (
          <Select
            key={filterKey}
            value={filters[filterKey] || 'all'}
            onValueChange={(value) => handleFilterChange(filterKey, value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={options.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {options.label}</SelectItem>
              {options.values.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredData.length} of {data.length} {entityType}s
      </p>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2Icon className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.field}>{column.header}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow 
                  key={item._id}
                  onClick={() => onView && onView(item._id)}
                  className={onView ? "cursor-pointer" : ""}
                >
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {renderCellContent(item, column)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div 
                      className="flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {showView && onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(item._id)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item._id)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-500">
                      {data.length === 0 ? `No ${entityType}s yet` : `No ${entityType}s match your search criteria`}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {data.length === 0 ? `Create your first ${entityType} to get started` : 'Try adjusting your search or filters'}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={() => !deleting && handleDeleteCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {entityType}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {entityType}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
