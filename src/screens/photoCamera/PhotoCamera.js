import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import PhotoCamera from '@componentsCommon/photoCamera/PhotoCamera'

class PhotoCameraScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Chụp ảnh',
        tabBarVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {
            imageType: this.props.navigation.getParam('imageType', 0)
        }
    }

    onTakePhoto = (base64) => {
        //console.log({ base64 })
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onTakePhoto({
            imageType: this.state.imageType,
            imageBase64: base64,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <PhotoCamera
                    onTakePhoto={this.onTakePhoto}
                />
            </View>
        );
    }
}

export default PhotoCameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: '#000',
    },
});
