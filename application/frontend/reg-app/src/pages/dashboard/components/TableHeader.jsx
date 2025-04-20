import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

const columns = [
  { headerName: 'ID', width: 90 },
  { headerName: 'Reporter', width: 150 },
  { headerName: 'Summary', width: 150 },
  { headerName: 'Status', width: 180 },
  { headerName: 'Assignee', width: 110 },
  { headerName: 'Priority', width: 110 },
  { headerName: 'Created', width: 110 },
  { headerName: 'Updated', width: 110 },
];

const TableHeader = () => (
  <TableHead>
    <TableRow style={{ backgroundColor: '#1976d2' }}>
      {columns.map((column, index) => (
        <TableCell key={index} align="left" style={{ color: 'white' , fontWeight: 'bold'}}>{column.headerName}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default TableHeader;
