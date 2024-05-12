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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddTestModal from "@/components/addTestModal";

// import AddClosedGroupModal from "@/components/CreateGroupModal";
// AddClosedGroupModal

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const theme = useTheme();
  const handleAddUserOpen = () => setAddUserOpen(true);
  const handleAddUserClose = () => setAddUserOpen(false);

  const columns = [
    {
      // field: "id",
      // headerName: "-",

      renderCell: (params) => {
        return (
          <Link target="_blank" href={"/faculty/test/" + params.row.id}>
            <Button variant="outlined" color="primary">
              Open
            </Button>
          </Link>
        );
      },
    },
    { field: "id", headerName: "ID" },
    { field: "testName", headerName: "Name", width: 400 },
    {
      field: "testDuration",
      headerName: "Test Duration",
      width: 200,
      valueGetter: (params) => `${params.row.testDuration} minutes`,
    },
    {
      field: "numOfQuestion",
      width: 200,
      headerName: "No of Questions",
    },
    {
      field: "group",
      width: 200,
      headerName: "Group",
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            {params.row.status == "upcoming" ? (
              <Chip variant="filled" color="warning" label="Upcoming" />
            ) : params.row.status == "running" ? (
              <Chip variant="filled" color="error" label="Running" />
            ) : (
              <Chip variant="filled" color="success" label="Completed" />
            )}
          </>
        );
      },
    },
    {
      field: "createdAt",
      width: 200,
      headerName: "Created At",
    },
  ];

  useEffect(() => {
    setLoading(true);
    getClosedGroups();
  }, [refresh]);

  async function getClosedGroups() {
    // setLoading(true);
    const token = Cookies.get("token");
    api.defaults.headers.Authorization = `Bearer ${token}`;
    try {
      const response = await api.get("test");
      console.log(response.data);
      setGroups(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching closed groups:", error);
    } finally {
      // setLoading(false);
    }
  }

  function toggleRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box disableGutters sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              // editMode="false"
              rows={groups}
              columns={columns}
              autoPageSize
              loading={loading}
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
            <Button variant="contained" onClick={toggleRefresh}>
              Refresh
            </Button>
          </ThemeProvider>
          <Fab
            onClick={handleAddUserOpen}
            color="primary"
            sx={{
              position: "absolute",
              bottom: 16,
              // ml:"30%",
              // mr:"30%"
              right: 140,
              bottom: 16,
            }}
            variant="extended"
            aria-label="add"
          >
            <AddIcon sx={{ mr: "auto", ml: "auto" }} />
            Create Test
          </Fab>
        </Box>
      </Container>
      <Modal
        open={addUserOpen}
        onClose={handleAddUserClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddTestModal
            setAddQuestionOpen={setAddUserOpen}
            toggleRefresh={toggleRefresh}
          />
        </Box>
      </Modal>
    </>
  );
}
