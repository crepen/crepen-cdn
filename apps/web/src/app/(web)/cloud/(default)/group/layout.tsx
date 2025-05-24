import '@web/assets/style/cloud/page/group/cloud.group.scss';

import { DefaultSidePageLayout } from '@web/components/layout/common/default-layout';
import { PropsWithChildren } from 'react';

interface GroupGlobalLayoutRouterProp extends PropsWithChildren {

}

const GroupGlobalLayoutRouter = (prop: GroupGlobalLayoutRouterProp) => {
    return (
        <DefaultSidePageLayout>
            {prop.children}
        </DefaultSidePageLayout>
    )
}

export default GroupGlobalLayoutRouter;