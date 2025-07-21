import { DashboardPageLayout } from "@web/components-v2/page/dashboard/layout/DashboardPageLayout";
import { CrepenUserOperationService } from "@web/services/operation/user.operation.service";


const CloudMainRoutePage = async () => {

    const userData = await CrepenUserOperationService.getLoginUserData();

    
    return (
        <DashboardPageLayout />
    )
}



export default CloudMainRoutePage;