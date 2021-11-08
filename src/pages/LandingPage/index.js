import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Firebase from "./../../Firebase";
import Registration from '../../components/RegistrationForm';
import Login from '../../components/LoginForm'
import CustomizedDialogs from "../../components/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import SetUpTextLogo from "./../../public/SetUpText.png";
import '../../styles/login.css';

const useStyles = makeStyles((theme) => ({
   root: {
      display: 'flex',
      height: '100vh'
   },
   left:{
      backgroundColor: '#7300ff',
      flexBasis: '58%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
   }, 
   right: {
      backgroundColor: 'black',
      flexBasis: '42%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
   }
}))

function LandingPage() {

   let history = useHistory();

   useEffect(() => {

      Firebase.auth().onAuthStateChanged((user) => {
         if(user) {
            history.push("/home");
         }
      })

   }, []); 

   const classes = useStyles();

   return (
      <div className={classes.root}>

         <div className={classes.left}>
            <div className="center">
                  <img src={SetUpTextLogo} className="logo-img"/>
            </div>
         </div>

         <div className={classes.right}>
            <div className="divTitleGeral">
               <div className="titleEffectRight">
                  <h1 className="titleMain">Conecte-se com o mundo!</h1>
               </div>
               <div className="subTitleRight">
                  <h4>Cadastre-se agora mesmo e ganhe um bônus inicial de 1000 UpCoins!</h4>
               </div>
            </div>

            <CustomizedDialogs title="Entrar na rede" titleButton="Entrar">
               <Login />
            </CustomizedDialogs>
            <CustomizedDialogs title="Criar sua conta" titleButton="Cadastrar">
               <Registration />
            </CustomizedDialogs>

         </div>

      </div>
   )
}

export default LandingPage;