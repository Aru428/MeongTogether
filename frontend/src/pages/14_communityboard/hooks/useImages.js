// useImages.js
import { useState, useEffect } from "react";

const imageFiles = [
  "c_pic (1).png",
  "c_pic (2).png",
  "c_pic (3).png",
  "c_pic (4).png",
  "c_pic (5).png",
  "c_pic (6).png",
  "c_pic (7).png",
  "c_pic (8).png",
];

export function useImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    Promise.all(imageFiles.map((file) => import(`../c_pic_f/${file}`))).then(
      (images) => setImages(images.map((image) => image.default))
    );
  }, []);

  return images;
}
