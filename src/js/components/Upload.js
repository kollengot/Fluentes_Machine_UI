import React, { useRef } from "react";
import S3 from "react-aws-s3";

function Upload() {
    const fileInput = useRef();
    const handleClick = (event) => {
        debugger;
        event.preventDefault();
        let file = fileInput.current.files[0];
        let newFileName = fileInput.current.files[0].name.replace(/\..+$/, "");
        const config = {
            bucketName: 'myBucket',
            dirName: 'media', /* optional */
            region: 'eu-west-1',
            accessKeyId: 'JAJHAFJFHJDFJSDHFSDHFJKDSF',
            secretAccessKey: 'jhsdf99845fd98qwed42ebdyeqwd-3r98f373f=qwrq3rfr3rf',
            s3Url: 'https:/your-custom-s3-url.com/', /* optional */
        };
        const ReactS3Client = new S3(config);
        ReactS3Client.uploadFile(file, newFileName).then((data) => {
            console.log(data);
            if (data.status === 204) {
                console.log("success");
            } else {
                console.log("fail");
            }
        });
    };
    return (
        <>
            <form className='upload-steps' onSubmit={handleClick}>
                <label>
                    Upload file:
          <input type='file' ref={fileInput} />
                </label>
                <br />
                <button type='submit'>Upload</button>
            </form>
        </>
    );
}

export default Upload;
