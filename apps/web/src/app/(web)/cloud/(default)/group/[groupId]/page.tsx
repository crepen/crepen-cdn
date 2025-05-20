
interface GroupItemPageProp {
    params: Promise<{ id: string[] }>
}

const GroupItemPageRouter = async (prop: GroupItemPageProp) => {

    // console.log('PROP', (await prop.params).id);

    return (
        <div>
            {
                (await (prop.params)).id.map(item => (
                    <div key={item}>
                        {item}
                    </div>
                ))
            }
        </div>
    )
}

export default GroupItemPageRouter;