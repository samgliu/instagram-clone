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
    const [curuser, setCuruser] = useState();
    const [curemail, setCuremail] = useState();
    const [info, setInfo] = useState();
    const [isNewpostOpen, setIsNewpostOpen] = useState(false);
    const [displayname, setDisplayname] = useState();
    const [username, setUsername] = useState();
    const [useruid, setUseruid] = useState();
    const [posts, setPosts] = useState();
    const [profilepic, setProfilepic] = useState();
    const [isusersignedin, setIsusersignedin] = useState(false);
    const [imgblob, setImgblob] = useState();
    const [profiledata, setProfiledata] = useState();
    const [isProfileowner, setIsProfileowner] = useState(false);
    const [isfollowed, setIsfollowed] = useState(false);

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
        console.log('usr', usr);
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

        console.log('foreach 1');
        colarr.forEach(async (thedoc) => {
            console.log('outside mapPost', thedoc);
        });

        const mapPosts = async (thecolarr) => {
            const resArr = [];
            // console.log('in mapPosts thecolarr', thecolarr);
            thecolarr.forEach(async (thedoc) => {
                // 1st foreach for signed user's doc
                //console.log('getDataFromserver doc', thedoc);
                let theref = thedoc.data();

                if (!thecolarr.empty) {
                    // console.log('thecolarr not empty', !thecolarr.empty);
                } else {
                    // console.log('thecolarr is empty', !thecolarr.empty);
                }

                let docsSnap = await getDocs(
                    query(
                        collection(db, thedoc.ref.path, 'comments'),
                        orderBy('timestamp', 'desc') //, limit(2)
                    )
                );
                //console.log('getDataFromserver docSnap empty', docsSnap.empty);
                //console.log('getDataFromserver docSnap', docsSnap);
                let commentArr = [];
                if (!docsSnap.empty) {
                    docsSnap.forEach(async (snap) => {
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
                    });
                }

                let ownerDoc = theref.owneruser;
                // console.log('ownerDoc', ownerDoc);
                let ownerdata = (await getDoc(ownerDoc)).data();
                //console.log('getDataFromserver ownerDoc', ownerdata);
                let newdoc = {
                    ...thedoc.data(),
                    avatar: ownerdata.avatar,
                    uuid: ownerdata.uid,
                    comments: commentArr,
                };
                //console.log('getDataFromserver newdoc', newdoc);
                //console.log('newarr1 inforEach', newarr.length);
                resArr.push(newdoc);
                newarr.push(newdoc);
            });
            console.log('mapPosts resArr', resArr);
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

                /*
                console.log('postsArr', postsArr);*/

                //console.log('resArr.push(...postsArr)', resArr);
                /*
                if (fousercol) {
                    const fousercols = query(fousercol);
                    // console.log('fousercols', fousercols);
                    const focolarr = await getDocs(fousercols);
                    //console.log('focolarr', focolarr);

                    const mapFollwing
                    focolarr.forEach(async (thedoc) => {
                        //let ref = doc.data();
                        //let ownerDoc = ref.owneruser;
                        //let ownerdata = (await getDoc(ownerDoc)).data();+
    
                        let docsSnap = await getDocs(
                            query(
                                collection(db, thedoc.ref.path, 'comments'),
                                orderBy('timestamp', 'desc') //, limit(2)
                            )
                        );
    
                        let commentArr = [];
                        if (!docsSnap.empty) {
                            docsSnap.forEach(async (snap) => {
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
                            });
                            //console.log('commentArr', commentArr);
                        }
    
                        let newdoc = {
                            ...thedoc.data(),
                            avatar: fodata.avatar,
                            uuid: fodata.uid,
                            comments: commentArr,
                        };
                        // console.log('newdoc', newdoc);
                        resArr.push(newdoc);
    
                        console.log('newarr2 inforEach', resArr.length);
                    });
                }*/
            });
            console.log('resArr', resArr);
            return resArr;
        };
        //===================2=================
        // 2st foreach for following user's doc
        //Object.keys(followingusers).map(async (followinguser) => {
        const newarr1 = await mapPosts(colarr);
        //console.log('newarr1', newarr1);
        const newarr2 = await mapFollowing(followingusers);
        // newarr = [...newarr1, ...newarr2];
        console.log('after mapFollowing', newarr);
        async function sortsetPosts(theArr) {
            let response = theArr.sort((a, b) => {
                //console.log('sortsetposts ab', a, b);
                //console.log('compareto', a.timestamp - b.timestamp);
                return a.timestamp - b.timestamp > 0;
            });
            console.log('sortsetPosts response', response);
            return response;
        }

        // continue processing here
        // results[0] is the result of the first promise in the promises array
        console.log('before sorted newarr', newarr);

        sortsetPosts(newarr).then((response) => {
            console.log('response', response);
            //if (response.length > 0) {
            setPosts(response);
            //}
        });

        console.log('foreach 3');
    }

    async function regetdataFromserver() {
        const auth = getAuth();
        onAuthStateChanged(testauth, async (user) => {
            if (user) {
                setIsusersignedin(true);
                await getDataFromserver(auth.currentUser);
                setUsername(auth.currentUser.displayName);
                setUseruid(auth.currentUser.uid);
                setProfilepic(auth.currentUser.photoURL);
                console.log('User is signed in', user);
            } else {
                setIsusersignedin(false);
                console.log('// No user is signed in.');
            }
        });
    }

    async function getprofileFromserver(theuid) {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('getprofileFromserver user', user, theuid);
                let ownerusername = user.displayName;

                let locdoc = doc(db, 'users', `${theuid}`); //, 'post'
                console.log(locdoc);
                let locavatardata = await getDoc(locdoc);
                let avatardata = locavatardata.data();
                console.log('avatardata' + avatardata);
                let avatar = avatardata.avatar; // avatar info under user's doc
                let username = avatardata.username;
                console.log('username, owner', username, ownerusername);
                if (username === ownerusername) {
                    setIsProfileowner(true);
                } else {
                    setIsProfileowner(false);
                }
                let loccol = collection(locdoc, 'post');
                const cols = query(loccol);
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
                    console.log('after for each', newarr);
                });
                filedata = { ...filedata, avatar: avatar, username: username };
                setProfiledata(filedata);
                console.log('after processArray');
                console.log(filedata);
            } else {
                console.log('// No user when getting profile');
            }
        });
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
                console.log('Uploaded a blob or file!', snapshot);
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
            await regetdataFromserver();
        }

        console.log('savePostToserver ', inputtext);
        console.log('curuser', user);
        console.log('uid', user.uid);
        //console.log('curuser.username', user.username);

        console.log('timestamp', serverTimestamp());
        console.log(theuid);
    }

    async function saveCommentToServer(inputText, targetUid, targetPostId) {
        const auth = getAuth();
        let user = auth.currentUser;
        let theuid = targetUid;
        let input = inputText;
        console.log('saveCommentToServer ', inputText, targetPostId);
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
                    console.log('insubmitsignin dispayname', user.displayName);
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
            console.log('imgstorageRef', imgblob);
            await uploadBytes(imgstorageRef, imgblob).then((snapshot) => {
                console.log('Uploaded a blob or file!', snapshot);
                getDownloadURL(snapshot.ref).then(function (downloadURL) {
                    console.log('File available at', downloadURL);
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL,
                    })
                        .then(() => {
                            // Profile updated!
                            console.log(
                                'now photo: ',
                                auth.currentUser.photoURL
                            );
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
                isProfileowner,
                checkLogin,
                isfollowed,
                setIsfollowed,
                followTarget,
                unfollowTarget,
                checkisFollowed,
                saveCommentToServer,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
