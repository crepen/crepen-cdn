interface TextHrProp {
    text? : string
}

export const TextHr = (prop : TextHrProp) => {
    return (
        <div className='cp-text-hr' >
            {prop.text}
        </div>
    )
}