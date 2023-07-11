'use client'
import { client } from "@gradio/client";
import React from "react";
import Image from 'next/image'
import { useState } from 'react';
import styles from "./page.module.css"


// Changed next.config.js a lot for the client side and server side stuff
// Used Gradio and hugging face to create the model then using it as a API
// used Blob and FileReader in order to fetch an image and display it from user


function Home() {
  
  const [data, setData] = useState()
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [loading, setLoading] = useState(false)

  async function run(e) {
    e.preventDefault()

    setLoading(true)
    const file = e.target.files[0]
    const blob = new Blob([file],  { type: file.type })
    setFile(file);

    const app = await client("https://saadshahrour-classify.hf.space/");
    const result = await app.predict("/predict", [
          blob, 	// blob in 'img' Image component
    ]);

    setData(result.data)
    console.log(result.data);
    
    
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const { result } = e.target;
      if (result) {
        setFileDataURL(result)
      }
    }
    fileReader.readAsDataURL(file);

    setLoading(false)
  }

  return ( 
    <div className={styles.container}>
      <div>
        <input type="file" onChange={async(e) => run(e)} accept='.png, .jpg, .jpeg' value=''/>
      </div>
      <div>
        {loading && "loading..."}
        {(data && !loading) && <img src={fileDataURL} width={150} height={150} />}
        {(data && !loading) && <h3>The image you uploaded is for a {data[0].label} </h3>}
      </div>
    </div>
  )
}

export default Home;