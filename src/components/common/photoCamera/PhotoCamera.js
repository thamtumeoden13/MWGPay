import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';

class PhotoCamera extends React.PureComponent {
    state = {
        type: RNCamera.Constants.Type.back,
    };

    flipCamera = () => {
       // console.log("this.state.type", this.state.type)
        this.setState({
            type:
                this.state.type === RNCamera.Constants.Type.back
                    ? RNCamera.Constants.Type.front
                    : RNCamera.Constants.Type.back,
        });
    }

    takePhoto = async () => {
        const options = {
            quality: 0.5,
            base64: true,
            doNotSave: true,
            width: 300,
            height: 300,
        };
        const data = await this.camera.takePictureAsync(options);
        if (this.props.onTakePhoto)
            this.props.onTakePhoto(data.base64);
    };
    render() {
        const { type } = this.state;
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={cam => {
                        this.camera = cam;
                    }}
                    type={type}
                    style={styles.preview}
                />
                <View style={styles.bottomButtons}>
                    <TouchableOpacity onPress={this.takePhoto} style={styles.recordingButton}>
                        {/* <Icon name="camera" size={50} color="orange" /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.takePhoto} style={styles.recordingButton}>
                        <Icon name="camera" size={50} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.flipCamera} style={styles.flipButton}>
                        <Icon name="refresh" size={35} color="orange" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default PhotoCamera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    topButtons: {
        flex: 1,
        width: Dimensions.get('window').width,
        alignItems: 'flex-start',
        marginVertical: 20,
    },
    bottomButtons: {
        height: 100,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    flipButton: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'flex-end',
        marginRight: 20,
        marginVertical: 20,
    },
    recordingButton: {
        flex: 1,
        flexDirection: "column",
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
