import { Modal } from 'react-native';
import React from 'react'

interface props {
    children: React.ReactNode,
    visible: boolean,
}

const NotifyModal: React.FC<props> = ({ children, visible }) => {

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

export default NotifyModal

