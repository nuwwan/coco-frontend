/**
 * DataGrid Component
 * Reusable AG Grid wrapper with consistent dark theme styling
 */

import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Custom dark theme based on Quartz
const darkTheme = themeQuartz.withParams({
  // Background colors
  backgroundColor: 'rgb(30 41 59)', // slate-800
  foregroundColor: 'rgb(226 232 240)', // slate-200
  
  // Header styling
  headerBackgroundColor: 'rgb(51 65 85)', // slate-700
  headerTextColor: 'rgb(148 163 184)', // slate-400
  headerFontWeight: 500,
  
  // Row colors
  oddRowBackgroundColor: 'rgb(30 41 59)', // slate-800
  rowHoverColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
  
  // Selection colors
  selectedRowBackgroundColor: 'rgba(16, 185, 129, 0.2)', // emerald-500/20
  rangeSelectionBackgroundColor: 'rgba(16, 185, 129, 0.15)',
  
  // Border colors
  borderColor: 'rgb(71 85 105)', // slate-600
  borderRadius: 8,
  
  // Cell styling
  cellTextColor: 'rgb(203 213 225)', // slate-300
  
  // Accent color (emerald)
  accentColor: 'rgb(16 185 129)', // emerald-500
  
  // Font
  fontFamily: 'inherit',
  fontSize: 14,
  
  // Spacing
  cellHorizontalPadding: 16,
  headerHeight: 48,
  rowHeight: 52,
  
  // Wrapper styling
  wrapperBorderRadius: 12,
});

interface DataGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  onGridReady?: (event: GridReadyEvent<T>) => void;
  gridOptions?: Partial<GridOptions<T>>;
  height?: string;
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (data: T) => void;
}

function DataGrid<T>({
  rowData,
  columnDefs,
  onGridReady,
  gridOptions,
  height = '500px',
  loading = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
}: DataGridProps<T>) {
  // Default column definitions
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  }), []);

  // Handle row click
  const handleRowClicked = (event: { data: T | undefined }) => {
    if (onRowClick && event.data) {
      onRowClick(event.data);
    }
  };

  return (
    <div 
      style={{ height, width: '100%' }}
      className="rounded-xl overflow-hidden"
    >
      <AgGridReact<T>
        theme={darkTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onRowClicked={handleRowClicked}
        pagination={pagination}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        animateRows={true}
        loading={loading}
        suppressCellFocus={true}
        rowSelection="single"
        {...gridOptions}
      />
    </div>
  );
}

export default DataGrid;

