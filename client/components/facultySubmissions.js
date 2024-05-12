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
function formatDateTime(datetime) {
  const date = new Date(datetime);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight
  const minutes = ("0" + date.getMinutes()).slice(-2);

  const formattedDateTime = `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
  return formattedDateTime;
}
export default function SubmissionsTable({ details }) {
  const theme = useTheme();
  const [latestSubmissions, setLatestSubmissions] = useState([]);
  console.log("DETAILS: ", details);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "user_id",
      headerName: "User ID",
      width: 200,
    },
    {
      field: "question_id",
      headerName: "Question ID",
      width: 200,
    },
    {
      field: "question_language",
      headerName: "Programming Language",
      width: 200,
    },
    {
      field: "total_num_testcases",
      headerName: "Total Test Cases",
      width: 200,
    },
    {
      field: "num_testcases_passed",
      headerName: "TestCases passed",
      width: 200,
      valueGetter: (params) =>
        `${params.row.num_testcases_passed} / ${params.row.total_num_testcases}`,
    },
    {
      field: "createdAt",
      headerName: "Submitted At",
      width: 200,
      valueGetter: (params) => `${formatDateTime(params.row.createdAt)}`,
    },
  ];

  useEffect(() => {
    if (details) {
      const submissions = details.latestSubmissions;
      console.log("submissions: ", submissions);
      //   // Group submissions by user_id
      //   const groupedSubmissions = submissions.reduce((acc, submission) => {
      //     acc[submission.user_id] = acc[submission.user_id] || [];
      //     acc[submission.user_id].push(submission);
      //     return acc;
      //   }, {});

      //   // Select the latest submission for each user
      //   const latestSubmissions = Object.values(groupedSubmissions).map(
      //     (submissions) => {
      //       return submissions.reduce((latest, submission) => {
      //         return new Date(submission.createdAt) > new Date(latest.createdAt)
      //           ? submission
      //           : latest;
      //       });
      //     }
      //   );

      setLatestSubmissions(details.latestSubmissions);
    }
  }, [details]);

  return (
    <>
      <Box disableGutters sx={{ height: "60vh" }}>
        <ThemeProvider theme={theme}>
          {console.log("latestSubmissions: ", latestSubmissions)}
          <DataGrid
            // editMode="false"
            rows={latestSubmissions}
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
