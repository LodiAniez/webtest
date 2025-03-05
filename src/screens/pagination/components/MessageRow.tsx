import Colors from '@/common/colors'
import Images from '@/common/images'
import useGetTimePassed from '@/hooks/useGetTimePassed'
import { useAuth } from '@/services/context/AuthContext'
import { MessageType } from '@/types'
import { TSDate } from '@/utils/variables'
import React, { useMemo } from 'react'
type Props = {
    message: MessageType
}
const MessageRow = (props: Props) => {
    const {
        message,
    } = props;
    const { Auth } = useAuth();

    const isAuthor = useMemo(() => message.authorId === Auth?.uid, [message, Auth]);

    if (isAuthor) return <MessageFromUser message={message} />
    return <MessageFromOthers message={message} />

}

const MessageFromUser = (props: Props) => {
    const {
        message,
    } = props;
    const { Auth } = useAuth();
    const timePassed = useGetTimePassed(message.createdAt);
    return (
        <div className='w-100p row justify-content-end'>

            <div className="row align-items-end gap-5px w-fit-content">
                <div className="col align-items-end">
                    <div
                        style={{
                            background: Colors["billing"]
                        }}
                        className="br-5px pv-3px ph-10px">
                        {message.message}
                    </div>
                    <span style={{ fontSize: 10 }}>{timePassed}</span>
                </div>
                <img
                    src={Auth?.photoURL ? Auth?.photoURL : Images["ic_user_fill"]}
                    className='h-20px w-20px br-50px' />
            </div>
        </div>
    )
}
const MessageFromOthers = (props: Props) => {
    const {
        message,
    } = props;
    const timePassed = useGetTimePassed(message.createdAt);
    return (
        <div className='w-100p row justify-content-start'>
            <div className="row align-items-end gap-5px w-fit-content">
                <img
                    style={{
                        background: Colors.white
                    }}
                    src={Images["ic_user_fill"]}
                    className='h-20px w-20px br-50px' />
                <div className="col align-items-start">
                    <div
                        style={{
                            background: "#edfbea",
                            color: Colors.black500,
                        }}
                        className="br-5px pv-3px ph-10px">
                        {message.message}
                    </div>
                    <span style={{ fontSize: 10 }}>{timePassed}</span>
                </div>
            </div>
        </div>
    )
}

export default MessageRow