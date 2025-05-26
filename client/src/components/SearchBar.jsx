/* eslint-disable react/prop-types */
import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ setsearchQuery }) {
  const [query, setQuery] = React.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <Stack spacing={2} sx={{ width: "60%" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Search for an item ..."
          variant="outlined"
          type="search"
          placeholder=""
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setsearchQuery(e.target.value);
          }}
          sx={{
            borderRadius: "40px",
            boxShadow: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "40px",
              "& fieldset": {
                borderColor: "black",
              },
              "&:hover fieldset": {
                borderColor: "#FF5A5F",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FF5A5F",
              },
            },
            width: "100%",
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <button type="submit">
                    <SearchIcon />
                  </button>
                </InputAdornment>
              ),
            },
          }}
        />
      </form>
    </Stack>
  );
}
