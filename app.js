function handleImageUpload(files) {
  [...files].forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          blob => {
            const url = URL.createObjectURL(blob);
            // Show download button for converted WebP
          },
          'image/webp',
          0.8 // Quality setting
        );
      };
    };
    reader.readAsDataURL(file);
  });
}
