import { CrepenUserOperationService } from "@web/services/operation/user.operation.service";


const CloudMainRoutePage = async () => {

    const userData = await CrepenUserOperationService.getLoginUserData();

    return (
        <div className='cp-main-home'>
            Login User : {userData.data?.name}
        </div>
    )
}



export default CloudMainRoutePage;