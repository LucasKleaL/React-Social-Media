import { React, useEffect, useState } from "react";
import Modal from '@material-ui/core/Modal';

import './../styles/home.css';

function ShareModal(props) {

    const [open, setOpen] = useState();

    useEffect(() => {
        console.log("useEffect shareModal")
        if(props.isOpen == false) {
            
            handleOpen();
        }
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (

        <Modal
            open={open}
            onClose={handleClose}
        >

            <h1>Modal</h1>

        </Modal>

    )

}

export default ShareModal;