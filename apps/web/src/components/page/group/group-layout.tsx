import '@web/assets/style/main/group/group.scss'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

interface GroupLayoutProp extends PropsWithChildren {
    groupIdList? : string[]
}

const GroupLayout = (prop: GroupLayoutProp) => {
    return (
        <div className="cp-group cp-layout">
            <div className='cp-page-header'>
                <div className='cp-page-tree'>
                    <Link href={'/group'}>/</Link>
                    {
                        (prop.groupIdList ?? []).map(id => (
                            <Link href={`/group/${id}`}>{id}</Link>
                        ))
                    }
                    
                </div>
                <span className='cp-title'>Group</span>
                <span>{(prop.groupIdList ?? []).join('/')}</span>
            </div>
            {prop.children}
        </div>
    )
}

export default GroupLayout;