import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Alert,
  Divider,
  Checkbox,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import AceEditor from "react-ace";
import { decodeFromBase64, encodeToBase64 } from "@/utils";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";
import api from "@/api";

function LeftPanel({ data, toggleRefresh }) {
  // console.log(data, data?.statement)
  const [htmlCode, setHtmlCode] = React.useState(
    decodeFromBase64(data?.statement)
  );

  const handleSave = async () => {
    try {
      const encodedHtmlCode = encodeToBase64(htmlCode);
      await api.put(`/question/${data?.id}`, {
        testId: data?.testId,
        statement: encodedHtmlCode,
      });
      toggleRefresh();
      console.log("Question data updated successfully!");
    } catch (error) {
      console.error("Error updating question data:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "50%",
        maxHeight: "70vh",
        padding: "16px",
        overflowY: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Edit Question Statement
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
        fontSize={18}
        value={htmlCode}
        onChange={(newValue) => setHtmlCode(newValue)}
      />
    </Box>
  );
}

// function TestCaseCard({ testCase, onSave }) {
//   const [input, setInput] = React.useState(testCase.input);
//   const [output, setOutput] = React.useState(testCase.output);
//   const [hidden, setHidden] = React.useState(testCase.hidden);

//   const handleSave = () => {
//     onSave({
//       ...testCase,
//       input,
//       output,
//       hidden,
//     });
//   };

//   return (
//     <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
//       <Grid container spacing={2} alignItems="center">
//         <Grid item xs={12}>
//           <Typography variant="h6">Test Case</Typography>
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Input"
//             fullWidth
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Output"
//             fullWidth
//             value={output}
//             onChange={(e) => setOutput(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={hidden}
//                 onChange={(e) => setHidden(e.target.checked)}
//               />
//             }
//             label="Hidden"
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Button variant="contained" onClick={handleSave}>
//             Save
//           </Button>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// }
function TestCaseCard({ testCase, onSave, toggleRefresh }) {
  const [input, setInput] = React.useState(decodeFromBase64(testCase.input));
  const [output, setOutput] = React.useState(decodeFromBase64(testCase.output));
  const [hidden, setHidden] = React.useState(testCase.hidden);
  const [editMode, setEditMode] = React.useState(false);

  const handleSave = async () => {
    try {
      await api.put(`/testcase/${testCase.id}`, {
        input: encodeToBase64(input),
        output: encodeToBase64(output),
        hidden,
      });
      if (typeof onSave === "function") {
        onSave({
          ...testCase,
          input,
          output,
          hidden,
        });
        setEditMode(false);
        toggleRefresh();
      }
    } catch (error) {
      console.error("Error updating test case:", error);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6">Test Case {testCase.id}</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Input"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Output"
            fullWidth
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                disabled={!editMode}
              />
            }
            label="Hidden"
          />
        </Grid>
        <Grid item xs={12}>
          {editMode ? (
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

function RightPanel(data) {
  return (
    <Box
      sx={{
        width: "50%",
        maxHeight: "70vh",
        padding: "16px",
        overflowY: "scroll",
      }}
    >
      <Typography variant="h6" mb={2}>
        Test Cases
      </Typography>
      {data?.data?.map((testCase) => (
        <TestCaseCard
          toggleRefresh={data.toggleRefresh}
          key={testCase.id}
          testCase={testCase}
          onSave={console.log}
        />
      ))}
    </Box>
  );
}

export default function AddClosedGroupModal(props) {
  const { setEditQuestionOpen, currentdata, toggleRefresh } = props;
  // console.log(setEditQuestionOpen, currentdata)
  const [err, setErr] = React.useState(0);
  const [open, setOpen] = React.useState(false);

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
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Edit Question Data
          </Typography>
          <Divider />
          <Grid container spacing={0}>
            <LeftPanel
              toggleRefresh={toggleRefresh} data={currentdata} />
            <RightPanel
              toggleRefresh={toggleRefresh}
              data={currentdata?.TestCase}
            />
          </Grid>
          <Button
            variant="contained"
            onClick={() => {
              setEditQuestionOpen(false);
            }}
            sx={{ mt: 3, ml: 1 }}
          >
            Cancel
          </Button>
          {/* <Button variant="contained" sx={{ mt: 3, ml: 1 }}>
            Submit
          </Button> */}
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
