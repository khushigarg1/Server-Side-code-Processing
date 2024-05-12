"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Fab,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import api from "@/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { decodeFromBase64 } from "@/utils";
import EditQuestionModal from "@/components/editQuestionModal";

export default function UsersTable(props) {
  const theme = useTheme();
  const { users } = props;
  //   console.log("QUESTIONS: ", questions);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      width: 300,
    },
    {
      field: "email",
      headerName: "Email ID",
      width: 300,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <Box disableGutters sx={{ height: "60vh" }}>
        <ThemeProvider theme={theme}>
          <DataGrid
            // editMode="false"
            rows={users}
            columns={columns}
            autoPageSize
            // loading={loading}
            disableRowSelectionOnClick
            disableColumnSelector
            disableColumnMenu
            disableColumnFilter
            disableDensitySelector
            // onRowClick={handleRowClick}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </ThemeProvider>
      </Box>
    </>
  );
}
