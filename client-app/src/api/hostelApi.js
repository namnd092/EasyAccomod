import axiosClient from "./axiosClient";

const hostelApi = {
    get: (id) => {
        const url = `/hostel/${id}`;
        return axiosClient.get(url);
    }
}

export default hostelApi;