// utils/imageUpload.js
export const checkImage = (files, currentImagesCount = 0) => {
  let err = "";
  if (!files || files.length === 0) return err = "No files selected.";

  const maxImages = 2;
  if (files.length > maxImages) {
    err = `Solo puedes subir máximo ${maxImages} imágenes.`;
    return err;
  }

  if (currentImagesCount + files.length > maxImages) {
    err = `Máximo ${maxImages} imágenes permitidas por post.`;
    return err;
  }

  const allowedExtensions = ['jpeg', 'jpg', 'png', 'webp'];
  const blockedExtensions = ['txt', 'pdf', 'doc', 'exe'];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      err = "Cada imagen debe ser menor a 2MB.";
      return err;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      err = "Formatos permitidos: JPG, PNG, WebP.";
      return err;
    }

    if (blockedExtensions.includes(fileExtension)) {
      err = "Tipo de archivo no permitido.";
      return err;
    }
  }

  return err;
};

// ✅ NUEVA FUNCIÓN: Validar video
 
// Función existente para imágenes
export const imageUpload = async (images) => {
  console.log('🟡 INICIANDO imageUpload - Total imágenes:', images?.length || 0);

  let imgArr = [];
  let uploadedCount = 0;

  for(const [index, item] of images.entries()){ 
      console.log(`\n🔄 Procesando imagen ${index + 1}:`, item);

      if (item.url && item.url.startsWith('blob:') && !item.isExisting) {
          console.log('🔄 Convirtiendo blob URL a archivo...');
          
          try {
              const response = await fetch(item.url);
              if (!response.ok) throw new Error('No se pudo acceder al blob');
              
              const blob = await response.blob();
              const file = new File([blob], item.name || `image-${Date.now()}.jpg`, { 
                  type: blob.type || 'image/jpeg' 
              });

              console.log('📁 Blob convertido a File:', file.name, `${(file.size / 1024).toFixed(2)} KB`);

              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "vetementsdjamel");
              formData.append("cloud_name", "dfjipgj2o");

              console.log('🌐 Enviando a Cloudinary...');
              
              const res = await fetch("https://api.cloudinary.com/v1_1/dfjipgj2o/image/upload", {
                  method: "POST",
                  body: formData
              });

              if (!res.ok) {
                  const errorText = await res.text();
                  throw new Error(`Cloudinary error: ${res.status} - ${errorText}`);
              }

              const data = await res.json();
              
              console.log('✅ UPLOAD EXITOSO a Cloudinary:', {
                  public_id: data.public_id,
                  url: data.secure_url,
                  formato: data.format
              });

              imgArr.push({
                  public_id: data.public_id, 
                  url: data.secure_url
              });
              uploadedCount++;

          } catch (error) {
              console.error(`❌ ERROR procesando imagen ${index + 1}:`, error.message);
              continue;
          }
      }
      else if (item.isExisting && item.url && item.url.includes('cloudinary.com')) {
          console.log('✅ Imagen ya en Cloudinary:', item.public_id);
          imgArr.push({
              public_id: item.public_id,
              url: item.url
          });
          uploadedCount++;
      }
      else {
          console.warn('⚠️ Imagen no procesable, saltando:', item);
      }
  }

  console.log('\n📊 RESUMEN FINAL:');
  console.log('✅ Subidas a Cloudinary:', uploadedCount);
  console.log('📦 Array resultante:', imgArr);
  
  return imgArr;
};


export const videoUpload = async (file, onProgress) => {
  console.log('🟡 INICIANDO videoUpload');
  console.log('📁 Archivo:', file.name, `${(file.size / 1024 / 1024).toFixed(2)} MB`);
  
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vetementsdjamel");
    formData.append("cloud_name", "dfjipgj2o");
    formData.append("resource_type", "video");
    
    console.log('🌐 Enviando video a Cloudinary...');
    
    // Usar fetch con XMLHttpRequest para progreso
    const xhr = new XMLHttpRequest();
    
    // Promesa para manejar la subida
    const uploadPromise = new Promise((resolve, reject) => {
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dfjipgj2o/video/upload');
      
      // Progreso
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentCompleted = Math.round((e.loaded * 100) / e.total);
          onProgress(percentCompleted);
        }
      });
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          console.log('✅ UPLOAD EXITOSO:', data.public_id);
          resolve(data);
        } else {
          reject(new Error(`Cloudinary error: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
    
    const result = await uploadPromise;
    
    // Generar miniatura desde Cloudinary (usando el video ID)
    const thumbnailUrl = result.secure_url.replace(/\.[^/.]+$/, '.jpg');
    
    return {
      public_id: result.public_id,
      url: result.secure_url,
      thumbnail: thumbnailUrl,
      duration: result.duration || 0,
      format: result.format
    };
    
  } catch (error) {
    console.error('❌ ERROR subiendo video:', error.message);
    throw error;
  }
};

// Validar video
export const checkVideo = (file, isPro = false) => {
  let err = "";
  if (!file) return "No file selected.";

  const maxDuration = isPro ? 100 : 100;
  const maxSize = isPro ? 100 * 1024 * 1024 : 100 * 1024 * 1024;
  const allowedFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  
  if (!allowedFormats.includes(file.type)) {
    err = "Formatos permitidos: MP4, MOV, AVI, WEBM.";
    return err;
  }
  
  if (file.size > maxSize) {
    err = `El video debe ser menor a ${maxSize / (1024 * 1024)}MB.`;
    return err;
  }
  
  return err;
};