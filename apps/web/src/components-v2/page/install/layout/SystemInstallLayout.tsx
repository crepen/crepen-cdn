import './SystemInstallLayout.scss'
import { PropsWithChildren } from "react"

interface SystemInstallLayoutProp extends PropsWithChildren{

}

export const SystemInstallLayout = (prop : SystemInstallLayoutProp) => {
    return (
        <div className="cp-system-install-layout cp-root-layout">
            {prop.children}
        </div>
    )
}