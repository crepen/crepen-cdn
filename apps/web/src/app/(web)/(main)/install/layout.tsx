import { SystemInstallLayout } from "@web/components-v2/page/install/layout/SystemInstallLayout";
import { PropsWithChildren } from "react"

const InstallLayoutRouter = (prop : PropsWithChildren) =>
    <SystemInstallLayout>{prop.children}</SystemInstallLayout>

export default InstallLayoutRouter;