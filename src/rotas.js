import {BrowserRouter, Route} from 'react-router-dom';
import Home from './pages/Home';
import Registration from './components/RegistrationForm';
import LandingPage from './pages/LandingPage';
import UpCoins from './pages/UpCoins';
import Profile from './pages/Profile';

const Rotas = () => {

    return(
        <BrowserRouter>
            <Route exact={true} path="/" component={LandingPage} />
            <Route exact={true} path="/home" component={Home} />
            <Route exact={true} path="/cadastro" component={Registration} />
            <Route exact={true} path="/upcoins" component={UpCoins} />
            <Route exact={true} path="/profile" component={Profile} />
        </BrowserRouter>

    )

}

export default Rotas