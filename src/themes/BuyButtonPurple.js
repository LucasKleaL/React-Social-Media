import { createTheme } from "@material-ui/core"; 

const BuyButtonPurple = createTheme({  
    palette: {
        primary: {
          light: "#7300ff",
          main: "#7300ff",
          dark: "#121212",
          getContrastText: "#121212"
        }
      }
});

export default BuyButtonPurple;