export default function RootLayout({ children }) {
  return (
    <>
      <head>
        <title>Student Panel</title>
        {/* <link rel="icon" href="/images/AppIcon.png" type="image/x-icon" /> */}
      </head>
      <body>{children}</body>
    </>
  );
}
