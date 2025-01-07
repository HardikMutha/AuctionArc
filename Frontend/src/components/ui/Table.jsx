import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect } from "react";
import CustomModal from "./CustomModal";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router";

const columns = [
  { id: "name", label: "Product Name", minWidth: 170 },
  { id: "listingPrice", label: "Listing Price", minWidth: 100 },
  {
    id: "bidHistory",
    label: "Current Price",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "auctionStatus",
    label: "Auction Status",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "Update_Delete",
    label: "Edit/Delete",
    minWidth: 170,
    align: "right",
  },
];

export default function DashboardTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [productData, setProductData] = React.useState([{}]);
  // const [showModal, setshowModal] = React.useState(false);
  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line no-unused-vars
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get("http://localhost:3000/my-products", {
        withCredentials: true,
      });
      setProductData([...response.data]);
    };
    fetchData();
    console.log(productData);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      {/* <CustomModal showModal={showModal} /> */}
      <Paper
        sx={{
          width: "95%",
          overflow: "hidden",
          margin: "4em auto",
        }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={"center"}
                    style={{
                      minWidth: 100,
                    }}
                  >
                    <p className="lg:text-lg text-sm">{column.label}</p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={uuidv4()}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === "Update_Delete") {
                          return (
                            <>
                              <TableCell key={column.id} align={"center"}>
                                <button className="mx-1 border-2 p-2 rounded-lg border-[#ffc107] bg-[#ffc107] font-semibold transition ease-in-out hover:-translate-y-1 my-2 ">
                                  Edit
                                </button>
                                <CustomModal productid={row._id} />
                              </TableCell>
                            </>
                          );
                        } else if (column.id == "name") {
                          return (
                            <TableCell key={column.id} align={"center"}>
                              <Link to={`/products/${row._id}`}>
                                {column.format &&
                                (typeof value === "number" ||
                                  typeof value === "boolean")
                                  ? column.format(value)
                                  : value}
                              </Link>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={"center"}>
                            {column.format &&
                            (typeof value === "number" ||
                              typeof value === "boolean")
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={productData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
