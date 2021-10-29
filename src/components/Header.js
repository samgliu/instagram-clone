import instagram from '../images/instagram.png';
import Iconmenu from './Iconmenu';
import Newpost from './Newpost';
import '../style/Header.css';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect, useState } from 'react';

function Header() {
    const {
        profilepic,
        isusersignedin,
        setIsusersignedin,
        history,
        setIsHomeClicked,
        setIsProfileMenuOpen,
        searchUserFromServer,
        setMessageButtonClicked,
    } = useContext(GlobalContext);
    // console.log('indeader profilepic', profilepic);
    const [isSearchOpen, setIsSearchOpen] = useState(false); //FIXME change back to false
    //let keyword = '';
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const handleProceed = (e, link) => {
        e.preventDefault();

        history.push(link);
    };
    function homebtnonClick(e) {
        e.preventDefault();
        setIsHomeClicked(true);
        setIsProfileMenuOpen(false);
        setMessageButtonClicked(false);
        history.push('/');
    }
    function searchOnFocus(e) {
        e.preventDefault();
        setIsSearchOpen(true);
    }
    function searchOnBlur(e) {
        e.preventDefault();
        setIsSearchOpen(false); //FIXME change back to false
    }
    async function searchOnEnter() {
        //console.log(keyword);
        if (keyword !== '') {
            let arr = await searchUserFromServer(keyword);
            console.log(arr);
            setSearchResult(arr);
        }
    }
    useEffect(() => {
        // console.log('searching');
    }, [searchResult]);
    // onBlur={(e) => searchOnBlur(e)}
    return (
        <div className="Header">
            <div className="Headerimgwrapper">
                <img
                    className="Headerimg"
                    src={instagram}
                    alt=""
                    onClick={(e) => homebtnonClick(e)}
                />
            </div>
            <div className="searchBox">
                <input
                    type="text"
                    placeholder="Search"
                    onFocus={(e) => searchOnFocus(e)}
                    onBlur={(e) => searchOnBlur(e)}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            e.preventDefault();
                            searchOnEnter();
                        }
                    }}
                />
                {isSearchOpen ? (
                    <div className="searchResultWrapper">
                        <div className="searchResultWrapperHeader">Result</div>
                        <div className="searchResultContainer">
                            {searchResult.map((resUser) => (
                                <div className="resLineContainer">
                                    <div>
                                        <img src={resUser.avatar} alt="" />
                                    </div>

                                    <Link
                                        to={{
                                            pathname: `/profile/${resUser.username}/${resUser.uid}`,
                                        }}
                                        onMouseDown={(e) =>
                                            handleProceed(
                                                e,
                                                `/profile/${resUser.username}/${resUser.uid}`
                                            )
                                        }
                                    >
                                        @{resUser.username}&nbsp;
                                    </Link>
                                    <strong>{resUser.name}</strong>
                                </div>
                            ))}
                        </div>
                        {/**/}
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            <Iconmenu profilepic={profilepic} />
        </div>
    );
}

export default Header;
