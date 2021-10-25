import instagram from '../images/instagram.png';
import Iconmenu from './Iconmenu';
import Newpost from './Newpost';
import '../style/Header.css';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect } from 'react';

function Header() {
    const {
        profilepic,
        isusersignedin,
        setIsusersignedin,
        history,
        setIsHomeClicked,
        setIsProfileMenuOpen,
    } = useContext(GlobalContext);
    console.log('indeader profilepic', profilepic);
    function homebtnonClick(e) {
        e.preventDefault();
        setIsHomeClicked(true);
        setIsProfileMenuOpen(false);
        console.log('homebtnonClick');
        history.push('/');
    }
    return (
        <div className="Header">
            <div className="Headerimgwrapper">
                <img
                    className="Headerimg"
                    src={instagram}
                    alt=""
                    onClick={(e) => {
                        homebtnonClick(e);
                    }}
                />
            </div>
            <div>
                <input type="text" placeholder="Search" />
            </div>
            <Iconmenu profilepic={profilepic} />
        </div>
    );
}

export default Header;
