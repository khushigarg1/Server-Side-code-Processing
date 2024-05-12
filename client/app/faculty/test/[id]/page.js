"use client";
import * as React from "react";
// import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TestDetails from "@/components/TestDetails";

import { Skeleton } from "@mui/material";
import api from "@/api";
import Cookies from "js-cookie";
import { useAdminAuth } from "@/contexts/faculty-auth";
import QuestionsTable from "@/components/facultyQuestions";
import UsersTable from "@/components/facultyUsers";
import SubmissionsTable from "@/components/facultySubmissions";

export default function Dashboard({ params }) {
  const [detailsLoading, setDetailsLoading] = React.useState(true);

  const [details, setDetails] = React.useState({});
  const [submissions, setSubmisions] = React.useState(null);
  const [refresh, setRefresh] = React.useState(false);
  const toggleRefresh = () => setRefresh(!refresh);
  const [ownGroup, setOwnGroup] = React.useState(false);
  const { login, loading, user } = useAdminAuth();

  const fetchSubmissions = async () => {
    try {
      const response = await api.get(`submission/${params.id}`);
      console.log("submission DATA: ", response.data);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  // Effect to fetch submissions every 10 seconds

  React.useEffect(() => {
    async function getTest() {
      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      try {
        let response = await api.get(`test/${params.id}`);
        console.log("TEST DATA: ", response.data);
        setDetails(response.data.data);
        response = await api.get(`submission/${params.id}`);
        console.log("submission DATA: ", response.data);
        setSubmisions(response.data);
        // setOwnGroup(response.data.closedGroup.createdBy == user.data.uid);
        setDetailsLoading(false);
      } catch (error) {
        console.error("Error fetching closed groups:", error);
      } finally {
      }
    }
    setDetailsLoading(true);

    getTest();
  }, [refresh]);

  return (
    <Box sx={{ display: "flex", ml: 0 }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          ml: 0,
        }}
      >
        <Container maxWidth="false" sx={{ mt: 1, mb: 1, ml: 0 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              {detailsLoading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  height={240}
                  sx={{ mt: 0 }}
                ></Skeleton>
              ) : (
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "row",
                    height: 240,
                  }}
                >
                  <TestDetails
                    details={details}
                    toggleRefresh={toggleRefresh}
                  />
                </Paper>
              )}
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography
                  component="h2"
                  variant="h5"
                  color="primary"
                  gutterBottom
                >
                  Questions
                </Typography>
                <QuestionsTable
                  questions={details?.Question ? details?.Question : []}
                  toggleRefresh={toggleRefresh}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography
                  component="h2"
                  variant="h5"
                  color="primary"
                  gutterBottom
                >
                  Students
                </Typography>
                <UsersTable users={details?.User ? details?.User : []} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography
                  component="h2"
                  variant="h5"
                  color="primary"
                  gutterBottom
                >
                  Student Scoreboard
                </Typography>
                <SubmissionsTable details={submissions} />
              </Paper>
            </Grid>
          </Grid>
          {/* <Copyright sx={{ pt: 4 }} /> */}
        </Container>
      </Box>
    </Box>
    // </ThemeProvider>
  );
}
