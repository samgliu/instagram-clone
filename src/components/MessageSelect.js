import '../style/Signup.css';
import instagram from '../images/instagram.png';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect, useState } from 'react';
import { Timestamp } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

function MessageSelect({ closeNewMsg, HandleNextOnClick }) {
    const {
        onSubmitSignin,
        getUserinfo,
        history,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        regetdataFromserver,
        getDataFromserver,
        setIsHomeClicked,
        searchUserFromServer,
    } = useContext(GlobalContext);
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    function onCloseClick(e) {
        e.preventDefault();
        closeNewMsg();
    }

    async function searchOnEnter() {
        //console.log(keyword);
        if (keyword !== '') {
            let arr = await searchUserFromServer(keyword);
            // console.log(arr);
            setSearchResult(arr);
        }
    }
    function resultItemOnClick(e, theUser) {
        e.preventDefault();
        setSelectedUser(theUser);
    }
    function nextOnClick(e) {
        e.preventDefault();
        HandleNextOnClick(selectedUser);
    }
    function resItemRender(resUser) {
        //console.log(resUser);
        return (
            <div
                className="searchResultItem"
                onClick={(e) => {
                    resultItemOnClick(e, resUser);
                }}
                key={uuidv4()}
            >
                <div className="itemInfoWrapper">
                    <img src={resUser.avatar} alt="" />
                    <span>@{resUser.username}</span>
                    <span>{resUser.name}</span>
                </div>
                <div>
                    <svg
                        aria-label="Toggle selection"
                        color="#262626"
                        fill="#262626"
                        height="24"
                        role="img"
                        viewBox="0 0 24 24"
                        width="24"
                    >
                        <circle
                            cx="12.008"
                            cy="12"
                            fill="none"
                            r="11.25"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                        ></circle>
                    </svg>
                </div>
            </div>
        );
    }
    return (
        <div className="msgSelectWrapper">
            <div className="newMsgHeader">
                <button
                    type="button"
                    onClick={(e) => onCloseClick(e)}
                    className="closebtn"
                >
                    ✖
                </button>
                <h2>New Message</h2>
                <div className="nextBtn" onClick={(e) => nextOnClick(e)}>
                    Next
                </div>
            </div>
            <div className="newMsgToBox">
                <span>To: </span>
                {selectedUser ? (
                    <span className="selectedWrapper">
                        {selectedUser.username}
                    </span>
                ) : (
                    <span></span>
                )}

                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => {
                        setKeyword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            e.preventDefault();
                            searchOnEnter();
                            e.target.value = '';
                        }
                    }}
                />
            </div>
            <span>Suggested</span>
            <div className="searchResultBox">
                {searchResult.map((resUser) => resItemRender(resUser))}
            </div>
        </div>
    );
}

export default MessageSelect;
