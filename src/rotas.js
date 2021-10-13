import {BrowserRouter, Route} from 'react-router-dom';
import Home from './pages/home'
import Registration from './components/registrationForm'
import LoginPage from './pages/Login'

const Rotas = () => {

    return(
        <BrowserRouter>
            <Route exact={true} path="/" component={Home}/>
            <Route exact={true} path="/cadastro" component={Registration}/>
            <Route exact={true} path="/login" component={LoginPage}/>
        </BrowserRouter>

    )

}

export default Rotas