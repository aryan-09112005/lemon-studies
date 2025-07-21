import { createTheme } from "@mui/material/styles";

const lemon = "#FFEB3B";      // Lemon yellow
const lemonHover = "#FDD835"; // Hover shade
const green = "#66BB6A";      // Fresh green
const greenHover = "#43A047"; // Hover shade

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f0f4f8", // Keep bluish background
      paper: "#ffffff",
    },
    primary: {
      main: lemon,
      contrastText: "#212121",
    },
    secondary: {
      main: green,
      contrastText: "#fff",
    },
    success: {
      main: green,
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
    h4: { fontWeight: 700, color: "#212121" },
    h5: { fontWeight: 600, color: "#212121" },
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--accent-green": green,
          "--accent-lemon": lemon,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: "16px",
          border: `1px solid ${lemon}40`,
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            transform: "translateY(-2px) scale(1.02)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
            borderColor: lemon,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontSize: "16px",
          padding: "10px 22px",
          transition: "all 0.2s ease",
        },
        containedPrimary: {
          backgroundColor: lemon,
          color: "#212121",
          "&:hover": {
            backgroundColor: lemonHover,
            boxShadow: `0 0 0 4px ${lemon}55`,
          },
        },
        containedSecondary: {
          backgroundColor: green,
          "&:hover": {
            backgroundColor: greenHover,
            boxShadow: `0 0 0 4px ${green}55`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            "&:hover fieldset": { borderColor: lemon },
            "&.Mui-focused fieldset": {
              borderColor: green,
              boxShadow: `0 0 0 3px ${green}33`,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: green },
        },
      },
    },
  },
});

export default theme;
