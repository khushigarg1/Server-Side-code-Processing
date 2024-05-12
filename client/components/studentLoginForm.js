import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
// import image from "../public/images/bg-181.jpg";
import React, { useState } from "react";
import { useStudentAuth } from "@/contexts/student-auth";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
export default function LoginForm({ params }) {
  // const router = useRouter();
  const testId = params.id;
  console.log("PAramas: ", params);
  const [isLogin, setIsLogin] = React.useState(false);
  const [account, setAccount] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = React.useState("Invalid Credentials");
  const { login, loading, signUp } = useStudentAuth();
  const [open, setOpen] = React.useState(false);
  const handelAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;

    setAccount(accountCopy);
  };

  const handleClose = (event, reason = "") => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handelLogin = async (e) => {
    e.preventDefault();
    let val = isLogin
      ? await login(account.email, account.password, testId)
      : await signUp(account.name, account.email, account.password, testId);
    console.log("login attempt", val);
    if (!val) {
      if (isLogin) {
        setMsg("Invalid Credentials");
      } else {
        setMsg("Something Wrong with Sign Up");
      }
      setOpen(true);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "80vh", // Full viewport height
        }}
      >
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <Button onClick={() => setIsLogin(true)}>Login</Button>
          <Button onClick={() => setIsLogin(false)}>Signup</Button>
        </ButtonGroup>
        <Box
          sx={{
            display: "flex",
            // flexWrap: 'wrap',
            flexDirection: "column",

            "& > :not(style)": {
              m: 1,
              width: 450,
              height: isLogin ? 400 : 500,
            },
          }}
        >
          <Paper
            sx={{
              padding: 2,
              display: "flex",

              flexDirection: "column",
            }}
            elevation={3}
          >
            {!false ? (
              <>
                <Avatar
                  variant="circular"
                  sx={{ bgcolor: "white", alignSelf: "center" }}
                >
                  <LockIcon color="primary" />
                </Avatar>
                <Typography
                  alignSelf="center"
                  mb="1rem"
                  component="h1"
                  variant="h4"
                >
                  Student {isLogin ? "Login" : "Sign Up"}
                </Typography>
                <Divider />

                {!isLogin && loading ? (
                  <Skeleton
                    variant="rectangular"
                    sx={{ mb: 3, mt: 2 }}
                    width={420}
                    height={50}
                  >
                    <CircularProgress />
                  </Skeleton>
                ) : (
                  !isLogin && (
                    <TextField
                      onChange={(event) => handelAccount("name", event)}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      autoFocus
                    />
                  )
                )}
                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    sx={{ mb: 3, mt: 2 }}
                    width={420}
                    height={50}
                  >
                    <CircularProgress />
                  </Skeleton>
                ) : (
                  <TextField
                    onChange={(event) => handelAccount("email", event)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="username"
                    autoFocus
                  />
                )}
                {loading && <Divider></Divider>}

                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    sx={{ mb: 3 }}
                    width={420}
                    height={50}
                  >
                    <CircularProgress />
                  </Skeleton>
                ) : (
                  <TextField
                    onChange={(event) => handelAccount("password", event)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                )}

                <Button
                  sx={{ mt: 3, mb: 1 }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  // className={classes.submit}
                  onClick={handelLogin}
                >
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
                <Divider />
                <Link href="/student">
                  <Button
                    sx={{ mt: 1 }}
                    type="submit"
                    fullWidth
                    variant="outlined"
                    color="error"
                    // disabled={loading}
                    // className={classes.submit}
                    // onClick={handelLogin}
                  >
                    Go Back
                  </Button>
                </Link>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  message="Invalid Credentials"
                  action={action}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    {msg}
                  </Alert>
                </Snackbar>
              </>
            ) : (
              <>
                <Typography
                  alignSelf="center"
                  mb="1rem"
                  component="h1"
                  variant="h4"
                >
                  Please Wait...
                </Typography>
                <Skeleton variant="rectangular" width={420} height={400}>
                  <CircularProgress />
                </Skeleton>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
}
