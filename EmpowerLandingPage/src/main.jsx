import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
