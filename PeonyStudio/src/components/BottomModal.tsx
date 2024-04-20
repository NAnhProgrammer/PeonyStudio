import { Modal } from 'react-native';
import React from 'react'

interface props{
    children: React.ReactNode,
    visible: boolean,
    onClose: () => void
}

const BottomModal:React.FC<props> = ({children, visible,onClose}) => {

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
         {children}
        </Modal>
    )
}

export default BottomModal

