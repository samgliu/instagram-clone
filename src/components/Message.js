import '../style/Message.css';
import Header from './Header';
import MessageSelect from './MessageSelect';
import defaultMessageImg from '../images/defaultMessage.jpg';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
function Message(props) {
    const {
        getUserinfo,
        curemail,
        curuser,
        info,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        getDataFromserver,
        regetdataFromserver,
        onSubmitSignin,
        defaultLogin,
        posts,
        history,
        isusersignedin,
        setIsusersignedin,
        getprofileFromserver,
        profiledata,
        setImgblob,
        imgblob,
        saveAvatartoserver,
        isfollowed,
        setIsfollowed,
        followTarget,
        unfollowTarget,
        checkisFollowed,
        saveProfileInfoToServer,
        displayname,
        fetchGroupByUserID,
        allRooms,
        fetchFriendInfo,
        chatHistory,
        fetchChatHistoryByRoom,
        postChatToServer,
        createChatroomOnServer,
    } = useContext(GlobalContext);
    const [isDefaultView, setIsDefaultView] = useState(true);
    const [isSelectBoxOpen, setIsSelectBoxOpen] = useState(false); // FIXME change to false
    const [keyword, setKeyword] = useState('');
    useEffect(() => {
        // console.log('in useEffect', allRooms);
    }, [chatHistory]);

    function nameOnClick(e, roomid) {
        e.preventDefault();
        setIsDefaultView(false);
        fetchChatHistoryByRoom(roomid);
    }

    function sendMsgOnClick(e) {
        e.preventDefault();
        setIsSelectBoxOpen(true);
        //console.log(e);
    }

    function closeNewMsg() {
        setIsSelectBoxOpen(false);
    }

    function HandleNextOnClick(target) {
        setIsSelectBoxOpen(false);
        if (target) {
            createChatroomOnServer(target);
        }

        setIsDefaultView(false);
    }

    function roomRender(room) {
        if (room) {
            return (
                <div
                    className="msgListItem"
                    key={room.roomid}
                    onClick={(e) => nameOnClick(e, room.roomid)}
                >
                    <img
                        className="chatAvatar"
                        src={room.friendAvatar}
                        alt=""
                    />
                    {room.friendName}
                </div>
            );
        } else {
            return <div key={uuidv4()}></div>;
        }
    }
    async function sendMessage() {
        await postChatToServer(keyword);
    }
    return (
        <div>
            <Header />
            <div className="msgContainer">
                {isSelectBoxOpen ? (
                    <MessageSelect
                        closeNewMsg={closeNewMsg}
                        HandleNextOnClick={HandleNextOnClick}
                    />
                ) : (
                    <div></div>
                )}
                <div className="msgLeft">
                    <div className="msgLeftHeader">
                        <span>{displayname}</span>

                        <svg
                            aria-label="New Message"
                            color="#262626"
                            fill="#262626"
                            height="24"
                            role="img"
                            viewBox="0 0 44 44"
                            width="24"
                            onClick={(e) => sendMsgOnClick(e)}
                        >
                            <path d="M33.7 44.12H8.5a8.41 8.41 0 01-8.5-8.5v-25.2a8.41 8.41 0 018.5-8.5H23a1.5 1.5 0 010 3H8.5a5.45 5.45 0 00-5.5 5.5v25.2a5.45 5.45 0 005.5 5.5h25.2a5.45 5.45 0 005.5-5.5v-14.5a1.5 1.5 0 013 0v14.5a8.41 8.41 0 01-8.5 8.5z"></path>
                            <path d="M17.5 34.82h-6.7a1.5 1.5 0 01-1.5-1.5v-6.7a1.5 1.5 0 01.44-1.06L34.1 1.26a4.45 4.45 0 016.22 0l2.5 2.5a4.45 4.45 0 010 6.22l-24.3 24.4a1.5 1.5 0 01-1.02.44zm-5.2-3h4.58l23.86-24a1.45 1.45 0 000-2l-2.5-2.5a1.45 1.45 0 00-2 0l-24 23.86z"></path>
                            <path d="M38.2 14.02a1.51 1.51 0 01-1.1-.44l-6.56-6.56a1.5 1.5 0 012.12-2.12l6.6 6.6a1.49 1.49 0 010 2.12 1.51 1.51 0 01-1.06.4z"></path>
                        </svg>
                    </div>

                    <div className="msgListWrapper">
                        {allRooms.map((room) => roomRender(room))}
                    </div>
                </div>
                <div className="msgRight">
                    {isDefaultView ? (
                        <div className="msgDefaultWrapper">
                            <img src={defaultMessageImg} alt="" />
                            <h2>Your Messages</h2>
                            <p>
                                Send private photos and messages to a friend or
                                group
                            </p>
                            <button
                                className="newMsgBtn"
                                onClick={(e) => sendMsgOnClick(e)}
                            >
                                Send Message
                            </button>
                        </div>
                    ) : (
                        <div className="chatHistoryWrapper">
                            <div className="chatHistoryBox">
                                {chatHistory.map((chat) => {
                                    return (
                                        <div
                                            className={
                                                chat.position === 0
                                                    ? 'rightchatItem'
                                                    : 'leftchatItem'
                                            }
                                            key={uuidv4()}
                                        >
                                            <div>{chat.content}</div>
                                            <div className="chatTime">
                                                {chat.time}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="msgSendBox">
                                <input
                                    type="text"
                                    onChange={(e) => {
                                        setKeyword(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.code === 'Enter') {
                                            e.preventDefault();
                                            sendMessage();
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Message;
