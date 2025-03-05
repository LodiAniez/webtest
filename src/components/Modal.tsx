import React, { useState } from 'react'
import styles from "./Modal.module.css"
import { SetStateType } from '@/types'
import useKeyListener from '@/hooks/useKeyListener'

type Props = {
    setIsVisible: ((value: boolean) => void) | SetStateType<boolean> | ((value: any) => void),
    component: React.ReactNode
    centerClassName?: string
    centerStyle?: React.CSSProperties
    containerClassName?: string
    containerStyle?: React.CSSProperties
    backgroundClassName?: string
    backgroundStyle?: React.CSSProperties
}
const Modal = (props: Props) => {
    const {
        setIsVisible,
        component,
        containerClassName,
        containerStyle,
        centerClassName,
        centerStyle,
        backgroundClassName,
        backgroundStyle,
    } = props;

    useKeyListener({
        key: "Escape",
        callback: () => setIsVisible(false)
    })
    return (
        <React.Fragment>
            <div className={`${styles.darkBackground} ${backgroundClassName}`} style={backgroundStyle} onClick={() => setIsVisible(false)} />
            <div className={[styles.centered, centerClassName].join(" ")} style={centerStyle}>
                <div className={[styles.modal, containerClassName].join(" ")} style={containerStyle}>
                    {component}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Modal