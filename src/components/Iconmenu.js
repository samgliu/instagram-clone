import { GlobalContext } from '../context/GlobalState';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
function Iconmenu({ profilepic }) {
    const {
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        isHomeClicked,
        setIsHomeClicked,
        isNewpostOpen,
        setIsNewpostOpen,
        history,
        username,
        regetdataFromserver,
        messageButtonClicked,
        setMessageButtonClicked,
    } = useContext(GlobalContext);
    function profilebtnonClick(e) {
        e.preventDefault();
        setIsProfileMenuOpen(!isProfileMenuOpen);
    }

    async function homebtnonClick(e) {
        e.preventDefault();
        //setIsHomeClicked(!isHomeClicked);
        //  console.log('homebtnonClick');

        setIsHomeClicked(true);
        console.log(' setMessageButtonClicked(false);', messageButtonClicked);
        setMessageButtonClicked(false);

        await regetdataFromserver();
        setIsProfileMenuOpen(false);
        //console.log('IsHomeClicked', isHomeClicked);
        history.push('/');
    }
    function newpostonClick(e) {
        e.preventDefault();
        setIsNewpostOpen(!isNewpostOpen);
    }
    function messageOnClick(e) {
        e.preventDefault();
        history.push('/message');
        setIsHomeClicked(false);
        setMessageButtonClicked(true);
    }
    return (
        <div className="iconmenu">
            <div className="iconwrapper">
                <button tabIndex="0" onClick={(e) => homebtnonClick(e)}>
                    {/*FIXME: testing svg color switching*/}
                    {isHomeClicked ? (
                        <svg
                            aria-label="Home"
                            color="#262626"
                            fill="#262626"
                            height="22"
                            role="img"
                            viewBox="0 0 48 48"
                            width="22"
                        >
                            <path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z"></path>
                        </svg>
                    ) : (
                        <svg
                            aria-label="Home"
                            color="#262626"
                            fill="#262626"
                            height="22"
                            role="img"
                            viewBox="0 0 48 48"
                            width="22"
                        >
                            <path d="M45.3 48H30c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2-4.6-4.6-4.6s-4.6 2-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.5-.6 2.1 0l21.5 21.5c.4.4.6 1.1.3 1.6 0 .1-.1.1-.1.2v22.8c.1.8-.6 1.5-1.4 1.5zm-13.8-3h12.3V23.4L24 3.6l-20 20V45h12.3V34.2c0-4.3 3.3-7.6 7.6-7.6s7.6 3.3 7.6 7.6V45z"></path>
                        </svg>
                    )}
                </button>
            </div>

            <div className="iconwrapper">
                <Link
                    to="/message"
                    tabIndex="0"
                    onClick={(e) => messageOnClick(e)}
                >
                    {!messageButtonClicked ? (
                        <svg
                            aria-label="Direct"
                            color="#262626"
                            fill="#262626"
                            height="22"
                            role="img"
                            viewBox="0 0 48 48"
                            width="22"
                        >
                            <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path>
                        </svg>
                    ) : (
                        <svg
                            aria-label="Direct"
                            color="#262626"
                            fill="#262626"
                            height="22"
                            role="img"
                            viewBox="0 0 48 48"
                            width="22"
                        >
                            <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l13.2 13c.5.4 1.1.6 1.7.3l16.6-8c.7-.3 1.6-.1 2 .5.4.7.2 1.6-.5 2l-15.6 9.9c-.5.3-.8 1-.7 1.6l4.6 19c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.5-.5.5-1.1.2-1.6z"></path>
                        </svg>
                    )}
                </Link>
            </div>
            <div className="iconwrapper">
                <button
                    className="addpostbtn"
                    type="button"
                    onClick={(e) => newpostonClick(e)}
                >
                    <div>
                        <svg
                            aria-label="New Post"
                            color="#262626"
                            fill="#262626"
                            height="22"
                            role="img"
                            viewBox="0 0 48 48"
                            width="22"
                        >
                            <path d="M31.8 48H16.2c-6.6 0-9.6-1.6-12.1-4C1.6 41.4 0 38.4 0 31.8V16.2C0 9.6 1.6 6.6 4 4.1 6.6 1.6 9.6 0 16.2 0h15.6c6.6 0 9.6 1.6 12.1 4C46.4 6.6 48 9.6 48 16.2v15.6c0 6.6-1.6 9.6-4 12.1-2.6 2.5-5.6 4.1-12.2 4.1zM16.2 3C10 3 7.8 4.6 6.1 6.2 4.6 7.8 3 10 3 16.2v15.6c0 6.2 1.6 8.4 3.2 10.1 1.6 1.6 3.8 3.1 10 3.1h15.6c6.2 0 8.4-1.6 10.1-3.2 1.6-1.6 3.1-3.8 3.1-10V16.2c0-6.2-1.6-8.4-3.2-10.1C40.2 4.6 38 3 31.8 3H16.2z"></path>
                            <path d="M36.3 25.5H11.7c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5h24.6c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z"></path>
                            <path d="M24 37.8c-.8 0-1.5-.7-1.5-1.5V11.7c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v24.6c0 .8-.7 1.5-1.5 1.5z"></path>
                        </svg>
                    </div>
                </button>
            </div>
            <div className="iconwrapper">
                <button
                    className="profilebtn"
                    type="button"
                    onClick={(e) => profilebtnonClick(e)}
                >
                    {profilepic === undefined ? (
                        <svg
                            aria-label="Profile"
                            color="#262626"
                            fill="#262626"
                            height="16"
                            role="img"
                            viewBox="0 0 32 32"
                            width="16"
                        >
                            <path d="M16 0C7.2 0 0 7.1 0 16c0 4.8 2.1 9.1 5.5 12l.3.3C8.5 30.6 12.1 32 16 32s7.5-1.4 10.2-3.7l.3-.3c3.4-3 5.5-7.2 5.5-12 0-8.9-7.2-16-16-16zm0 29c-2.8 0-5.3-.9-7.5-2.4.5-.9.9-1.3 1.4-1.8.7-.5 1.5-.8 2.4-.8h7.2c.9 0 1.7.3 2.4.8.5.4.9.8 1.4 1.8-2 1.5-4.5 2.4-7.3 2.4zm9.7-4.4c-.5-.9-1.1-1.5-1.9-2.1-1.2-.9-2.7-1.4-4.2-1.4h-7.2c-1.5 0-3 .5-4.2 1.4-.8.6-1.4 1.2-1.9 2.1C4.2 22.3 3 19.3 3 16 3 8.8 8.8 3 16 3s13 5.8 13 13c0 3.3-1.2 6.3-3.3 8.6zM16 5.7c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 11c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path>
                        </svg>
                    ) : (
                        <img src={profilepic} alt="" />
                    )}
                    <div></div>
                </button>
            </div>
            {isProfileMenuOpen ? <ProfileMenu username={username} /> : ''}
        </div>
    );
}

export default Iconmenu;
