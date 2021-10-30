import {BrowserRouter, Route} from 'react-router-dom';
import Home from './pages/Home'
import Registration from './components/registrationForm'
import LandingPage from './pages/LandingPage'

const Rotas = () => {

    return(
        <BrowserRouter>
            <Route exact={true} path="/" component={LandingPage}/>
            <Route exact={true} path="/home" component={Home}/>
            <Route exact={true} path="/cadastro" component={Registration}/>
        </BrowserRouter>

    )

}

export default Rotas