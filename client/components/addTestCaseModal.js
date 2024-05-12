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
import TextField from "@mui/material/TextField"; // Import TextField
import Checkbox from "@mui/material/Checkbox"; // Import Checkbox
import FormControlLabel from "@mui/material/FormControlLabel";
import api from "@/api";
import { encodeToBase64 } from "@/utils";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";

function LeftPanel({ setAddTestCaseOpen, toggleRefresh, questionId }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [hidden, setHidden] = useState(true);

  const handleSave = async () => {
    try {
      const encodedInput = encodeToBase64(input);
      const encodedOutput = encodeToBase64(output);
      await api.post(`/testcase`, {
        questionId: parseInt(questionId),
        input: encodedInput,
        output: encodedOutput,
        hidden: hidden,
      });
      setAddTestCaseOpen(false);
      toggleRefresh();
      console.log("Test case created successfully!");
    } catch (error) {
      console.error("Error creating test case:", error);
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
          Add Test Case:
        </Typography>
        <Button variant="contained" onClick={handleSave} sx={{ ml: 2 }}>
          Save
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Input"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Output"
            fullWidth
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={hidden} onChange={(e) => setHidden(e.target.checked)} />}
            label="Hidden"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default function AddTestCaseModal({ setAddTestCaseOpen, toggleRefresh, currentdata }) {
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  console.log(currentdata);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setErr("");
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mb: 4, maxHeight: "80vh" }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Add Test Case
          </Typography>
          <Divider />
          <Grid container spacing={0}>
            <LeftPanel setAddTestCaseOpen={setAddTestCaseOpen} toggleRefresh={toggleRefresh} questionId={currentdata?.id} />
          </Grid>
          <Button
            variant="contained"
            onClick={() => {
              setAddTestCaseOpen(false);
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