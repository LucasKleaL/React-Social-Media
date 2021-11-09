import { createTheme } from "@material-ui/core"; 

const BuyButtonPurple = createTheme({  
    palette: {
        primary: {
          light: "#30B72D",
          main: "#30B72D",
          dark: "#121212",
          getContrastText: "#121212"
        }
      }
});

export default BuyButtonPurple;