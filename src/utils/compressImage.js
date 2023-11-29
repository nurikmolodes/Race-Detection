export const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxWidth = 800; // Set your desired maximum width
          const maxHeight = 600; // Set your desired maximum height
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            },
            "image/jpeg",
            0.8,
          ); // Adjust the quality as needed (0.8 means 80% quality)
        };
      };
  
      reader.readAsDataURL(file);
    });
  };