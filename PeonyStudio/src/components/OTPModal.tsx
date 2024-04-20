import { Modal } from 'react-native';
import React from 'react'

interface props {
    children: React.ReactNode,
    visible: boolean,
}

const OTPModal: React.FC<props> = ({ children, visible }) => {

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={visible}
        >
            {children}
        </Modal>
    )
}

export default OTPModal

