import '../style/Profile.css';
import Posts from '../components/Posts';
import Newpost from './Newpost';
import Header from './Header';
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
        isProfileowner,
        isfollowed,
        setIsfollowed,
        followTarget,
        unfollowTarget,
        checkisFollowed,
    } = useContext(GlobalContext);
    const [profileUsersignedin, setProfileUsersignedin] = useState(false);
    const [ischangingavatar, setIschangingavatar] = useState(false);
    console.log('inprofile', props);
    useEffect(() => {
        async function fetchData() {
            if (isusersignedin) {
                console.log('isusersignedin changed', isusersignedin);
                await getprofileFromserver(props.uuid).then(() =>
                    console.log(
                        'profiledata in getprofileFromserver',
                        profiledata
                    )
                );
                await checkisFollowed(props.uuid);

                console.log('setIsfollowed isfollowed', isfollowed);
            } else {
                history.push('/signin');
            }
        }
        fetchData();
        console.log('isfollowed', isfollowed);
    }, [props, isfollowed]);

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
        e.currentTarget.disabled = true;
        unfollowTarget(props.uuid);
        console.log('unfollowOnClicked targetuid: ', props.uuid);
        console.log('unfollowOnClicked');
    }
    function followedbtnrender() {
        return (
            <div>
                <button onClick={(e) => unfollowOnClicked(e)}>Unfollow</button>
            </div>
        );
    }
    function followOnClicked(e) {
        e.preventDefault();
        e.currentTarget.disabled = true;
        followTarget(props.uuid);
        console.log('followOnClicked targetuid: ', props.uuid);
    }
    function notfollowedbtnrender() {
        return (
            <div>
                <button onClick={(e) => followOnClicked(e)}>Follow</button>
            </div>
        );
    }
    console.log('profiledata', profiledata);
    function isOwnerRender() {
        console.log('isOwnerRender');
        return (
            <div className="topprofile">
                <div>
                    <img
                        id="profileavatar"
                        src={ischangingavatar ? previewimg : profiledata.avatar}
                        alt=""
                        title="Change Profile Photo"
                        onClick={(e) => selectbtnonClick(e)}
                    />
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
                <div>
                    <h2>{profiledata.username}</h2>
                </div>
            </div>
        );
    }
    function notOwnerRender() {
        console.log('notOwnerRender');
        return (
            <div className="topprofile">
                <div>
                    <img
                        id="profileavatar"
                        src={ischangingavatar ? previewimg : profiledata.avatar}
                        alt=""
                    />
                </div>
                <div>
                    <h2>{profiledata.username}</h2>
                </div>
                <div>
                    {isfollowed ? followedbtnrender() : notfollowedbtnrender()}
                </div>
            </div>
        );
    }

    if (profiledata) {
        return (
            <div>
                <Header />
                <div className="Profile">
                    <Newpost />

                    {isProfileowner ? isOwnerRender() : notOwnerRender()}

                    <div className="picturegrid">
                        {profiledata.arr.map((profile) => (
                            <div className="gridimg" key={uuidv4()}>
                                <img src={profile.pic} alt="" />
                            </div>
                        ))}
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
