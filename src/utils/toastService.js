import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = (message, type = "success", position = "top-center") => {
    const validTypes = ["success", "error", "info", "warn", "dark"];

    if (!validTypes.includes(type)) {
        // console.error(`Invalid toast type: ${type}. Defaulting to "success".`);
        type = "success";
    }

    toast[type](message, {
        position,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

export default showToast;
