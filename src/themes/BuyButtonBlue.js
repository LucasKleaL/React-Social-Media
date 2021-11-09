import { createTheme } from "@material-ui/core"; 

const BuyButtonBlue = createTheme({  
    palette: {
        primary: {
          light: "#008394",
          main: "#00bcd4",
          dark: "#121212",
          getContrastText: "#121212"
        }
      }
});

export default BuyButtonBlue;