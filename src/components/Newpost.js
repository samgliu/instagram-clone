import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Link } from 'react-router-dom';
import '../style/Newpost.css';
import { default as noimg } from '../images/noimg.svg';

const Newpost = () => {
    const {
        isNewpostOpen,
        setIsNewpostOpen,
        displayname,
        setImgblob,
        imgblob,
        savePostToserver,
        regetdataFromserver,
    } = useContext(GlobalContext);

    const [previewimg, setPreviewimg] = useState(noimg);

    //  console.log('in Newpost displayname', displayname);
    let loctext = '';
    const onSelectChange = (e) => {
        e.preventDefault();
        //  console.log(window.URL.createObjectURL(e.target.files[0]));
        if (e.target.files.length !== 0) {
            setPreviewimg(window.URL.createObjectURL(e.target.files[0]));
        }
        setImgblob(e.target.files[0]);
    };
    const onCloseClick = (e) => {
        e.preventDefault();
        setIsNewpostOpen(!isNewpostOpen);
    };

    const savePost = async (e) => {
        e.preventDefault();
        //  console.log(loctext, imgblob);
        await savePostToserver(loctext, imgblob);
        setIsNewpostOpen(false);
        //  console.log('regetdataFromserver 1');
        setTimeout(async () => await regetdataFromserver(), 3000); // delay 3s for server to response FIXME
        //   console.log('regetdataFromserver 5');
    };
    function selectbtnonClick(e) {
        e.preventDefault();
        document.getElementById('getFile').click();
    }

    return (
        <div className={isNewpostOpen ? 'newpost' : 'newpost newpostHidden'}>
            <div className="newpostHeader">
                <div>Create new post</div>
                <div>
                    <Link to="/" onClick={(e) => savePost(e)}>
                        Share
                    </Link>
                    <button
                        type="button"
                        onClick={(e) => onCloseClick(e)}
                        className="closebtn"
                    >
                        ✖
                    </button>
                </div>
            </div>
            <div className="postform">
                <div className="postimg">
                    <img src={previewimg} alt="" />
                    <button
                        className="file-upload-button"
                        onClick={(e) => selectbtnonClick(e)}
                    >
                        Select from computer
                    </button>

                    <input
                        type="file"
                        id="getFile"
                        onChange={(e) => onSelectChange(e)}
                        style={{ display: 'none' }}
                    />
                </div>
                <div className="postinfo">
                    <p>
                        <strong>{displayname}</strong>
                    </p>

                    <div className="posttext">
                        <textarea
                            rows="8"
                            cols="30"
                            placeholder="Write a caption..."
                            onChange={(e) => (loctext = e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newpost;
