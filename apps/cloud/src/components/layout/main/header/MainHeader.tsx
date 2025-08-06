import { ChangeLocaleButton } from "./ChangeLocaleButton"
import { MoveHomeButton } from "./MoveHomeButton"
import { SignOutButton } from "./SignOutButton"

export const MainHeader = () => {
    return (
        <header>
            <div className='cp-header-box'>
                <div className="cp-split-box">
                    
                </div>
                <div className="cp-split-box">
                    <MoveHomeButton />
                    <ChangeLocaleButton />
                    <SignOutButton />
                </div>
            </div>

        </header>
    )
}