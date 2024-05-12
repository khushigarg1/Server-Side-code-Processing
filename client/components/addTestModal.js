import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import api from "@/api";

export default function AddModal({ setAddQuestionOpen, toggleRefresh }) {
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [numOfQuestion, setNumOfQuestion] = useState("");
  const [group, setGroup] = useState("");

  const handleClose = () => {
    setOpen(false);
    setErr("");
    setTestName("");
    setTestDuration("");
    setNumOfQuestion("");
    setGroup("");
  };
  const handleSave = async () => {
    try {
      await api.post("/test", {
        testName: testName,
        testDuration: parseInt(testDuration),
        numOfQuestion: parseInt(numOfQuestion),
        group: group,
        status: "upcoming",
      });
      setAddQuestionOpen(false);
      console.log("Test data saved successfully!");
      toggleRefresh();
    } catch (error) {
      console.error("Error saving test data:", error);
      setErr("Error saving test data");
      setOpen(true);
    }
  };


  return (
    <>
      <Container maxWidth="md" sx={{ mb: 4, maxHeight: "80vh" }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Edit Question Data
          </Typography>
          <Divider />
          <Grid container spacing={0}>
            <Box
              sx={{
                width: "100%",
                maxHeight: "70vh",
                padding: "16px",
                overflowY: "auto",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 1 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Test Details:
                </Typography>
              </Box>
              <TextField
                label="Test Name"
                fullWidth
                margin="normal"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
              <TextField
                label="Test Duration"
                fullWidth
                margin="normal"
                type="number"
                value={testDuration}
                onChange={(e) => setTestDuration(e.target.value)}
              />
              <TextField
                label="Number of Questions"
                fullWidth
                margin="normal"
                type="number"
                value={numOfQuestion}
                onChange={(e) => setNumOfQuestion(e.target.value)}
              />
              <TextField
                label="Group"
                fullWidth
                margin="normal"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button variant="contained" onClick={() => setAddQuestionOpen(false)} sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            </Box>
          </Grid>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={err}
          >
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
              {err}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </>
  );
}
