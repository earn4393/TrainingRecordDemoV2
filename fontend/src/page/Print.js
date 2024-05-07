import React from "react";
import PDFFile from '../page/Report';
import PDFFile2 from "../page/Report2";
// import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFViewer } from '@react-pdf/renderer';

const Print = () => {

    return (
        // <div className="App">
        //     <PDFDownloadLink document={<PDFFile />} filename="FORM">
        //         {({ loading }) => (loading ? <button>Loading Document...</button> : <button>Download</button>)}
        //     </PDFDownloadLink>
        //     {/* <PDFFile /> */}
        // </div>
        <PDFViewer width='100%' height='1000px'>
            <PDFFile2 />
        </PDFViewer>
    );

};

export default Print;