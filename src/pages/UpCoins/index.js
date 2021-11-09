import { React, useState } from "react";
import { Container, Button, Typography, Grid } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import "./../../styles/upcoins.css";

import Paypal from "./../../components/Paypal";

import BuyButtonBlue from "./../../themes/BuyButtonBlue";
import BuyButtonPurple from "./../../themes/BuyButtonPurple";
import BuyButtonGreen from "./../../themes/BuyButtonGreen";

import SetUpPurple from "./../../public/setup_purple.png";
import SetUpBlue from "./../../public/setup_blue.png";
import SetUpGreen from "./../../public/setup_green.png";

function UpCoins() {

    const [blueCheckout, setBlueCheckout] = useState(false);
    const [purpleCheckout, setPurpleCheckout] = useState(false);
    const [greenCheckout, setGreenCheckout] = useState(false);

    function blueRecharge() {
        console.log("blueRecharge")
        return <Paypal />
    }

    const title = {
        fontSize: "3.5rem",
        fontWeight: "600"
    }

    const subtitle = {
        fontWeight: "600",
        color: "var(--gray-dark-text)",
        paddingBottom: "0.5rem"
    }

    const buyButtonStyle = {
        marginTop: "0.5rem",
        borderWidth: "2px",
        textTransform: "uppercase",
        fontWeight: "600",
        fontSize: "0.5rem"
    }

    return (

        <ThemeProvider>

            <Container maxwidth="lg" style={{"marginTop": "1rem"}} align="center">

            <Typography variant="h1" style={title}>Up Coins</Typography>

            <Grid container spacing={3} align="center" style={{"textAlign": "center", "marginTop": "2rem" }}> 

                <Grid item align="center" style={{"textAlign": "center" , "width": "33%"}}>     

                    <img src={SetUpBlue} className="setup-icon" />

                    <div>
                        <Typography variant="h5" style={{"fontWeight": "600"}}>Blue Recharge</Typography>
                        <Typography variant="h6">1000 Up Coins</Typography>
                        <Typography variant="h7">R$ 5,00</Typography>
                    </div>
                    
                    <ThemeProvider theme={BuyButtonBlue}>
                        {
                            blueCheckout ? (<Paypal checkout="blue" />) : (<Button variant="outlined" color="primary" onClick={() => {setBlueCheckout(true)}} style={buyButtonStyle}>Comprar</Button>)
                        }
                    </ThemeProvider>
                    
                </Grid>

                <Grid item style={{"textAlign": "center" , "width": "33%"}}> 

                    <img src={SetUpPurple} className="setup-icon" />

                    <div>
                        <Typography variant="h5" style={{"fontWeight": "600"}}>Purple Recharge</Typography>
                        <Typography variant="h6">6000 Up Coins</Typography>
                        <Typography variant="h7">R$ 20,00</Typography>
                    </div>
                    
                    <ThemeProvider theme={BuyButtonPurple}>
                        {
                            purpleCheckout ? (<Paypal checkout="purple" />) : (<Button variant="outlined" color="primary" onClick={() => {setPurpleCheckout(true)}} style={buyButtonStyle}>Comprar</Button>)
                        }
                    </ThemeProvider>

                </Grid>

                <Grid item style={{"textAlign": "center", "width": "33%"}}> 

                    <img src={SetUpGreen} className="setup-icon" />

                    <div>
                        <Typography variant="h5" style={{"fontWeight": "600"}}>Green Recharge</Typography>
                        <Typography variant="h6">15000 Up Coins</Typography>
                        <Typography variant="h7">R$ 50,00</Typography>
                    </div>

                    <ThemeProvider theme={BuyButtonGreen}>
                        {
                            greenCheckout ? (<Paypal checkout="green"/>) : (<Button variant="outlined" color="primary" onClick={() => {setGreenCheckout(true)}} style={buyButtonStyle}>Comprar</Button>)
                        }
                    </ThemeProvider>

                </Grid>

            </Grid>

            <div className="div-faq" style={{"marginTop": "3rem"}}>
                <Typography variant="h4" style={subtitle}>O que são Up Coins?</Typography>
                <Typography variant="p" style={{"width": "10rem"}}>
                    Up coins são moedas utilizadas na rede para impulsinar publicações, além disso, uma quantia do valor acumulado
                    é destinado para o autor da publicação. Assim você pode ajudar seus criadores de conteúdo favoritos!
                </Typography>
            </div>

            <div className="div-faq" style={{"marginTop": "0.5rem"}}>
                <Typography variant="h4" style={subtitle}>Como eu uso Up Coins?</Typography>
                <Typography variant="p" style={{"width": "10rem"}}>
                    Em cada publicação você encontrará um ícone de flecha, que representa um Up Vote. A cada Up Vote realizado 
                    seu saldo de Up Coins será descontado em 200 coins.
                </Typography>
            </div>

            <div className="div-faq" style={{"marginTop": "0.5rem"}}>
                <Typography variant="h4" style={subtitle}>Como eu posso ganhar Up Coins?</Typography>
                <Typography variant="p" style={{"width": "10rem"}}>
                    Toda publicação feita na rede está habilitada para receber Up Votes. Produza conteúdos que gerem engajamento, assim
                    você irá atrair usuários interessados e eles poderão impulsionar sua publicação!
                </Typography>
            </div>

            </Container>

        </ThemeProvider>

        

    )

    

}

export default UpCoins;