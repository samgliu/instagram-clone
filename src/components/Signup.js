import '../style/Signup.css';
import instagram from '../images/instagram.png';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext } from 'react';
function Signup() {
    const { onSubmitSignup, history } = useContext(GlobalContext);

    let email = '';
    let fullname = '';
    let username = '';
    let password = '';

    async function onSubmit(e) {
        e.preventDefault();
        await onSubmitSignup(
            email,
            password,
            fullname,
            username,
            'https://firebasestorage.googleapis.com/v0/b/clonewebsite-eb6e6.appspot.com/o/avatardefault.svg?alt=media&token=acd38542-5ccb-48ff-97ee-10df1201725d'
        );
        history.push('/signin');
    }

    return (
        <div className="signup">
            <div className="signupcontainer">
                <div>
                    <img src={instagram} alt="" />
                </div>
                <div>Sign up to see photos and videos from your friends.</div>

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
                        type="text"
                        placeholder="Full Name"
                        onChange={(event) => {
                            fullname = event.target.value;
                        }}
                        required
                    />
                    <input
                        className="inputbox"
                        type="text"
                        placeholder="User Name"
                        onChange={(event) => {
                            username = event.target.value;
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
                        value="Sign up"
                    />
                </form>
                <div style={{ fontSize: '0.7em' }}>
                    <p>
                        By signing up, you agree to our Terms , Data Policy and
                        Cookies Policy . (Don't use any real username &
                        password)
                    </p>
                </div>
                <div className="bottomBox">
                    Have an account? <Link to="/signin">Log in</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
