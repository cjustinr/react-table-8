import { rankItem } from '@tanstack/match-sorter-utils'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel
} from '@tanstack/react-table'
import { forwardRef, useEffect, useRef, useState } from 'react'

const DataTable = ({
    columns = [],
    data = []
}) => {
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            sorting,
            globalFilter,
            rowSelection
        },
        /* initialState: { 
            pagination: { // SETTING INITIAL STATE FOR PAGINATION
                pageIndex: 0,
                pageSize: 40
            }
        }, */
        getCoreRowModel: getCoreRowModel(), // MAIN RENDERER MODEL

        getSortedRowModel: getSortedRowModel(), // SORTING MODEL
        onSortingChange: setSorting, // GET SORTING DATA

        getFilteredRowModel: getFilteredRowModel(), // FILTER MODEL
        onGlobalFilterChange: setGlobalFilter, // GET GLOBAL FILTER DATA
        globalFilterFn: fuzzyFilter, // FUZZY FILTER

        getPaginationRowModel: getPaginationRowModel(), // PAGINATION MODEL

        enableRowSelection: true, //enable row selection for all rows
        onRowSelectionChange: setRowSelection,
    })

    return (
        <div className="data-table-wrapper">
            <div className="data-table-header">
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(value)}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                />
            </div>
            <div className="data-table">
                <table>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>

                                <th>
                                    <div>
                                        <IndeterminateCheckbox
                                            {...{
                                                checked: table.getIsAllRowsSelected(),
                                                indeterminate: table.getIsSomeRowsSelected(),
                                                onChange: table.getToggleAllRowsSelectedHandler(),
                                            }}
                                        />
                                    </div>
                                </th>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className: header.column.getCanSort()
                                                        ? 'cursor-pointer select-none'
                                                        : '',
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                <td>
                                    <IndeterminateCheckbox
                                        {...{
                                            checked: row.getIsSelected(),
                                            disabled: !row.getCanSelect(),
                                            indeterminate: row.getIsSomeSelected(),
                                            onChange: row.getToggleSelectedHandler(),
                                        }}
                                    />
                                </td>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="controls">
                <div className="navigation">
                    <button
                        className=""
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className=""
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className=""
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className=""
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                </div>
                <span className="page-info">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="jump-page">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <div>
                    {Object.keys(rowSelection).length} of{' '}
                    {table.getPreFilteredRowModel().rows.length} Total Rows Selected
                </div>
            </div>
        </div>
    )
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

const IndeterminateCheckbox = ({
    indeterminate,
    className = '',
    ...rest
}) => {
    const ref = useRef()

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    )
}

export default DataTable