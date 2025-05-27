import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CustomTable = ({
  columns,
  data,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  onEdit,
  onView,
  totalCount,
}) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(page); // Reset to first page
  };

  return (
    <div className="w-full  overflow-auto ">
      <TableContainer component={Paper}
       sx={{ maxHeight: 500, overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
              {(onEdit || onView) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map((row, index) => (
              <TableRow key={index} sx={{ height: 36 }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{ py: 0.5, px: 1 }} // Reduce vertical (py) and horizontal (px) padding
                  >
                    {row[col.key]}
                  </TableCell>
                ))}
                {(onEdit || onView) && (
                  <TableCell sx={{ py: 0.5, px: 1 }}>
                    {onView && (
                      <IconButton onClick={() => onView(row)} size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onEdit && (
                      <IconButton onClick={() => onEdit(row)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 50, 100]}
        component="div"
        count={totalCount || 0} // total from backend
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default CustomTable;
