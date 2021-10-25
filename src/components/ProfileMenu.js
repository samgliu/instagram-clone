import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect } from 'react';
import { useParams, generatePath } from 'react-router-dom';

function ProfileMenu(props) {
    const {
        userLogout,
        history,
        isProfileMenuOpen,
        setIsHomeClicked,
        setIsProfileMenuOpen,
        username,
        useruid,
    } = useContext(GlobalContext);
    function logout(e) {
        e.preventDefault();
        setIsHomeClicked(false);
        userLogout();
    }
    function profileOnclick(e) {
        e.preventDefault();
        setIsProfileMenuOpen(false);
        setIsHomeClicked(false);
    }
    let { uname, uuid } = useParams();

    const handleProceed = (e) => {
        e.preventDefault();
        uname = username;
        uuid = useruid;
        history.push(`/profile/${username}/${useruid}`);

        //console.log(generatePath('/profile/:username', { username }));
        // username &&
        //    history.push(generatePath('/profile/:username', { username }));
    };

    return (
        <div className="ProfileMenu">
            <div
                className="profilemenuwrapper"
                onClick={(e) => profileOnclick(e)}
            >
                <span className=""></span>
                <div className="menuseparator">
                    <Link
                        to={{
                            pathname: `/profile/${username}/${useruid}`,
                        }}
                        onClick={(e) => handleProceed(e)}
                    >
                        Profile
                    </Link>
                </div>
                <div>
                    <Link to="/signin">Sign in</Link>
                </div>
                <div>
                    <Link to="/signup">Sign up</Link>
                </div>
                <div>
                    <Link to="/signout" onClick={(e) => logout(e)}>
                        Log out
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProfileMenu;
