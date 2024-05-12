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
import Cookies from "js-cookie";
import api from "@/api";
export default function Home({ params }) {
  const [details, setDetails] = useState(null);
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
        let response = await api.get(`test/${params.id}`);
        console.log("TEST DATA: ", response.data);

        setDetails(response.data.data);
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
      <Grid container overflow={"auto"} spacing={3}>
        {details && (
          <>
            <Grid item xs={8} md={8}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Name
              </Typography>
              <Typography component="p" variant="h4">
                {details.testName}
              </Typography>
              <Divider></Divider>
            </Grid>
            <Grid item xs={2} md={2}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Group
              </Typography>
              <Typography component="p" variant="h5">
                {/* {details.FrontUser.Username} | {details.FrontUser.Phone} <Divider />{" "} */}
                {details.group}
              </Typography>
            </Grid>
            <Grid item xs={2} md={2}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Status:
              </Typography>
              {/* <Typography component="p" variant="h5"> */}
              {details.status == "upcoming" ? (
                <Chip
                  variant="filled"
                  color="warning"
                  size="large"
                  label="Upcoming"
                />
              ) : details.status == "running" ? (
                <Chip
                  variant="filled"
                  size="large"
                  color="error"
                  label="Running"
                />
              ) : (
                <Chip
                  variant="filled"
                  size="large"
                  color="success"
                  label="Completed"
                />
              )}
              {/* </Typography> */}
            </Grid>
            <Grid item xs={3} md={3}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Test Duration
              </Typography>
              <Typography component="p" variant="h5">
                {/* {details.FrontUser.Username} | {details.FrontUser.Phone} <Divider />{" "} */}
                {details.testDuration} minutes
              </Typography>
            </Grid>
            <Grid item xs={3} md={3}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                No. of Questions:
              </Typography>
              <Typography component="p" variant="h5">
                {details.Question.length}
              </Typography>
            </Grid>
            <Grid item xs={2} md={2}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Total Students
              </Typography>
              <Typography component="p" variant="h5">
                {details.User.length}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
