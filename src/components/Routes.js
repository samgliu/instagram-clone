import { HashRouter, Redirect, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Signin from './Signin';
import Profile from './Profile';
import Message from './Message';
import { GlobalProvider } from '../context/GlobalState';

const Routes = () => {
    return (
        <HashRouter>
            <Switch>
                <GlobalProvider>
                    <Route exact path="/" render={(props) => <Home />} />
                    <Route exact path="/signup" component={Signup} />
                    <Route exact path="/signin" component={Signin} />
                    <Route exact path="/signout" component={Signin} />
                    <Route exact path="/message" component={Message} />
                    <Route
                        exact
                        path="/profile/:username/:uuid"
                        render={(props) => (
                            <Profile
                                username={props.match.params.username}
                                uuid={props.match.params.uuid}
                            />
                        )}
                    />
                </GlobalProvider>
            </Switch>
        </HashRouter>
    );
};

export default Routes;
