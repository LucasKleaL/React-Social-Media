import React from "react";
import Registration from '../../components/registrationForm';
import Login from '../../components/loginForm'
import CustomizedDialogs from "../../components/dialog";
import { makeStyles } from "@material-ui/core/styles"
import { height } from "@mui/system";
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
function LoginPage() {
   const classes = useStyles();
   return (
      <div className={classes.root}>
         <div className={classes.left}>
            <h2>Cras ultricies, felis rutrum lobortis varius, velit diam viverra urna, nec vestibulum tortor justo eu dolor.</h2>
            <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h4>
         </div>
         <div className={classes.right}>
            <div className="divTitleGeral">
               <div className="titleEffectRight">
                  <h1 className="titleMain">Conecte-se com o mundo!</h1>
               </div>
               <div className="subTitleRight">
                  <h4>Cadastre-se agora mesmo e ganhe 1000 coins!</h4>
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

export default LoginPage;