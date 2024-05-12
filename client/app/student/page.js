"use client";
import { decodeFromBase64, encodeToBase64, getIPv4Addresses } from "@/utils";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Link from "next/link";
import { useEffect, useState } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from "js-cookie";
import api from "@/api";
export default function Home({ openTab }) {
  // const networkInterfaces = getIPv4Addresses();
  // console.log("networkInterfaces: ", networkInterfaces);
  // const arr = Object.keys(networkInterfaces).map((address) => {
  //   return `http://${networkInterfaces[address][0]}:3000/ `;
  // });
  const [tests, setTests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const toggleRefresh = () => {
    console.log("CALLED");
    setRefresh(!refresh);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTests() {
      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      try {
        let response = await api.get(`test`);
        console.log("TEST DATA: ", response.data);
        const runningTests = response.data.data.filter(
          (test) => test.status == "running"
        );
        setTests(runningTests);
        // setOwnGroup(response.data.closedGroup.createdBy == user.data.uid);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching closed groups:", error);
      } finally {
      }
    }

    setLoading(true);
    getTests();
  }, [refresh]);
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Ongoing Tests
          </Typography>
          <Button
            sx={{ ml: 5 }}
            color="inherit"
            variant="outlined"
            endIcon={<CachedIcon />}
            onClick={toggleRefresh}
          >
            Refresh Tests
          </Button>
          <Link href={"/"} style={{ marginLeft: "auto" }}>
            <Button
              sx={{ ml: "auto" }}
              color="inherit"
              variant="outlined"
              endIcon={<ArrowBackIcon />}
              onClick={toggleRefresh}
            >
              Go Back
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Grid mt={"4rem"} container spacing={1}>
        {loading || tests.length <= 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
              width: "100vw",
            }}
          >
            <Chip
              variant="filled"
              color="secondary"
              size="large"
              label="No Running Tests Available"
            />
          </Box>
        ) : (
          <>
            {tests.map((test, index) => {
              return (
                <Grid key={test.id} item xs={4} md={4} lg={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Chip
                          sx={{ alignSelf: "flex-start", ml: 0, mr: 2 }} // Align chip to the left
                          label={index + 1}
                          color="primary"
                        />
                        <Divider orientation="vertical" flexItem />
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          sx={{ alignSelf: "center", ml: 3 }} // Align typography to the center
                        >
                          {test.testName}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                        }}
                      >
                        <Typography variant="h6" color="text.secondary">
                          Duration: {test.testDuration} minutes
                        </Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="h6" color="text.secondary">
                          Number of Questions: {test.numOfQuestion}
                        </Typography>
                      </Box>
                      <Divider />
                    </CardContent>
                    <CardActions>
                      <Link href={`/student/test/${test.id}`}>
                        <Button
                          variant="contained"
                          endIcon={<AccountCircleIcon />}
                          size="medium"
                        >
                          Login / Signup
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </>
  );
}
