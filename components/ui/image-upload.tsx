'use client'

import { useEffect, useState } from "react";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value:string) => void;
  onRemove: (value:string) => void;
  value:string [];
}


const ImageUpload:React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  // state = isMounted, useEffect to set state when opened, validation to maintain consistency: THIS FIXES HYDRATION ERRORS
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  },[]);

  if(!isMounted) {
    return null;
  }


  return (
    <div>Image Upload</div>
  )

}

export default ImageUpload;