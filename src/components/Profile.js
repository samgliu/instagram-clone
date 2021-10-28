import '../style/Profile.css';
import Posts from '../components/Posts';
import Newpost from './Newpost';
import Header from './Header';
import PostDetail from './PostDetail';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
function Profile(props) {
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
    } = useContext(GlobalContext);

    const [profileUsersignedin, setProfileUsersignedin] = useState(false);
    const [ischangingavatar, setIschangingavatar] = useState(false);
    const [locIsFollowed, setLocIsFollowed] = useState(true);
    const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState();
    const [editingInfo, setEditingInfo] = useState(false);
    const [isProfileowner, setIsProfileowner] = useState(false);
    let nickName = '';
    let information = '';
    //console.log('inprofile', props);
    useEffect(() => {
        async function fetchData() {
            if (isusersignedin) {
                if (displayname === props.username) {
                    setIsProfileowner(true);
                } else {
                    setIsProfileowner(false);
                }
                // console.log('isusersignedin changed', isusersignedin);
                await getprofileFromserver(props.uuid).then(() => {
                    /* console.log(
                        'profiledata in getprofileFromserver',
                        profiledata
                    );*/
                });
                await checkisFollowed(props.uuid);
                if (isfollowed) {
                    setLocIsFollowed(true);
                } else {
                    setLocIsFollowed(false);
                }

                // console.log('locIsFollowed isfollowed', locIsFollowed);
            } else {
                history.push('/signin');
            }
        }
        fetchData();

        //console.log('isfollowed', isfollowed);
    }, [props, isfollowed, isusersignedin, isProfileowner]);

    /*
    useEffect(() => {
        const testauth = getAuth().onAuthStateChanged(function (user) {
            if (user) {
                setProfileUsersignedin(true);
                console.log('User is signed in', user);
                console.log('isusersignedin?', profileUsersignedin);
                regetdataFromserver();
            } else {
                setProfileUsersignedin(false);
                console.log('// No user is signed in.');
            }
        });
    }, [profileUsersignedin, regetdataFromserver]);
*/
    let loctext = '';

    const [previewimg, setPreviewimg] = useState();
    const onSelectChange = async (e) => {
        e.preventDefault();
        setIschangingavatar(true);
        setPreviewimg(window.URL.createObjectURL(e.target.files[0]));
        setImgblob(e.target.files[0]);
    };

    function selectbtnonClick(e) {
        e.preventDefault();
        document.getElementById('getavatarFile').click();
    }

    async function onsavebtnOnclicked(e) {
        console.log(imgblob);
        await saveAvatartoserver(imgblob);
        //setIschangingavatar(false);
    }
    function unfollowOnClicked(e) {
        e.preventDefault();
        //e.currentTarget.disabled = true;
        unfollowTarget(props.uuid);
        setLocIsFollowed(false);
        // console.log('unfollowOnClicked targetuid: ', props.uuid);
        // console.log('unfollowOnClicked');
    }
    function followedbtnrender() {
        return (
            <div>
                <button
                    className="followBtn"
                    onClick={(e) => unfollowOnClicked(e)}
                >
                    Unfollow
                </button>
            </div>
        );
    }
    function followOnClicked(e) {
        e.preventDefault();
        //e.currentTarget.disabled = true;
        followTarget(props.uuid);
        setLocIsFollowed(true);
        //  console.log('followOnClicked targetuid: ', props.uuid);
    }
    function notfollowedbtnrender() {
        return (
            <div>
                <button
                    className="followBtn"
                    onClick={(e) => followOnClicked(e)}
                >
                    Follow
                </button>
            </div>
        );
    }
    // console.log('profiledata', profiledata);

    function editOnClick(e) {
        e.preventDefault();
        setEditingInfo(!editingInfo);
    }
    function saveEditOnClick(e) {
        e.preventDefault();
        setEditingInfo(false);
        saveProfileInfoToServer(nickName, information);
        let isNameChanged = nickName ? true : false;
        let isInfoChange = information ? true : false;
        if (isNameChanged) profiledata.name = nickName;
        if (isInfoChange) profiledata.info = information;
    }

    function isOwnerRender() {
        // console.log('isOwnerRender');
        return (
            <div className="topprofile">
                <div className="profileImgWrapper">
                    <img
                        id="profileavatar"
                        src={ischangingavatar ? previewimg : profiledata.avatar}
                        className="topprofileOwner"
                        alt=""
                        title="Change Profile Photo"
                        onClick={(e) => selectbtnonClick(e)}
                    />
                    <div>
                        <input
                            type="file"
                            id="getavatarFile"
                            onChange={(e) => onSelectChange(e)}
                            style={{ display: 'none' }}
                        />
                        {ischangingavatar ? (
                            <div className="saveButton">
                                <button onClick={(e) => onsavebtnOnclicked(e)}>
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>

                <div className="profileInfoWrapper">
                    <div>
                        <span className="usernameFont">
                            {profiledata.username}
                        </span>
                        <button
                            className="editBtn"
                            onClick={(e) => editOnClick(e)}
                        >
                            Edit Profile
                        </button>
                    </div>
                    {!editingInfo ? (
                        <div>
                            <div className="nicknameFont">
                                {profiledata.name}
                            </div>
                            <div>{profiledata.info}</div>
                        </div>
                    ) : (
                        <div className="editingWrapper">
                            <div>
                                <input
                                    className="nameInputBox"
                                    type="text"
                                    defaultValue={profiledata.name}
                                    placeholder="Name"
                                    onChange={(event) => {
                                        nickName = event.target.value;
                                    }}
                                />
                            </div>
                            <div>
                                <textarea
                                    className="infoTextBox"
                                    placeholder="Information"
                                    type="text"
                                    rows="3"
                                    defaultValue={profiledata.info}
                                    onChange={(event) => {
                                        information = event.target.value;
                                    }}
                                />
                            </div>

                            <button
                                className="saveBtn"
                                onClick={(e) => saveEditOnClick(e)}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function notOwnerRender() {
        //  console.log('notOwnerRender');
        return (
            <div className="topprofile">
                <div className="profileImgWrapper">
                    <img
                        id="profileavatar"
                        src={ischangingavatar ? previewimg : profiledata.avatar}
                        alt=""
                    />
                </div>
                <div className="profileInfoWrapper">
                    <div className="nameBtnWrapper">
                        <span className="usernameFont">
                            {profiledata.username}
                        </span>
                        {locIsFollowed
                            ? followedbtnrender()
                            : notfollowedbtnrender()}
                    </div>

                    <div>
                        <div>
                            <div className="nicknameFont">
                                {profiledata.name}
                            </div>
                            <div>{profiledata.info}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function handleShowDetail(e, data) {
        e.preventDefault();
        setIsPostDetailOpen(!isPostDetailOpen);
        //   console.log('data', data);
        setDetailData(data);
        //  console.log('handleShowDetail', data);
    }

    if (profiledata) {
        return (
            <div>
                <Header />
                {isPostDetailOpen ? (
                    <PostDetail
                        post={detailData}
                        setIsPostDetailOpen={setIsPostDetailOpen}
                        isPostDetailOpen={isPostDetailOpen}
                    />
                ) : (
                    <div></div>
                )}
                <div className="Profile">
                    <Newpost />

                    {isProfileowner ? isOwnerRender() : notOwnerRender()}

                    <div className="picturegrid">
                        {profiledata.arr.map((profile) => {
                            //console.log('profile', profile);
                            return (
                                <div className="gridimg" key={uuidv4()}>
                                    <div
                                        className="imgClickable"
                                        onClick={(e) => {
                                            if (profile) {
                                                handleShowDetail(e, profile);
                                            }
                                        }}
                                    >
                                        <img src={profile.pic} alt="" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Header />
                <div className="Profile">
                    <Newpost />
                </div>
            </div>
        );
    }
}

export default Profile;
