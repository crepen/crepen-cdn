import GroupLayout from '@web/components/page/group/group-layout';
import { PropsWithChildren } from 'react'

interface GroupLayoutProp extends PropsWithChildren {
    params: Promise<{ id: string[] }>
}

const GroupItemLayoutRouter = async (prop: GroupLayoutProp) => {

    const idList = (await prop.params).id;

    // console.log("SHIT")

    return (
        <GroupLayout
            groupIdList={idList}
        >
            {prop.children}
        </GroupLayout>
    )
}

export default GroupItemLayoutRouter;