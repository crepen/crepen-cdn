import '@web/assets/style/cloud/page/group/cloud.group.scss';

import { DefaultSidePageLayout } from '@web/components/layout/common/default-layout';
import { PropsWithChildren } from 'react';

interface GroupGlobalRouteLayoutProp extends PropsWithChildren {

}

const GroupGlobalRouteLayout = (prop: GroupGlobalRouteLayoutProp) => {
    return (
        <DefaultSidePageLayout>
            {prop.children}
        </DefaultSidePageLayout>
    )
}

export default GroupGlobalRouteLayout;