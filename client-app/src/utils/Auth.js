import authApi from '../api/authApi';
import { setUser } from '../redux/slice/userSlice';

const effectGetInfo = (func) => {
    if (localStorage.getItem('token')) {
        const getAccountInfo = async () => {
            try {
                const response = await authApi.getAccountInfoByToken()
                func(
                    setUser({
                        account_id: response.AccountId,
                        user_id: response.UserId,
                        role: response.Role,
                        name: response.Name,
                    })
                )
            } catch (error) {
                console.log(error)
            }
        }
        getAccountInfo()
    }
}

export default effectGetInfo;