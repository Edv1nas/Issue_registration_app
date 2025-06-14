import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { useTheme } from '@mui/material/styles';

// Constants
const COLUMNS = [
  { id: 'id', headerName: 'ID', width: 90, align: 'left' },
  { id: 'reporter', headerName: 'Reporter', width: 150, align: 'left' },
  { id: 'summary', headerName: 'Summary', width: 150, align: 'left' },
  { id: 'status', headerName: 'Status', width: 180, align: 'left' },
  { id: 'assignee', headerName: 'Assignee', width: 110, align: 'left' },
  { id: 'priority', headerName: 'Priority', width: 110, align: 'left' },
  { id: 'created', headerName: 'Created', width: 110, align: 'left' },
  { id: 'updated', headerName: 'Updated', width: 110, align: 'left' },
];

const TableHeader = () => {
  const theme = useTheme();

  const headerStyles = {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.appBar - 1,
  };

  const rowStyles = {
    backgroundColor: theme.palette.primary.main,
    '& th': {
      borderBottom: 'none',
      borderRight: `1px solid ${theme.palette.primary.light}`,
      '&:last-of-type': {
        borderRight: 'none',
      },
    },
  };

  const getCellStyles = (isFirst, isLast) => ({
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: '0.875rem',
    py: 1.5,
    px: 2,
    ...(isFirst && {
      borderTopLeftRadius: theme.shape.borderRadius,
    }),
    ...(isLast && {
      borderTopRightRadius: theme.shape.borderRadius,
    }),
  });

  return (
    <TableHead sx={headerStyles}>
      <TableRow sx={rowStyles}>
        {COLUMNS.map((column, index) => (
          <TableCell
            key={column.id}
            align={column.align}
            scope="col"
            sx={{
              width: column.width,
              ...getCellStyles(index === 0, index === COLUMNS.length - 1),
            }}
          >
            {column.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
