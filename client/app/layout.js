"use client";

import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { THEME_ID, createTheme, styled, useTheme } from "@mui/material/styles";

import React, { useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
// import PageNav from "@/components/PageNav";
// import { AuthProvider, ProtectRoute } from "@/contexts/auth";
import Head from "next/head";

const materialTheme = createTheme({
  // palette: {
  //   mode: "light",
  //   primary: {
  //     main: "#ff4081",
  //     light: "#f8bbd0",
  //     dark: "#f50057",
  //     contrastText: "#f5f5f5",
  //   },
  //   secondary: {
  //     main: "#fce4ec",
  //     dark: "#e57373",
  //     contrastText: "#000000",
  //   },
  //   divider: "rgba(0,0,0,0.24)",
  //   background: {
  //     paper: "#ffebee",
  //   },
  // },
  palette: {
    mode: "light",
    primary: {
      main: "#388e3c",
      light: "#c8e6c9",
      dark: "#388e3c",
      contrastText: "#f5f5f5",
    },
    secondary: {
      main: "#c8e6c9",
      dark: "#388e3c",
      contrastText: "#212121",
    },
    divider: "rgba(0,0,0,0.24)",
    background: {
      paper: "#c8e6c9",
    },
    error: {
      main: "#c62828",
    },
    warning: {
      main: "#fdd835",
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Admin</title>
        <link rel="icon" href="/public/skit_logo.png" type="image/x-icon" />
      </head>
      <body>
        <ThemeProvider theme={{ [THEME_ID]: materialTheme }}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
