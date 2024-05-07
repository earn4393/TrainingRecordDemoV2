import React, { useState, useRef } from 'react';
import SignatureCanvas from "react-signature-canvas";
import axios from "../api/axios";
import '../styles/Upload.css'

const UploadIMG = () => {
    const [openModel, setOpenModal] = useState(false);
    const sigCanvas = useRef()
    // const [image, setImage] = useState(null);

    // const handleImageChange = (event) => {
    //     const selectedImages = Array.from(event.target.files);
    //     setImages(selectedImages)
    //     const urls = selectedImages.map(image => URL.createObjectURL(image));
    //     setImageUrls(urls);
    // };

    // const handleImageUpload = async () => {

    //     const formData = new FormData();
    //     images.forEach(image => {
    //         formData.append('images', image);
    //     });
    //     await axios.post('/upload/TEST', formData).then(res => {
    //         console.log(res)
    //     })
    //         .catch(error => {
    //             console.error('Error uploading image:', error);
    //         })
    // };

    const create = async () => {
        const url = sigCanvas.current.getTrimmedCanvas().toDataURL();
        setOpenModal(false);
        await axios.post('/save-signature', { signature: url, filename: 'signature.png' }).then((res) => {
            console.log(res)
        })
            .catch(err => {
                console.error('Error build image:', err);
            })

        // await axios.post('/upload', { id: 'TEST', sign: 'signature.png' }).then((res) => {
        //     console.log(res)
        // })
        //     .catch(err => {
        //         console.error('Error uploading image:', err);
        //     })
    }

    return (
        <div className="app">
            <button onClick={() => setOpenModal(true)}>Create Signature</button>
            <br />

            {openModel && (
                <div className="modalContainer">
                    <div className="modal1">
                        <div className="modal__bottom1">
                            <div className="sigPadContainer">
                                <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{ className: "sigCanvas" }}
                                    ref={sigCanvas}
                                />
                            </div>
                            <hr />
                            <button onClick={() => sigCanvas.current.clear()}>Clear</button>
                            <button onClick={() => setOpenModal(false)}>Cancel</button>
                            <button className="create" onClick={create}>Create</button>
                        </div>
                    </div>
                </div>
            )}
            <br />
            <>
                <img src={'http://localhost:3331/service2/images/signature.png'} alt="signature" className="signature" />
            </>
        </div>
    );

}

export default UploadIMG