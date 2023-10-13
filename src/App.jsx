import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import DataTable from './components/datatable/DataTable'
import { makeData } from './components/datatable/makeData'

function App() {
    const columnHelper = createColumnHelper() 
    /* const columns = [
        columnHelper.accessor('firstName', {
            header: () => 'First Name',
            footer: info => info.column.id,
        }),
        columnHelper.accessor('lastName', {
            header: () => 'Last Name',
            footer: info => info.column.id,
        }),
        columnHelper.accessor('age', {
            header: () => 'Age',
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('visits', {
            header: () => 'Visits',
        }),
        columnHelper.accessor('status', {
            header: 'Status',
        }),
        columnHelper.accessor('progress', {
            header: 'Profile Progress',
        }),
    ] */

    const columns = useMemo(() => [
        /* {
            id: 'select',
            header: ({ table }) => (
              <IndeterminateCheckbox
                {...{
                  checked: table.getIsAllRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
                }}
              />
            ),
            cell: ({ row }) => (
              <div className="px-1">
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />
              </div>
            ),
        }, */
        {
            header: () => 'First Name',
            accessorKey: 'firstName',
        },
        {
            header: () => 'Last Name',
            accessorKey: 'lastName',
        },
        {
            header: () => 'Age',
            accessorKey: 'age',
        },
        {
            header: () => 'Visits',
            accessorKey: 'visits',
        },
        {
            header: () => 'Status',
            accessorKey: 'status',
        },
        {
            header: () => 'Profile Progress',
            accessorKey: 'progress'
        },
    ], 
    
    [])

    const data = [
        {
            firstName: 'firstName',
            lastName: 'lastName',
            age: '10',
            visits: '5',
            status: 'Single',
            progress: '10',
        },
        {
            firstName: 'pangalan 2',
            lastName: 'apilyido 2',
            age: '18',
            visits: '16',
            status: 'Basta',
            progress: '30',
        }
    ]
    return (
        <div className="App">
            <DataTable  columns={columns} data={makeData(100)}/>
        </div>
    );
}

export default App
