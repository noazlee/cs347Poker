export function buildImgUrl(imgName) {
    const url = process.env.PUBLIC_URL + '/images/' + imgName
    return url;
}