"use client";

import { THEME_ID, createTheme, styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import Groups2Icon from "@mui/icons-material/Groups2";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import SettingsIcon from "@mui/icons-material/Settings";
import React, { useEffect, useState } from "react";
import { pink, red } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { useStudentAuth } from "@/contexts/student-auth";
import { Avatar, Button, CardMedia, Chip } from "@mui/material";
import LoginForm from "./studentLoginForm";
import Image from "next/image";
import Link from "next/link";
import skit_logo from "@/public/skit_logo.png";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { getIPv4Addresses } from "@/utils";
import Cookies from "js-cookie";
import api from "@/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
// import logo from "@public/images"

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function PageNav({ children, params }) {
  const router = useRouter();

  const { user, isAuthenticated, isLoading, logout, openTab, setOpenTab } =
    useStudentAuth();
  console.log("user", user);
  const [open, setOpen] = React.useState(false);
  const [questions, setQuestions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const theme = useTheme();

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
        let response = await api.get(`questions/${params.id}`);
        console.log("TEST DATA: ", response.data);
        setQuestions(response.data.data);
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
  const handleGoBack = () => {
    const confirmed = window.confirm("Are you sure you want to go back?");
    if (confirmed) {
      router.push("/student/");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open && isAuthenticated}>
        <Toolbar>
          {isAuthenticated && <></>}
          <Link href={`/student/test/${params.id}`}>
            <Typography variant="h6" noWrap component="div">
              Student Panel
            </Typography>
          </Link>
          {/* <Link href={"/"} style={{ marginLeft: "auto" }}> */}
          <Button
            sx={{ marginLeft: "auto" }}
            color="inherit"
            variant="outlined"
            endIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Go Back
          </Button>
          {/* </Link> */}
        </Toolbar>
      </AppBar>
      {isAuthenticated ? (
        <>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader></DrawerHeader>
            <Divider />
            <List>
              {questions.map((ques, index) => {
                return (
                  <Link
                    key={ques.id}
                    href={`/student/test/${params.id}/${ques.id}`}
                  >
                    <ListItem
                      key={"Tests"}
                      onClick={() => setOpenTab("Tests".toLowerCase())}
                      disablePadding
                      sx={{ display: "block" }}
                    >
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 1.5,
                        }}
                      >
                        <Chip
                          sx={{ alignSelf: "flex-start", ml: 0, mr: 0 }} // Align chip to the left
                          label={`${index + 1}`}
                          color="primary"
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider></Divider>
                  </Link>
                );
              })}
            </List>
            {/* <Divider /> */}
            {open && (
              <ListItem
                key={"Logout"}
                onClick={() => logout()}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Logout"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />

            {children}
          </Box>
        </>
      ) : (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <LoginForm params={params} />
        </Box>
      )}
    </Box>
  );
}
