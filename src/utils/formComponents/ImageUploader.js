import React from 'react'
import { Uploader, Loader } from 'rsuite'
import AvatarIcon from '@rsuite/icons/legacy/Avatar'
function previewFile(file, callback) {
  const reader = new FileReader()
  reader.onloadend = () => {
    callback(reader.result)
  }
  reader.readAsDataURL(file)
}

const ImageUploader = (props) => {
  const [uploading, setUploading] = React.useState(false)
  const [fileInfo, setFileInfo] = React.useState(null)

  return (
    <Uploader
      {...props}
      fileListVisible={false}
      listType="picture"
      action="//jsonplaceholder.typicode.com/posts/"
      onUpload={(file) => {
        setUploading(true)
        previewFile(file.blobFile, (value) => {
          setFileInfo(value)
        })
      }}
      onSuccess={(response, file) => {
        setUploading(false)
        console.log(response)
      }}
      onError={() => {
        setFileInfo(null)
        setUploading(false)
      }}
    >
      <button style={{ width: 150, height: 150 }}>
        {uploading && <Loader backdrop center />}
        {fileInfo ? (
          <img src={fileInfo} width="100%" height="100%" />
        ) : (
          <AvatarIcon style={{ fontSize: 80 }} />
        )}
      </button>
    </Uploader>
  )
}
export default ImageUploader
