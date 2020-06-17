
import React, { Fragment, Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    Button,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from '@componentsCommon/modal/ModalCenterAlert';

class ImagePickerScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Chụp ảnh',
        tabBarVisible: false,
    }

    constructor(props) {
        super(props)
        this.state = {
            filepath: {
                data: '',
                uri: ''
            },
            fileData: '',
            fileUri: '',
            isLoading: false,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    onTakePhoto = (base64) => {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onTakePhoto({
            imageBase64: base64,
        });
    }

    chooseImage = () => {
        let options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            this.asyncModalLoadingEnable()
            setTimeout(() => {
                if (response.didCancel) {
                    // console.log('User cancelled image picker');
                    this.asyncModalLoading()
                } else if (response.error) {
                    //console.log('ImagePicker Error: ', response.error);
                    this.asyncModalLoading()
                } else if (response.customButton) {
                    //console.log('User tapped custom button: ', response.customButton);
                    this.asyncModalLoading()
                    Alert.alert(response.customButton);
                } else {
                    const getImageAspectRatio = response.height / response.width;
                    const reSizerWidth = getImageAspectRatio >= 1 ? 260 : 280;
                    ImageResizer.createResizedImage(response.uri, reSizerWidth, 280, 'JPEG', 65).then((response) => {
                        ImgToBase64.getBase64String(response.uri)
                            .then((base64String) => {
                                this.asyncModalLoading()
                                this.setState({
                                    fileData: base64String,
                                    fileUri: response.uri
                                });
                            })
                            .catch((err) => {
                                this.asyncModalLoading()
                                //console.log(err);
                                return Alert.alert(
                                    err,
                                );
                            });
                    }).catch((err) => {
                        //console.log(err);
                        this.asyncModalLoading()
                    });
                }
            }, 500);

        });
    }

    launchCamera = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchCamera(options, (response) => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                //console.log('User cancelled image picker');
            } else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                //console.log('User tapped custom button: ', response.customButton);
                Alert.alert(response.customButton);
            } else {
                const getImageAspectRatio = response.height / response.width;
                const reSizerWidth = getImageAspectRatio >= 1 ? 260 : 280;
                ImageResizer.createResizedImage(response.uri, reSizerWidth, 280, 'JPEG', 65).then((response) => {
                    ImgToBase64.getBase64String(response.uri)
                        .then((base64String) => {
                            this.setState({
                                fileData: base64String,
                                fileUri: response.uri
                            });
                        })
                        .catch((err) => {
                            //console.log(err);
                            return Alert.alert(
                                err,
                            );
                        });
                }).catch((err) => {
                    //console.log(err);
                });
            }
        });

    }

    renderFileData = () => {
        const { fileData } = this.state
        if (fileData) {
            return <Image source={{ uri: 'data:image/jpeg;base64,' + fileData }}
                style={styles.images}
            />
        } else {
            return <Image source={require('@assets/img/choose-image.png')}
                style={styles.images}
            />
        }
    }

    onConfirmImage = () => {
        const { fileData } = this.state
        const { navigation } = this.props;
        if (fileData.length > 0 && fileData.length < 32767) {
            navigation.goBack();
            navigation.state.params.onTakePhoto({
                imageBase64: fileData,
            });
        } else {
            this.asyncModalLoading()
            let typeModalAlert = ''
            let titleModalAlert = ''
            let contentModalAlert = ''

            if (fileData.length <= 0) {
                typeModalAlert = 'warning'
                titleModalAlert = 'Cập nhật ảnh đại diện'
                contentModalAlert = 'Vui lòng chọn/chụp ảnh'
            }
            else if (fileData.length >= 32767) {
                typeModalAlert = 'error'
                titleModalAlert = 'Cập nhật ảnh đại diện'
                contentModalAlert = 'Ảnh quá lớn. Vui lòng chọn ảnh khác'
            }
            setTimeout(() => {
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: typeModalAlert,
                    titleModalAlert: titleModalAlert,
                    contentModalAlert: contentModalAlert
                })
            }, 100);
        }
    }

    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true });
    }

    asyncModalLoading = () => {
        this.setState({ isLoading: false });
    }

    onCloseModalAlert = () => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { isLoading, isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert } = this.state
        return (
            <Fragment>
                <View styles={styles.scrollView}>
                    <ModalCenterAlert
                        isCancel={true}
                        isOK={true}
                        isVisible={isModalAlert}
                        typeModal={typeModalAlert}
                        titleModal={titleModalAlert}
                        contentModal={contentModalAlert}
                        onCloseModalAlert={this.onCloseModalAlert}
                    />
                    <View>
                        <ModalLoading
                            isVisible={isLoading}
                        />
                    </View>
                    <View style={styles.body}>
                        <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }} >
                            Pick Image from Camera & Gallery
                        </Text>
                        <View style={styles.ImageSections}>
                            <TouchableOpacity onPress={this.chooseImage} >
                                <View>
                                    {this.renderFileData()}
                                    {/* <Text style={{ textAlign: 'center', color: 'red' }}>
                                        {fileData.length <= 0 ? 'Vui lòng chọn ảnh' : ''}
                                    </Text> */}
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={styles.btnParentSection}>
                            <TouchableOpacity onPress={this.chooseImage} style={styles.btnSection}  >
                                <Text style={styles.btnText}>Chọn ảnh/Chụp ảnh</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    <ButtonBottomComponent
                        title="Xác nhận"
                        onPress={this.onConfirmImage}
                    />
                </View>
            </Fragment>
        );
    }
}

export default ImagePickerScreen;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#e8eaec',
        justifyContent: 'center',
        alignItems: 'baseline'
    },
    body: {
        backgroundColor: 'white',
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.7,
        width: Dimensions.get('screen').width
    },
    ImageSections: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 8,
        justifyContent: 'center'
    },
    images: {
        width: 300,
        height: 300,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3
    },
    btnParentSection: {
        alignItems: 'center',
        marginTop: 10
    },
    btnSection: {
        width: 225,
        height: 50,
        backgroundColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        marginBottom: 10
    },
    btnText: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 14,
        fontWeight: 'bold'
    }
});