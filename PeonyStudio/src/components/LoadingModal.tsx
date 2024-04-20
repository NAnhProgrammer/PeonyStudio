import { ActivityIndicator, Dimensions, Modal ,View} from 'react-native';
import React from 'react'
import Color from '../Color';

const { width, height } = Dimensions.get('window')

interface props {
    visible: boolean,
}

const LoadingModal: React.FC<props> = ({ visible }) => {

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
        >
            <View style={{
                flex: 1,
                backgroundColor: Color.whiteOpacity30,
                width,
                height,
                justifyContent: 'center',
                padding: 20
            }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' color={Color.deepPink} />
                </View>
            </View>
        </Modal>
    )
}

export default LoadingModal

