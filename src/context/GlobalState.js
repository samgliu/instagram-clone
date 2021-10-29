import React, { createContext, useReducer, useState, useEffect } from 'react';
import { App, db } from '../components/Firebase';
import { v4 as uuidv4 } from 'uuid';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    serverTimestamp,
    getDocs,
    query,
    arrayUnion,
    arrayRemove,
    collectionGroup,
    where,
    limit,
    orderBy,
    onSnapshot,
    deleteDoc,
} from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    setPersistence,
    browserSessionPersistence,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const initialState = [];

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isHomeClicked, setIsHomeClicked] = useState(true);
    const [messageButtonClicked, setMessageButtonClicked] = useState(false);
    const [curuser, setCuruser] = useState();
    const [curemail, setCuremail] = useState();
    const [info, setInfo] = useState();
    const [isNewpostOpen, setIsNewpostOpen] = useState(false);
    const [displayname, setDisplayname] = useState();
    const [username, setUsername] = useState();
    const [useruid, setUseruid] = useState();
    const [posts, setPosts] = useState([]);
    const [profilepic, setProfilepic] = useState();
    const [isusersignedin, setIsusersignedin] = useState(false);
    const [imgblob, setImgblob] = useState();
    const [profiledata, setProfiledata] = useState();
    //const [isProfileowner, setIsProfileowner] = useState(false);
    const [isfollowed, setIsfollowed] = useState(false);
    const [allRooms, setAllRooms] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatUnsubscribe, setChatUnsubscribe] = useState();
    const [friendId, setFriendId] = useState();
    const [chatRoomId, setChatRoomId] = useState();

    const storage = getStorage();
    const history = useHistory();
    const testauth = getAuth();

    async function checkLogin() {
        try {
            await new Promise((resolve, reject) =>
                getAuth().onAuthStateChanged(
                    (user) => {
                        if (user) {
                            // User is signed in.
                            setIsusersignedin(true);
                            resolve(user);
                        } else {
                            // No user is signed in.
                            reject('no user logged in');
                        }
                    },
                    // Prevent console error
                    (error) => reject(error)
                )
            );
            return true;
        } catch (error) {
            return false;
        }
    }
    /*
    async function checkLogin1() {
        onAuthStateChanged(getAuth(), async (user) => {
            setIsusersignedin(true);
            if (user) return true;
            else return false;
        });
        if (getAuth().currentUser) {
            return true;
        } else {
            return false;
        }
        /*
         onAuthStateChanged(testauth, (user) => {
            if (user) {
                setIsusersignedin(true);
                console.log('User is signed in', user);
                return true;
            } else {
                setIsusersignedin(false);
                console.log('// No user is signed in.');
                return false;
            }
        });
    }*/

    async function getDataFromserver(usr) {
        //get posts for main user
        //console.log('curuser', curuser);
        //console.log('usr', usr);
        let theuid = usr.uid;
        let locdoc = doc(db, 'users', `${theuid}`); //, 'post'
        let userdoc = await getDoc(locdoc);
        let userdata = userdoc.data();
        //console.log('userdata', userdata);
        let avatar = userdata.avatar;
        let loccol = collection(locdoc, 'post');
        let followingusers = userdata.following;
        const cols = query(loccol);
        const colarr = await getDocs(cols);
        //console.log('getDataFromserver colarr', colarr);
        let newarr = [];
        let tempCollection = []; // temp
        //console.log('foreach 1');

        const mapPosts = async (thecolarr) => {
            const resArr = [];
            // console.log('in mapPosts thecolarr', thecolarr);
            thecolarr.forEach(async (thedoc) => {
                tempCollection.push(thedoc);
            });
            //console.log('mapPosts resArr', resArr);
            return resArr;
        };

        //==================1================
        //console.log('before mapPosts colarr', colarr);
        const mapFollowing = async (thefollowingusers) => {
            const resArr = [];

            thefollowingusers.forEach(async (thefollowingusers) => {
                //console.log('followinguser', followinguser);
                let followinguserdoc = await getDoc(thefollowingusers);
                //  console.log('followinguserdoc', followinguserdoc);
                let fodata = followinguserdoc.data();
                let fousercol = collection(thefollowingusers, 'post');
                const fousercols = query(fousercol);
                // console.log('fousercols', fousercols);
                const focolarr = await getDocs(fousercols);
                //console.log('focolarr', focolarr);
                let postsArr = await mapPosts(focolarr);
                resArr.push(postsArr);
            });
            //console.log('resArr', resArr);
            return resArr;
        };

        //===================2=================
        // 2st foreach for following user's doc
        //Object.keys(followingusers).map(async (followinguser) => {
        await mapPosts(colarr);
        //console.log('newarr1', newarr1);
        await mapFollowing(followingusers);
        // newarr = [...newarr1, ...newarr2];
        //console.log('after mapFollowing', newarr);
        async function sortsetPosts(thenewarr) {
            //  console.log(thenewarr);
            //  console.log('in sortsetPosts', thenewarr.length); // it's 0, so never sort

            let sorted = thenewarr.sort((a, b) => {
                //console.log('compareto ab', a, b);
                // console.log('compareto', a.timestamp - b.timestamp);
                if (a.timestamp === null) a.timestamp = Date.now();
                if (b.timestamp === null) b.timestamp = Date.now();
                return b.timestamp - a.timestamp;
            });
            //console.log('sortsetPosts response', sorted);
            return sorted;
        }

        let tempArr = [];
        //console.log('tempCollection', tempCollection);
        for (let col of tempCollection) {
            let theref = col.data();
            let docsSnap = await getDocs(
                query(
                    collection(db, col.ref.path, 'comments'),
                    orderBy('timestamp', 'desc') //, limit(2)
                )
            );

            let commentArr = [];
            if (!docsSnap.empty) {
                docsSnap.forEach(async (snap) => {
                    let avatar = (await getDoc(snap.data().owneruser)).data()
                        .avatar;
                    //console.log('avatar. ', avatar);
                    //console.log('snap data', snap.data());
                    let newObj = {
                        ...snap.data(),
                        avatar: avatar,
                    };
                    //console.log('avatar. ', newObj);

                    commentArr.push(newObj);
                });
            }
            let ownerDoc = theref.owneruser;
            // console.log('ownerDoc', ownerDoc);
            let ownerdata = (await getDoc(ownerDoc)).data();
            //console.log('getDataFromserver ownerDoc', ownerdata);
            let newdoc = {
                ...col.data(),
                avatar: ownerdata.avatar,
                uuid: ownerdata.uid,
                comments: commentArr,
            };

            tempArr.push(newdoc);
        }
        //console.log('collection tempArr', tempArr);
        let sortedTempArr = await sortsetPosts(tempArr);

        setPosts(sortedTempArr);
        await fetchGroupByUserID(theuid);
        //console.log('foreach 3');
    }

    async function regetdataFromserver() {
        const auth = getAuth();
        setDisplayname(auth.currentUser.displayName);
        //console.log('called regetdataFromserver');
        onAuthStateChanged(testauth, async (user) => {
            if (user) {
                setIsusersignedin(true);
                await getDataFromserver(auth.currentUser);
                setUsername(auth.currentUser.displayName);
                setUseruid(auth.currentUser.uid);
                setProfilepic(auth.currentUser.photoURL);
                //console.log('User is signed in', user);
            } else {
                setIsusersignedin(false);
                console.log('// No user is signed in.');
            }
        });
    }

    async function getprofileFromserver1(theuid) {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // console.log('getprofileFromserver user', user, theuid);
                let ownerusername = user.displayName;

                let locdoc = doc(db, 'users', `${theuid}`); //, 'post'
                //console.log(locdoc);
                let locavatardata = await getDoc(locdoc);
                let avatardata = locavatardata.data();
                //console.log('avatardata' + avatardata);
                let avatar = avatardata.avatar; // avatar info under user's doc
                let username = avatardata.username;
                // console.log('username, owner', username, ownerusername);
                /* if (username === ownerusername) {
                    setIsProfileowner(true);
                } else {
                    setIsProfileowner(false);
                }*/
                let loccol = collection(locdoc, 'post');
                const cols = query(loccol, orderBy('timestamp', 'desc'));
                const colarr = await getDocs(cols);

                const newarr = [];
                let filedata = {
                    arr: newarr,
                };
                /*
                colarr.forEach((doc) => {
                    let newdoc = { ...doc.data(), avatar: avatar };
                    newarr.push(newdoc);
                });
                setProfiledata(newarr);
                */
                async function processArray(array, newarr, avatar) {
                    array.forEach((doc) => {
                        //console.log('itemdata', doc.data());
                        let newdoc = { ...doc.data(), avatar: avatar };
                        newarr.push(newdoc);
                    });
                }
                processArray(colarr, newarr, avatar).then((newarr) => {
                    //setProfiledata(newarr);
                    // console.log('after for each', newarr);
                });
                filedata = { ...filedata, avatar: avatar, username: username };
                setProfiledata(filedata);
                //console.log('after processArray');
                // console.log(filedata);
            } else {
                console.log('// No user when getting profile');
            }
        });
    }

    async function getprofileFromserver(theuid) {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // console.log('getprofileFromserver user', user, theuid);
                let ownerusername = user.displayName;

                let locdoc = doc(db, 'users', `${theuid}`); //, 'post'
                // console.log(locdoc);
                let locavatardata = await getDoc(locdoc);
                let avatardata = locavatardata.data();
                //console.log('avatardata', avatardata);
                let avatar = avatardata.avatar; // avatar info under user's doc
                let info = avatardata.info;
                let nickName = avatardata.name;
                let username = avatardata.username;
                //  console.log('username, owner', username, ownerusername);

                let loccol = collection(locdoc, 'post');
                const cols = query(loccol, orderBy('timestamp', 'desc'));
                const colarr = await getDocs(cols);

                const newarr = [];
                let filedata = {
                    arr: newarr,
                };
                async function processArray(array, newarr, avatar) {
                    array.forEach(async (col) => {
                        //console.log('itemdata', col.data());

                        let docsSnap = await getDocs(
                            query(
                                collection(db, col.ref.path, 'comments'),
                                orderBy('timestamp', 'desc') //, limit(2)
                            )
                        );

                        let commentArr = [];
                        let tempCmtCollection = [];
                        if (!docsSnap.empty) {
                            docsSnap.forEach(async (snap) => {
                                tempCmtCollection.push(snap);
                            });
                        }

                        for (let snap of tempCmtCollection) {
                            let avatar = (
                                await getDoc(snap.data().owneruser)
                            ).data().avatar;
                            //console.log('avatar. ', avatar);
                            //console.log('snap data', snap.data());
                            let newObj = {
                                ...snap.data(),
                                avatar: avatar,
                            };
                            //console.log('avatar. ', newObj);

                            commentArr.push(newObj);
                        }

                        let newdoc = {
                            ...col.data(),
                            avatar: avatar,
                            comments: commentArr,
                        };

                        newarr.push(newdoc);
                        return newarr;
                    });
                }
                await processArray(colarr, newarr, avatar);
                filedata = {
                    ...filedata,
                    avatar: avatar,
                    username: username,
                    name: nickName,
                    info: info,
                };
                setTimeout(() => {
                    // console.log('after processArray');
                    setProfiledata(filedata);
                }, 500); //delay for server, FIXME

                //  console.log(filedata.arr.length);
            } else {
                console.log('// No user when getting profile');
            }
        });
    }

    async function saveProfileInfoToServer(theName, theInfo) {
        const auth = getAuth();
        let user = auth.currentUser;
        let isNameChanged = theName ? true : false;
        let isInfoChange = theInfo ? true : false;

        if (user) {
            /*console.log(
                'saveProfileInfoToServer ',
                isNameChanged,
                isInfoChange
            );*/
            if (isNameChanged) {
                await setDoc(
                    doc(db, 'users', `${user.uid}`),
                    {
                        name: theName,
                    },
                    { merge: true }
                );
            }
            if (isInfoChange) {
                await setDoc(
                    doc(db, 'users', `${user.uid}`),
                    {
                        info: theInfo,
                    },
                    { merge: true }
                );
            }
        }
    }

    async function checkisFollowed(theuid) {
        const auth = getAuth();
        let user = auth.currentUser;
        if (user) {
            let locdoc = await getDoc(
                doc(db, 'users', `${auth.currentUser.uid}`)
            );
            //console.log('docs in checkisfollowed', locdoc);
            let following = locdoc.data().following;
            //console.log('following in checkisfollowed', following);
            following.forEach(async (item) => {
                let theDoc = await getDoc(item);
                let targetUid = theDoc.data().uid;
                /* console.log(
                    'theDoc.data().uid === theuid: ',
                    targetUid === theuid,
                    theuid,
                    targetUid
                );*/
                if (targetUid === theuid) {
                    setIsfollowed(true);
                }
            });
        }
    }

    async function followTarget(theuid) {
        const auth = getAuth();
        let user = auth.currentUser;
        if (user) {
            await updateDoc(doc(db, 'users', `${auth.currentUser.uid}`), {
                following: arrayUnion(doc(db, 'users', theuid)),
            });
        }
    }

    async function unfollowTarget(theuid) {
        const auth = getAuth();
        let user = auth.currentUser;
        if (user) {
            await updateDoc(doc(db, 'users', `${auth.currentUser.uid}`), {
                following: arrayRemove(doc(db, 'users', theuid)),
            });
        }
    }

    async function savePostToserver(inputtext, imgblob) {
        const auth = getAuth();
        let user = auth.currentUser;
        let theuid = user.uid;
        let input = inputtext;
        let imgurl = 'default';
        if (user) {
            const imgstorageRef = ref(storage, `uploadedimages/${uuidv4()}`);
            await uploadBytes(imgstorageRef, imgblob).then((snapshot) => {
                // console.log('Uploaded a blob or file!', snapshot);
                getDownloadURL(snapshot.ref).then(function (downloadURL) {
                    console.log('File available at', downloadURL);
                    imgurl = downloadURL;
                    let randomPostId = uuidv4();
                    setDoc(
                        doc(db, 'users', `${theuid}`, 'post', randomPostId),
                        {
                            topic: inputtext,
                            pic: imgurl,
                            timestamp: serverTimestamp(),
                            username: user.displayName,
                            owneruser: doc(db, 'users', theuid),
                            postid: randomPostId,
                        },
                        { merge: true }
                    );
                });
            });
            //await regetdataFromserver();
        }

        //console.log('savePostToserver ', inputtext);
        //console.log('curuser', user);
        //console.log('uid', user.uid);
        //console.log('curuser.username', user.username);
        //console.log('timestamp', serverTimestamp());
        // console.log(theuid);
    }

    async function deletePostFromServer(path) {
        // console.log(path);
        const locDoc = doc(db, path);
        await deleteDoc(locDoc);
        // console.log('deletePostFromServer locDoc', locDoc);
    }

    async function saveCommentToServer(inputText, targetUid, targetPostId) {
        const auth = getAuth();
        let user = auth.currentUser;
        let theuid = targetUid;
        let input = inputText;
        //  console.log('saveCommentToServer ', inputText, targetPostId);
        if (user) {
            setDoc(
                doc(
                    collection(
                        db,
                        'users',
                        `${theuid}`,
                        'post',
                        `${targetPostId}`,
                        'comments'
                    )
                ),
                {
                    comment: inputText,
                    owneruser: doc(db, 'users', auth.currentUser.uid),
                    timestamp: serverTimestamp(),
                    username: auth.currentUser.displayName,
                },
                { merge: true }
            );

            await regetdataFromserver();
        }
    }

    async function createnewUserdata(theuid, email, fullname, username, pic) {
        try {
            await setDoc(doc(db, 'users', `${theuid}`), {
                uid: theuid,
                email: email,
                fullname: fullname,
                username: username,
                avatar: pic,
                followers: [], //uid
                following: [],
            });
            /*
            await setDoc(
                doc(db, 'users', `${theuid}`, 'post'),
                {
                    topic: 'testing',
                    pic: './images/pic01.jpg',
                },
                { merge: true }
            );
            */
            setUsername(username);
            console.log('Document written with ID: ');
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }
    /*
    function getdisplayName() {
        const auth = getAuth();
        const theuser = auth.currentUser;
        if (theuser) return theuser.displayName;
    }*/

    async function onSubmitSignup(email, password, fullname, username, pic) {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                const theuid = userCredential.user.uid;
                updateProfile(auth.currentUser, {
                    displayName: username,
                    photoURL:
                        'https://firebasestorage.googleapis.com/v0/b/clonewebsite-eb6e6.appspot.com/o/avatardefault.svg?alt=media&token=acd38542-5ccb-48ff-97ee-10df1201725d', //default avatar
                })
                    .then(() => {
                        // Profile updated!
                        // ...
                    })
                    .catch((error) => {
                        // An error occurred
                        // ...
                    });
                setCuruser(user);
                setDisplayname(fullname);
                setUsername(username);
                createnewUserdata(theuid, email, fullname, username, pic);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
                // ..
            });
    }
    async function getUserinfo(usr) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user !== null) {
            // The user object has basic properties such as display name, email, etc.

            // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.

            //getDataFromserver(usr);
            await regetdataFromserver();
        }
    }

    async function searchUserFromServer(keyword) {
        const auth = getAuth();
        // console.log(keyword);
        if (auth) {
            const usersRef = collection(db, 'users');
            const res = query(
                usersRef,
                where('username', '>=', keyword),
                where('username', '<=', keyword + '~')
            );
            const usersDocs = await getDocs(res);
            //console.log('searchUserFromServer', usersDocs);
            let userArr = [];
            usersDocs.forEach((locDoc) => {
                //console.log('locDoc', locDoc.data());
                userArr.push(locDoc.data());
            });
            //console.log('search...', userArr);
            return userArr; // FIXME server delay
        }
    }
    async function onSubmitSignin(email, password) {
        const auth = getAuth();
        if (auth) {
            auth.signOut();
        }

        let isLogedIn = false;
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...

                (async () => {
                    setCuruser(user);
                    //console.log('onSubmitSignin ', curuser);
                    setCuremail(email);
                    //   console.log('insubmitsignin user', user);
                    setDisplayname(user.displayName);
                    setProfilepic(user.photoURL);
                    setCuremail(user.email);
                })();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
            });
        /*
        updateProfile(auth.currentUser, {
            displayName: 'doejhon2',
            photoURL:
                'https://firebasestorage.googleapis.com/v0/b/clonewebsite-eb6e6.appspot.com/o/avatars%2Favatar02.jpg?alt=media&token=c5bee6f0-555d-4668-b89d-c68654e21604',
        })
            .then(() => {
                // Profile updated!
                // ...
            })
            .catch((error) => {
                // An error occurred
                // ...
            });*/
        return isLogedIn;
    }
    async function saveAvatartoserver(imgblob) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user !== null) {
            const imgstorageRef = ref(storage, `avatars/${uuidv4()}`);
            //   console.log('imgstorageRef', imgblob);
            await uploadBytes(imgstorageRef, imgblob).then((snapshot) => {
                //    console.log('Uploaded a blob or file!', snapshot);
                getDownloadURL(snapshot.ref).then(function (downloadURL) {
                    //     console.log('File available at', downloadURL);
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL,
                    })
                        .then(() => {
                            // Profile updated!
                            /*   console.log(
                                'now photo: ',
                                auth.currentUser.photoURL
                            );*/
                            setDoc(
                                doc(db, 'users', `${auth.currentUser.uid}`),
                                {
                                    avatar: auth.currentUser.photoURL,
                                },
                                { merge: true }
                            );
                        })
                        .catch((error) => {
                            // An error occurred
                            // ...
                        });
                });
            });
            await regetdataFromserver();
        }
    }

    async function defaultLogin() {
        await onSubmitSignin('test1@test1.com', 'testtest');
    }

    function userLogout() {
        const auth = getAuth();
        auth.signOut();
        //console.log(auth);
        setCuruser(null);
    }

    async function fetchGroupByUserID(uid) {
        const roomRef = collection(db, 'messageRoom');
        const q = query(roomRef, where('members', 'array-contains', uid));
        //const usersDocs = await getDocs(res);
        //console.log(usersDocs);
        let unsubscribe = onSnapshot(q, (querySnapshot) => {
            const rooms = [];
            querySnapshot.forEach(async (doc) => {
                let members = doc.data().members;
                let friendData = await fetchFriendInfo(members);
                const data = {
                    ...doc.data(),
                    roomid: doc.ref.id,
                    friendAvatar: friendData.avatar,
                    friendName: friendData.username,
                };
                //if (data.recentMessage) rooms.push(data);
                rooms.push(data);
                setTimeout(() => {
                    //console.log(rooms.length);
                    setAllRooms(rooms);
                }, 1000);
            });
        });
    }

    async function fetchFriendInfo(arr) {
        const auth = getAuth();
        let friendId;
        if (auth) {
            let myUid = auth.currentUser.uid;
            friendId = arr.filter((a) => a !== myUid);
            setFriendId(friendId[0]);
        }
        //console.log('friendsId', friendId);
        let data = await fetchInfoById(friendId[0]);
        return data;
    }

    async function fetchInfoById(uid) {
        const auth = getAuth();
        if (auth) {
            let locdoc = doc(db, 'users', `${uid}`); //, 'post'
            // console.log(locdoc);
            let locdata = (await getDoc(locdoc)).data();
            let avatar = locdata.avatar; // avatar info under user's doc
            let info = locdata.info;
            let nickName = locdata.name;
            let username = locdata.username;
            return { avatar: avatar, username: username, name: nickName };
        }
    }

    async function fetchChatHistoryByRoom(roomid) {
        const auth = getAuth();
        setChatRoomId(roomid);
        if (auth) {
            let q = query(
                collection(db, 'messages', `${roomid}`, 'submessage'),
                orderBy('timestamp', 'asc')
            );

            let unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chatArr = [];
                querySnapshot.forEach(async (snap) => {
                    //  console.log(snap);
                    let data = snap.data();
                    let theUid = data.from;
                    let pos = 1;
                    if (theUid === auth.currentUser.uid) {
                        pos = 0;
                    }
                    let time;
                    if (data.timestamp) {
                        time = data.timestamp.toDate().toLocaleTimeString();
                    } else {
                        time = '';
                    }
                    //console.log(data.timestamp.toDate().toLocaleTimeString());
                    let newObj = {
                        ...data,
                        position: pos,
                        time: time,
                    };
                    chatArr.push(newObj);
                });
                // console.log(chatArr);
                setTimeout(() => {
                    setChatHistory(chatArr);
                }, 1000);
            });
            //setChatUnsubscribe(unsubscribe);
        }
    }

    async function postChatToServer(content) {
        const auth = getAuth();
        let user = auth.currentUser;
        //console.log(content, chatRoomId);
        const chatMsg = {
            content: content,
            from: user.uid,
            timestamp: serverTimestamp(),
        };
        if (user) {
            ///messages/s0IYEWn6SOQjFCze427R/submessage
            setDoc(
                doc(collection(db, 'messages', `${chatRoomId}`, 'submessage')),
                chatMsg,
                { merge: true }
            );
        }
    }

    async function createChatroomOnServer(target) {
        const auth = getAuth();
        let user = auth.currentUser;
        let isCreatedBefore = false;
        let friendUid = target.uid;
        let members = {
            members: [friendUid, user.uid],
        };

        const roomRef = collection(db, 'messageRoom');
        let snap = query(roomRef, where('members', 'array-contains', members));
        const usersDocs = await getDocs(snap);
        if (!usersDocs.empty) {
            isCreatedBefore = true;
        }

        if (!isCreatedBefore) {
            if (user) {
                let username = target.username;

                if (user) {
                    ///messages/s0IYEWn6SOQjFCze427R/submessage
                    let ref = await addDoc(
                        collection(db, 'messageRoom'),
                        members
                    );
                    let roomId = ref.id;
                    setChatRoomId(roomId);
                    setFriendId(friendUid);
                    await fetchChatHistoryByRoom(roomId);
                }
            }
        }
        //console.log(target);
    }

    return (
        <GlobalContext.Provider
            value={{
                isProfileMenuOpen,
                setIsProfileMenuOpen,
                isHomeClicked,
                setIsHomeClicked,
                onSubmitSignup,
                onSubmitSignin,
                createnewUserdata,
                getUserinfo,
                history,
                curemail,
                userLogout,
                curuser,
                info,
                isNewpostOpen,
                setIsNewpostOpen,
                displayname,
                imgblob,
                setImgblob,
                savePostToserver,
                getDataFromserver,
                regetdataFromserver,
                posts,
                defaultLogin,
                profilepic,
                isusersignedin,
                setIsusersignedin,
                username,
                useruid,
                getprofileFromserver,
                profiledata,
                saveAvatartoserver,
                messageButtonClicked,
                setMessageButtonClicked,
                checkLogin,
                isfollowed,
                setIsfollowed,
                followTarget,
                unfollowTarget,
                checkisFollowed,
                saveCommentToServer,
                deletePostFromServer,
                saveProfileInfoToServer,
                searchUserFromServer,
                fetchGroupByUserID,
                allRooms,
                fetchFriendInfo,
                chatHistory,
                fetchChatHistoryByRoom,
                postChatToServer,
                friendId,
                chatRoomId,
                createChatroomOnServer,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
