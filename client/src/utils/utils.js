export function buildImgUrl(imgName) {
    const url = process.env.PUBLIC_URL + '/images/' + imgName
    console.log("Image URL:", url);
    return url;
}