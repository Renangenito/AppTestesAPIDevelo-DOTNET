
export default async function uploadImage (e){
    const base64 = await convertBase64(e);
    return base64;
  };
  
const convertBase64 = (file) => {
return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
    resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
    reject(error);
    };
});
};