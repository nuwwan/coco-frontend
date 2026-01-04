/**
 * Grid Cell Renderers
 * Custom cell renderers for AG Grid with consistent styling
 */

import type { ICellRendererParams } from 'ag-grid-community';

// ============================================
// Badge Renderer
// ============================================

interface BadgeRendererProps extends ICellRendererParams {
  colorMap?: Record<string, string>;
}

/**
 * Renders a styled badge/pill for status, quality, etc.
 */
export const BadgeRenderer = (props: BadgeRendererProps) => {
  const value = props.value?.toString().toLowerCase() || '';
  
  // Default color map
  const defaultColorMap: Record<string, string> = {
    // Status colors
    active: 'bg-emerald-500/20 text-emerald-400',
    inactive: 'bg-red-500/20 text-red-400',
    pending: 'bg-amber-500/20 text-amber-400',
    received: 'bg-blue-500/20 text-blue-400',
    inspected: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
    processing: 'bg-amber-500/20 text-amber-400',
    shipped: 'bg-blue-500/20 text-blue-400',
    delivered: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
    // Quality colors
    premium: 'bg-purple-500/20 text-purple-400',
    standard: 'bg-blue-500/20 text-blue-400',
    economy: 'bg-slate-500/20 text-slate-400',
    // Product type colors
    fiber: 'bg-purple-500/20 text-purple-400',
    chips: 'bg-amber-500/20 text-amber-400',
    peat: 'bg-green-500/20 text-green-400',
    mixed: 'bg-blue-500/20 text-blue-400',
    // Role colors
    manager: 'bg-purple-500/20 text-purple-400',
    supervisor: 'bg-blue-500/20 text-blue-400',
    worker: 'bg-slate-500/20 text-slate-400',
  };

  const colorMap = props.colorMap || defaultColorMap;
  const colorClass = colorMap[value] || 'bg-slate-500/20 text-slate-400';
  const displayValue = value.replace(/-/g, ' ');

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {displayValue}
    </span>
  );
};

// ============================================
// Currency Renderer
// ============================================

interface CurrencyRendererProps extends ICellRendererParams {
  currency?: string;
}

/**
 * Renders a formatted currency value
 */
export const CurrencyRenderer = (props: CurrencyRendererProps) => {
  const value = props.value;
  const currency = props.currency || '$';
  
  if (value === null || value === undefined) return null;
  
  const formattedValue = Number(value).toLocaleString();
  
  return (
    <span className="text-emerald-400 font-medium">
      {currency}{formattedValue}
    </span>
  );
};

// ============================================
// Avatar Renderer
// ============================================

interface AvatarRendererProps extends ICellRendererParams {
  nameField?: string;
}

/**
 * Renders an avatar with initials and name
 */
export const AvatarRenderer = (props: AvatarRendererProps) => {
  const name = props.value?.toString() || '';
  const initial = name.charAt(0).toUpperCase();
  
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
        {initial}
      </div>
      <span className="text-white font-medium">{name}</span>
    </div>
  );
};

// ============================================
// Date Renderer
// ============================================

interface DateRendererProps extends ICellRendererParams {
  showTime?: boolean;
}

/**
 * Renders a formatted date
 */
export const DateRenderer = (props: DateRendererProps) => {
  const value = props.value;
  
  if (!value) return null;
  
  const date = new Date(value);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <span className="text-slate-300">{formattedDate}</span>
  );
};

// ============================================
// Lot Number Renderer
// ============================================

interface LotNumberRendererProps extends ICellRendererParams {
  dateField?: string;
}

/**
 * Renders a lot number with date below
 */
export const LotNumberRenderer = (props: LotNumberRendererProps) => {
  const lotNumber = props.value?.toString() || '';
  const dateField = props.dateField || 'receivedDate';
  const date = props.data?.[dateField];
  
  return (
    <div>
      <span className="text-white font-mono">{lotNumber}</span>
      {date && (
        <p className="text-slate-400 text-xs mt-1">{date}</p>
      )}
    </div>
  );
};

// ============================================
// Actions Renderer
// ============================================

interface ActionsRendererProps extends ICellRendererParams {
  onView?: (data: unknown) => void;
  onEdit?: (data: unknown) => void;
  onDelete?: (data: unknown) => void;
}

/**
 * Renders action buttons (view, edit, delete)
 */
export const ActionsRenderer = (props: ActionsRendererProps) => {
  const { data, onView, onEdit, onDelete } = props;
  
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) onView(data);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(data);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(data);
  };
  
  return (
    <div className="flex items-center justify-end space-x-1">
      {onView && (
        <button
          onClick={handleView}
          className="text-slate-400 hover:text-white p-2 transition-colors"
          title="View"
        >
          👁️
        </button>
      )}
      {onEdit && (
        <button
          onClick={handleEdit}
          className="text-slate-400 hover:text-white p-2 transition-colors"
          title="Edit"
        >
          ✏️
        </button>
      )}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-400 p-2 transition-colors"
          title="Delete"
        >
          🗑️
        </button>
      )}
    </div>
  );
};

// ============================================
// Quantity Renderer
// ============================================

interface QuantityRendererProps extends ICellRendererParams {
  unitField?: string;
}

/**
 * Renders quantity with unit
 */
export const QuantityRenderer = (props: QuantityRendererProps) => {
  const value = props.value;
  const unitField = props.unitField || 'unit';
  const unit = props.data?.[unitField] || '';
  
  if (value === null || value === undefined) return null;
  
  const formattedValue = Number(value).toLocaleString();
  
  return (
    <span className="text-slate-300">
      {formattedValue} {unit}
    </span>
  );
};

