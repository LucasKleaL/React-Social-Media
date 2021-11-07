import React, { useState, useEffect } from "react";
import firebase from "../Firebase";
import { Grid, Paper, Avatar, Typography, TextField, Button } from '@material-ui/core'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import '../styles/registration.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import DefaultProfileImg from "../public/default-profile.png";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Esportes',
    'Games',
    'Tecnologia',
    'Astronomia',
    'Matemática',
    'Filmes',
    'Ciência',
    'Memes',
    'Séries',
    'Fotografia',
];

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [userId, setUserId] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("");
  const [interesses, setInteresses] = React.useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
           setUserId = user.uid
        }
    });
    
}, []);
  
  function cadastrar() {
    firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then((value) => {
        firebase.firestore().collection("usuario").doc(value.user.uid)
          .set({
            nome: nome,
            usuario: usuario,
            dataNascimento: dataNascimento,
            genero: genero,
            interesses: interesses,
            saldo: 1000
          })
          interesses.forEach(element => {
          firebase.firestore().collection("interesse").doc(element)
          .update({
            idUsuarios: firebase.firestore.FieldValue.arrayUnion(value.user.uid)
          });
          firebase.storage().ref("usuario").child(value.user.uid).put(DefaultProfileImg).
            then(() => {
                console.log("Foto de perfil atualizada com sucesso.")
            })
            .catch(() => {
                console.log("Erro ao atualizar foto de perfil.");
            })
          });
          
        console.log("gravou")
      }).catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert('A senha é muito fraca!')
        } else if (error.code === 'auth/email-already-in-use') {
          alert('O e-mail já está sendo usado.')
        }
      });
  }
  async function setProfileImg(e) {

    let file = e.target.files[0];

    await firebase.storage().ref("usuario").child(userId).put(file).
        then(() => {
            console.log("Foto de perfil atualizada com sucesso.")
        })
        .catch(() => {
            console.log("Erro ao atualizar foto de perfil.");
        })

    
}
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInteresses(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const paperStyle = { padding: 20, width: 500, margin: "0 auto" }
  const avatarStyle = { backgroundColor: '#1bbd7e' }
  const marginTop = { marginTop: 5 }

  return (
    <Grid>
      <Paper elevation={0} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <Typography variant='caption' gutterBottom>Preencha o formulário para criar a sua conta! : {mensagem}</Typography>
        </Grid>
        <div>
          <TextField id="outlined-basic" label="Email" type="text" data-value="" onChange={(e) => { setEmail(e.target.value) }} fullWidth required />
        </div>
        <div>
          <TextField id="outlined-basic" label="Senha" type="password" onChange={(e) => { setSenha(e.target.value) }} fullWidth required />
        </div>
        <div>
          <TextField id="outlined-basic" label="Nome" type="text" onChange={(e) => { setNome(e.target.value) }} fullWidth required />
        </div>
        <div>
          <TextField id="outlined-basic" label="Nome de usuário" type="text" onChange={(e) => { setUsuario(e.target.value) }} fullWidth required />
        </div>
        <div>
          <input id="outlined-basic"  type="hidden" value={DefaultProfileImg} onChange={(e) => { setProfileImg(e.target.value) }} fullWidth required />
        </div>
        <div>
          <TextField id="outlined-basic" label="Data de nascimento" type="date" InputLabelProps={{ shrink: true }} onChange={(e) => { setDataNascimento(e.target.value) }} fullWidth required />
        </div>
        <div>
          <FormControl component="fieldset" style={marginTop}>
            <FormLabel component="legend">Gênero</FormLabel>
            <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
              <FormControlLabel value="female" control={<Radio />} onChange={(e) => { setGenero(e.target.value) }} label="Feminino" />
              <FormControlLabel value="male" control={<Radio />} onChange={(e) => { setGenero(e.target.value) }} label="Masculino" />
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <div>
            <FormControl sx={{ m: 0, width: 400 }}>
              <InputLabel id="demo-multiple-checkbox-label">Interesses</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={interesses}
                onChange={handleChange}
                input={<OutlinedInput label="Interesses" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={interesses.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div>
          <Button variant='contained' color='primary' className="buttonCreateAccount" onClick={cadastrar} fullWidth required>Criar conta</Button>
        </div>
      </Paper>
    </Grid>


  )
}

export default App;