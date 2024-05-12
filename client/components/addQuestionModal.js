import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AceEditor from "react-ace";
import api from "@/api";
import { encodeToBase64 } from "@/utils";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";

function LeftPanel({ setAddQuestionOpen, toggleRefresh, testId }) {
  const [htmlCode, setHtmlCode] = useState("");
  console.log(testId)
  const handleSave = async () => {
    try {
      const encodedHtmlCode = encodeToBase64(htmlCode);
      await api.post(`/question`, {
        testId: testId,
        statement: encodedHtmlCode,
      });
      setAddQuestionOpen(false);
      toggleRefresh();
      console.log("Question data updated successfully!");
    } catch (error) {
      console.error("Error updating question data:", error);
    }
  };

  return (
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
          Add Question Statement:
        </Typography>
        <Button variant="contained" onClick={handleSave} sx={{ ml: 2 }}>
          Save
        </Button>
      </Box>
      <AceEditor
        mode="html"
        theme="github"
        width="100%"
        height="80vh"
        value={htmlCode}
        onChange={(newValue) => setHtmlCode(newValue)}
      />
    </Box>
  );
}

export default function AddQuestionModal({ setAddQuestionOpen, toggleRefresh, testId }) {
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setErr("");
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mb: 4, maxHeight: "80vh" }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            ADD Question Data
          </Typography>
          <Divider />
          <Grid container spacing={0}>
            <LeftPanel setAddQuestionOpen={setAddQuestionOpen} toggleRefresh={toggleRefresh} testId={testId} />
          </Grid>
          <Button
            variant="contained"
            onClick={() => {
              setAddQuestionOpen(false);
            }}
            sx={{ mt: 3, ml: 1 }}
          >
            Cancel
          </Button>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={err}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {err}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </>
  );
}
