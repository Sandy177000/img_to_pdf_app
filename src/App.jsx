import { useRef, useState } from "react";
import "./App.css";
import {
  Document,
  Page,
  Text,
  Image,
  pdf,
  StyleSheet,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function App() {
  const [name, setName] = useState("");
  const fileInputRef = useRef(null);
  const [pfile, setpfile] = useState([]);

  const onDrop = useCallback(
    (files) => {
      const images = [];

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          images.push(e.target.result);
          if (images.length === files.length) {
            setpfile(images);
            fileInputRef.current.value = "";
          }
        };

        reader.onerror = (err) => {
          console.log("error reading the file", err);
        };
        reader.readAsDataURL(f);
      }
    },
    [pfile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const readFile = () => {
    const files = fileInputRef.current.files;
    const images = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        images.push(e.target.result);
        if (images.length === files.length) {
          setpfile(images);
          fileInputRef.current.value = "";
        }
      };

      reader.onerror = (err) => {
        console.log("error reading the file", err);
      };
      reader.readAsDataURL(f);
    }
  };

  const generatePDF = async () => {
    try {
      const doc = (
        <Document>
          {pfile.map((img, index) => (
            <Page key={index}>
              <Image src={img}></Image>
            </Page>
          ))}
        </Document>
      );

      const PDF = pdf();
      PDF.updateContainer(doc);
      const pdfBLOB = await PDF.toBlob();
      console.log(doc);
      const nameOfPDF = name.length==0?"myPDF":name; 
      saveAs(pdfBLOB, nameOfPDF);
      setpfile([]);
    } catch (error) {
      console.log("error in converting", error);
    }
  };

  // const downloadPDF = (images) => {
  //   let currProgress = 0;
  //   const interval = setInterval(() => {
  //     currProgress += 0;
  //     if (currProgress > 100) {
  //       clearInterval(interval);
  //       generatePDF(images);
  //       setProgress(0);
  //     } else {
  //       setProgress(currProgress);
  //     }
  //   }, 300);
  // };
  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <div className="wrapper">
        <h1>Image to PDF</h1>
        <div className={isDragActive && pfile?"dndA":"dnd"} {...getRootProps()}>
          <input id="props" {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here</p>
          ) : (
            <p>Drag 'n' drop  or Click to select Images</p>
          )}
        </div>
        {pfile.length >0 ? (
          <>
          <input className="name" placeholder="Enter your pdf name" 
          value={name} onChange={handleInputChange}></input>
          <button onClick={generatePDF}>Download pdf</button>
          </>
        ) : null}
      </div>
    </>
  );
}

export default App;
