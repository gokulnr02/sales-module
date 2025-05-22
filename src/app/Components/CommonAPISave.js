export default async function CommonAPISave({ url, params }) {
    try {
        const defaultParams = {
            createdby: "Admin",
            createdtime: await getCurrentDateTime(),
            activeby: "Admin",

        }
        const payload = {"data":{...params,...defaultParams}}
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        }
        return fetch(url, options).then((res) => {
            return res.json()
        }).then((res) => {
            return res
        })
    } catch (err) {
        return []
        console.log(err.message, 'Error message from API CALL')
    }
}

const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

