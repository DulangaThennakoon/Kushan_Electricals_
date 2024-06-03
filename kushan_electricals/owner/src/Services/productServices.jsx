import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getBarcodes = async () => {
    try {
        const res = await axios({
            method: "get",
            url: "http://localhost:5000/api/owner/productServices/getBarcodes",
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error("Error fetching existing barcodes.", {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};

export { getBarcodes };
