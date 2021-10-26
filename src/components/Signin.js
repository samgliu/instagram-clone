import '../style/Signup.css';
import instagram from '../images/instagram.png';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect } from 'react';

function Signin() {
    const {
        onSubmitSignin,
        getUserinfo,
        history,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        regetdataFromserver,
        getDataFromserver,
        setIsHomeClicked,
    } = useContext(GlobalContext);
    let email = '';
    let password = '';

    async function onSubmit(e) {
        e.preventDefault();
        setIsHomeClicked(true);
        await onSubmitSignin(email, password);
        /*if (await onSubmitSignin(email, password)) {
            await getUserinfo();
        }*/
        history.push('/');
    }
    return (
        <div className="signup">
            <div className="signupcontainer">
                <div>
                    <img src={instagram} alt="" />
                </div>

                <form
                    className="sigupform"
                    onSubmit={(e) => {
                        onSubmit(e);
                    }}
                >
                    <input
                        className="inputbox"
                        type="email"
                        placeholder="Email"
                        onChange={(event) => {
                            email = event.target.value;
                        }}
                        required
                    />

                    <input
                        className="inputbox"
                        type="password"
                        placeholder="Password"
                        onChange={(event) => {
                            password = event.target.value;
                        }}
                        required
                    />
                    <input
                        className="sigupformbutton"
                        type="submit"
                        value="Log in"
                    />
                </form>
                <div style={{ fontSize: '0.7em' }}>
                    <p>Forgot password?</p>
                    (Don't use any real username & password) (test account:
                    test1@test1.com:testtest)
                </div>
                <div className="bottomBox">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default Signin;
