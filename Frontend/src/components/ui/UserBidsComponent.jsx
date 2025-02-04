import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  TablePagination,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  ArrowUpward as ArrowUpwardIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";

// eslint-disable-next-line react/prop-types
const UserBidsComponent = ({ bids = [] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get bid status color
  const getBidStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "winning":
        return "success";
      case "outbid":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardContent>
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h5" component="h2" className="flex items-center">
            <LocalOfferIcon className="mr-2" />
            Your Auction Bids
          </Typography>
          <Chip
            label={`Total Bids: ${bids.length}`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <TableContainer component={Paper} className="mb-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell align="right">Bid Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Bid Time</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bids
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((bid) => (
                  <TableRow key={bid.id} hover>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">{bid.itemName}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {bid.itemId}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" className="font-bold">
                        {formatCurrency(bid.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={bid.status}
                        color={getBidStatusColor(bid.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={formatDate(bid.timestamp)}>
                        <Box className="flex items-center justify-end">
                          <AccessTimeIcon className="mr-1" fontSize="small" />
                          <Typography variant="body2">
                            {formatDate(bid.timestamp)}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Increase Bid">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            console.log("Increase bid for:", bid.id)
                          }
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={bids.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardContent>
    </Card>
  );
};

export default UserBidsComponent;

// Example usage:

// Use like this:
// <UserBidsComponent bids={sampleBids} />
