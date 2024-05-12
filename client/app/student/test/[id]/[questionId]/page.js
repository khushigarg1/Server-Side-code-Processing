"use client";
import Image from "next/image";
// import styles from "./page.module.css";
import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import CodeIcon from "@mui/icons-material/Code";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";

import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
// import { green, purple } from "@mui/material/colors";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
import AceEditor from "react-ace";
import axios from "axios";
import "brace/mode/c_cpp";
import "brace/mode/java";
import "brace/mode/python";
import "brace/theme/monokai";
import "brace/theme/chrome";

import { useEffect, useState } from "react";
import useLocalStorage from "@/custom-hooks/useLocalStorage";
// import Problem from "@/components/problem";
import {
  IP,
  defaultCode,
  lang_extn,
  langs,
  langs_ids,
  statuses,
} from "@/constants";
import { decodeFromBase64, encodeToBase64 } from "@/utils";
import Cookies from "js-cookie";
import api from "@/api";
import { useStudentAuth } from "@/contexts/student-auth";
// import { BorderColor } from "@mui/icons-material";

const TestCaseCard = ({ testCase, index }) => {
  return (
    <Card variant="outlined" key={index} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Case {index + 1}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Status: {testCase.status}
        </Typography>
        <Divider />
        <Typography variant="body2" mt={2}>
          Input: {decodeFromBase64(testCase.input)}
        </Typography>
        <Typography variant="body2" mt={2}>
          Expected Output: {decodeFromBase64(testCase.output)}
        </Typography>
        <Typography variant="body2" mt={2}>
          {/* Your Output: {testCase.your_output && decodeFromBase64(testCase.your_output)} */}
          Your Output: {testCase.your_output && testCase.your_output}
        </Typography>
      </CardContent>
    </Card>
  );
};


export default function Home({ params }) {
  const { user } = useStudentAuth()
  const [lang, setLang] = useState(langs[0]);
  const [selectVal, setSelectVal] = useState(1);
  const [cCode, setCCode] = useLocalStorage(
    `C_${params.id}_${params.questionId}`,
    defaultCode.C
  );
  const [cppCode, setCPPCode] = useLocalStorage(
    `CPP_${params.id}_${params.questionId}`,
    defaultCode.CPP
  );
  const [javaCode, setJavaCode] = useLocalStorage(
    `JAVA_${params.id}_${params.questionId}`,
    defaultCode.JAVA
  );
  const [pyCode, setPyCode] = useLocalStorage(
    `PYTHON_${params.id}_${params.questionId}`,
    defaultCode.PYTHON
  );
  const [question, setQuestion] = useLocalStorage(
    `question_${params.id}_${params.questionId}`,
    ""
  );
  const [code, setCode] = useLocalStorage(
    `CODE_${params.id}_${params.questionId}`,
    cppCode
  );
  const availableCodes = [cCode, cppCode, javaCode, pyCode];
  const availableSetCodes = [setCCode, setCPPCode, setJavaCode, setPyCode];
  const [fontSize, setFontSize] = useLocalStorage("fontsize", 20);
  const [alignment, setAlignment] = useState("testcase");
  const [customTestcase, setCustomTestcase] = useLocalStorage(
    `testcase_${params.id}_${params.questionId}`,
    "1\n0"
  );
  const [sampleTestcase, setSampleTestcase] = useLocalStorage(
    `sample_testcase_${params.id}_${params.questionId}`,
    []
  );
  const [result, setResult] = useLocalStorage(
    `result_${params.id}_${params.questionId}`,
    "Run or Submit to see output"
  );
  const [passed, setPassed] = useState("default");
  const [testcaseStatus, setTestcaseStatus] = useState("status");
  const [buttonStatus, setButtonStatus] = useState(false);

  //form states
  const [loading, setLoading] = useState(false);
  const [formName, setFormName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleCheck = async () => {
    try {
      setButtonStatus(true);
      setAlignment("testcase");
      setResult("Loading....");
      let data = JSON.stringify({
        code: availableCodes[selectVal],
        lang_id: langs_ids[selectVal],
        input: customTestcase,
      });

      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      try {
        const response = await api.post("submission/run");
        console.log(response.data);
        let resultObj = {}
        response.data[0].submission_result.compile_output ? (resultObj["Compile Error"] = decodeFromBase64(response.data[0].submission_result.compile_output)) : (

          response.data.map((sub, index) => {
            resultObj[`Case ${index + 1}`] = { "status": sub.submission_result.status.description, "input": sub.input_data, "output": sub.output_data, "your_output": decodeFromBase64(sub.submission_result.stdout) }
          })
        )
        setResult(JSON.stringify(resultObj))
        setAlignment()
      } catch (error) {
        console.error("Error fetching closed groups:", error);
      } finally {
        // setLoading(false);
      }
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `/api/run`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const resp = await axios.request(config, { message: "obj passed" });
      console.log(resp);
      console.log(resp.data);

      if (parseInt(resp.data.judgement.status_id) <= 4) {
        setResult(resp.data.stdout);
        setPassed("success");
        setTestcaseStatus("Compiled Successfully");
      } else {
        setPassed("error");
        setTestcaseStatus(
          statuses[parseInt(resp.data.judgement.status_id) - 1]
        );
        setResult(
          statuses[parseInt(resp.data.judgement.status_id) - 1] +
          "\n" +
          resp.data.decoded?.toString()
        );
      }
    } catch (err) {
      console.log(err);
      setResult(err.response.data.message);
    } finally {
      setAlignment("result");
      setButtonStatus(false);
    }
  };
  const handleRun = async () => {
    try {
      setButtonStatus(true);
      setAlignment("testcase");
      setResult("Loading....");
      let data = JSON.stringify({
        source_code: encodeToBase64(availableCodes[selectVal]),
        language_id: langs_ids[selectVal],
        qstnid: parseInt(params.questionId),
      });




      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      try {
        const response = await api.post("submission/run", data);
        console.log(response.data);
        let resultObj = {}
        response.data[0].submission_result.compile_output ? (resultObj["Compile Error"] = decodeFromBase64(response.data[0].submission_result.compile_output)) : (

          response.data.map((sub, index) => {
            resultObj[`Case ${index + 1}`] = { "status": sub.submission_result.status.description, "input": sub.input_data, "output": sub.output_data, "your_output": decodeFromBase64(sub.submission_result.stdout) }
          })
        )
        setResult(resultObj)
        setAlignment("result")
      } catch (error) {
        console.error("Error fetching closed groups:", error);
      } finally {
        // setLoading(false);
      }
    } catch (err) {
      setResult(err.response.data.message);
    } finally {
      setAlignment("result");
      setButtonStatus(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setButtonStatus(true);
      setAlignment("testcase");
      setResult("Loading....");
      let data = JSON.stringify({
        source_code: encodeToBase64(availableCodes[selectVal]),
        language_id: langs_ids[selectVal],
        qstnid: parseInt(params.questionId),
        "userid": parseInt(user.payload.id),
        "testId": parseInt(params.id)
      });

      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      try {
        const response = await api.post("submission/submit", data);
        console.log("res", response.data);
        setResult(response?.data?.finalStatus)
        setAlignment("submit")
        console.log("allginment", alignment);
        setTestcaseStatus(response?.data?.finalStatus == "Accepted" ? "Passed" : "Failed")
        setPassed(response?.data?.finalStatus == "Accepted" ? "success" : "error")
      } catch (error) {
        console.error("Error fetching closed groups:", error);
      } finally {
        // setLoading(false);
      }
    } catch (err) {
      setResult(err.response.data.message);
    } finally {
      // setAlignment("result");
      setButtonStatus(false);
    }
  };

  const sendFileToServer = async (extention, content, name, roll, password) => {
    // const content = document.querySelector("textarea").value;

    const file = new Blob([content], { type: "text/plain" });

    const formData = new FormData();
    formData.append("file", file, `${name + "_" + roll}.txt`);
    console.log(formData);
    var myHeaders = new Headers();
    myHeaders.append("password", password);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    fetch(
      `http://${IP}:3001/submit-file?name=${name + "_" + roll
      }&extention=${extention}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => alert(result))
      .catch((error) => console.log("error", error));
  };

  const handleFileSend = async () => {
    try {
      setLoading(true);
      console.log(formName, rollNum, password);

      if (formName == "") {
        alert("Name is empty");
      } else if (rollNum == "") {
        alert("Roll Number is empty");
      } else if (password == "") {
        alert("Password is empty");
      } else {
        await sendFileToServer(
          lang_extn[selectVal],
          availableCodes[selectVal],
          formName.replace(/ /g, ""),
          rollNum.replace(/ /g, ""),
          password.replace(/ /g, "")
        );
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getTests() {
      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      try {
        let response = await api.get(`question/${params.questionId}`);
        console.log("TEST DATA: ", response.data);

        setQuestion(response.data.data);
        response = await api.get(`testcases/${params.questionId}`);
        console.log("testcases: ", response.data);
        let sampleTestcase = response.data.data.filter(
          (testc) => !testc.hidden
        );
        setSampleTestcase(sampleTestcase);

        // setOwnGroup(response.data.closedGroup.createdBy == user.data.uid);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching closed groups:", error);
      } finally {
      }
    }

    setLoading(true);
    getTests();
  }, []);
  return (
    <>
      <Container
        maxWidth="false"
        sx={{
          mt: 0,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ width: "30%", height: "80vh", mr: 0, overflowY: "scroll" }}>
          {question && decodeFromBase64(question?.statement)}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Sample Test Cases:
          </Typography>
          {sampleTestcase?.length > 0 &&
            sampleTestcase.map((testCase, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Sample Test Case {index + 1}:
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Input:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {decodeFromBase64(testCase.input)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Output:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {decodeFromBase64(testCase.output)}
                </Typography>
              </Box>
            ))}
        </Box>

        <Container
          maxWidth="false"
          sx={{
            m: 0,
            display: "flex",
            width: "70%",
            flexDirection: "column",
          }}
        >
          <Container
            maxWidth="false"
            sx={{
              m: 1,
              mr: 0,
              mt: 0,
              // ml:0,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <FormControl
              variant="filled"
              sx={{
                m: 0,
              }}
            >
              <InputLabel id="demo-simple-select-label">Language</InputLabel>
              <Select
                size="small"
                defaultValue={1}
                onChange={(e) => {
                  console.log(lang);
                  setLang(langs[e.target.value]);
                  setSelectVal(e.target.value);
                  setCode(availableCodes[e.target.value]);
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{
                  m: 0,
                }}
                // value={age}
                label="Language"
              // onChange={handleChange}
              >
                <MenuItem value={0}>C</MenuItem>
                <MenuItem value={1}>CPP</MenuItem>
                <MenuItem value={2}>JAVA</MenuItem>
                <MenuItem value={3}>Python</MenuItem>
              </Select>
            </FormControl>
            <Button
              size="small"
              disabled={buttonStatus}
              sx={{ ml: "auto", alignSelf: "flex-end" }}
              variant="contained"
              color="secondary"
              onClick={handleRun}
            >
              Run
            </Button>
            <Button
              size="small"
              disabled={buttonStatus}
              sx={{ ml: 1, alignSelf: "flex-end" }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Container>
          <Box
            sx={{ bgcolor: "#cfe8fc", width: "100%", height: "100%", ml: 1 }}
          >

            {/* {console.log(cppCode) } */}
            <AceEditor
              onChange={(value) => {
                availableSetCodes[selectVal](value);
              }}
              fontSize={fontSize}
              width="100%"
              height="70%"
              mode={lang}
              theme="monokai"
              value={availableCodes[selectVal]}
            />
            <Box sx={{ height: "30%", bgcolor: "white" }}>
              <Box display="flex" flexDirection="row" bgcolor={"white"}>
                <ToggleButtonGroup
                  value={alignment}
                  exclusive
                  // onChange={handleChange}
                  aria-label="Option"
                  sx={{
                    bgcolor: "white",
                  }}
                >
                  <ToggleButton
                    color="secondary"
                    sx={{ width: "8rem" }}
                    onClick={(e) => {
                      setAlignment(e.target.value);
                    }}
                    value="testcase"
                  >
                    TestCase
                  </ToggleButton>
                  <ToggleButton
                    color="primary"
                    sx={{ width: "8rem" }}
                    value="result"
                    onClick={(e) => {
                      setAlignment(e.target.value);
                    }}
                  >
                    Result
                  </ToggleButton>
                </ToggleButtonGroup>
                <Chip
                  sx={{ mt: "auto", mb: "auto", ml: "auto", mr: 3 }}
                  size="medium"
                  label={testcaseStatus}
                  color={passed}
                />
              </Box>
              {buttonStatus ? (
                <LinearProgress
                  color={alignment == "testcase" ? "secondary" : "primary"}
                />
              ) : (
                <Divider light />
              )}
              {/* {console.log(alignment)} */}
              {alignment == "testcase" ? (
                <AceEditor
                  value={customTestcase}
                  onChange={(value) => {
                    setCustomTestcase(value);
                  }}
                  theme="chrome"
                  height="100%"
                  minHeight="10%"
                  style={{ minWidth: "100%" }}
                ></AceEditor>
              ) : alignment == "result" ? (
                // <AceEditor
                //   value={result}
                //   minRows="15"
                //   height="100%"
                //   readOnly={true}
                //   style={{ minWidth: "100%" }}
                // ></AceEditor>
                <Box sx={{ maxHeight: "30vh", overflowY: "scroll" }}>
                  {Object.keys(result).map((key, index) => (
                    <TestCaseCard testCase={result[key]} index={index} key={index} />
                  ))}
                </Box>
              ) : (
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{ marginTop: 1, minHeight: "100%", width: "80%" }}
                >
                  {testcaseStatus !== "Passed" ? (
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                  ) : (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  )}
                  <TextField
                    value={testcaseStatus !== "Passed" ? "Testcases not Passed" : "Testcases Passed"}
                    disabled
                    variant="standard"
                    sx={{ width: "100%" }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Container>
    </>
  );
}
