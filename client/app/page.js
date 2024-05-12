"use client";
import { decodeFromBase64, encodeToBase64, getIPv4Addresses } from "@/utils";
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Link from "next/link";
import CachedIcon from "@mui/icons-material/Cached";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Home({ openTab }) {
  const networkInterfaces = getIPv4Addresses();
  console.log("networkInterfaces: ", networkInterfaces);
  const arr = Object.keys(networkInterfaces).map((address) => {
    return `http://${networkInterfaces[address][0]}:3000/ `;
  });
  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  return (
    <Grid container spacing={1}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            SKIT College Online Examination Platform
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid mt={"4rem"} item xs={6} md={6} lg={6}>
        <Card>
          <CardMedia
            sx={{ height: "50vh" }}
            image="https://plus.unsplash.com/premium_photo-1678565869434-c81195861939?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Student Panel
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Participate in Tests. Login or Sign Up as a new student.
            </Typography>
          </CardContent>
          <CardActions>
            <Link href="/student">
              <Button variant="contained" endIcon={<SendIcon />} size="medium">
                Go to STUDENT Panel
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>

      <Grid mt={"4rem"} item xs={6} md={6} lg={6}>
        <Card>
          <CardMedia
            sx={{ height: "50vh" }}
            image="https://plus.unsplash.com/premium_photo-1678565869434-c81195861939?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Faculty Panel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create new Tests, watch over ongoing tests or view results of past
              tests. Go to login panel.
            </Typography>
          </CardContent>
          <CardActions>
            <Link href="/faculty">
              <Button variant="contained" endIcon={<SendIcon />} size="medium">
                Go to ADMIN Panel
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
      {/* <Grid item xs={6} md={6} lg={6}>
        <Card>
          <CardContent>
            {arr.map((address) => (
              <Link key={address} href={address}>
                <Typography
                  sx={{
                    textDecoration: "underline",
                  }}
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  <em>{address}</em>
                </Typography>
              </Link>
            ))}
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  );
}
