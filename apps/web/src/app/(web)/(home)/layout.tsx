import {PropsWithChildren} from 'react'

interface HomePageLayoutRouterProp extends PropsWithChildren{

}

const HomePageLayoutRouter = (prop : HomePageLayoutRouterProp) => {
    return prop.children
}

export default HomePageLayoutRouter;