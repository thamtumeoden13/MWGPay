import React, { Component, useState, useEffect } from 'react'
import { Alert, View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';

export const ImageList = (props) => {

    const [listImage, setListImage] = useState([])
    const [note, setNote] = useState('')
    const selectPhotoTapped = () => {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            },
        };
        console.log("selectPhotoTapped")
        ImagePicker.showImagePicker(options, response => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const getImageAspectRatio = response.height / response.width;
                const reSizerWidth = getImageAspectRatio >= 1 ? 260 : 280;
                // ImageResizer.createResizedImage(response.uri, reSizerWidth, 280, 'JPEG', 65).then((response) => {
                ImgToBase64.getBase64String(response.uri)
                    .then((base64String) => {
                        const element = {
                            uri: response.uri,
                            base64String: base64String,
                            date: `${new Date().getHours()} : ${new Date().getMinutes()}`,
                            description: ''
                        }
                        let listElement = listImage.slice()
                        listElement.push(element)
                        setListImage(listElement)
                    })
                    .catch((err) => {
                        //console.log(err);
                        return Alert.alert(
                            err,
                        );
                    });
                // }).catch((err) => {
                //     console.log(err);
                // });
            }
        });
    }

    const onChangeDescriptionImage = (value, item, index) => {
        const element = Object.assign({}, item, { "description": value })
        const listElement = Object.assign([], listImage, { [index]: element })
        setListImage(listElement)
    }

    const onRemoveImage = (index) => {
        const listElement = listImage.filter((e, i) => { return i != index })
        console.log({ listElement })
        setListImage(listElement)
    }

    useEffect(() => {
        if (props.listImage) {
            setListImage(props.listImage)
        }
    }, [props.listImage])

    return (
        <View style={styles.containerData}>
            <Text style={{ fontSize: 24, color: 'gray', left: 10 }}>{`Chụp ảnh - `} {props.nextShipmentOrderStepName}</Text>
            {(listImage && listImage.length > 0) ?
                listImage.map((item, index) => (
                    <View style={styles.containerItem}>
                        <ImageBackground style={{ width: 64, height: 64, justifyContent: 'center', alignContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                            resizeMode='contain'
                            source={item.uri ? { uri: item.uri } : require('@assets/bg/loading.gif')}
                        ></ImageBackground>
                        <View style={{
                            width: 80,
                            height: 56,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginHorizontal: 4
                        }}>
                            <Text style={{ fontSize: 16, color: 'gray', }} >Giờ chụp</Text>
                            <Text style={{ fontSize: 16, color: '#000' }} >{item.date}</Text>
                        </View>
                        <View style={{
                            width: 160,
                            height: 56,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginHorizontal: 4
                        }}>
                            <Text style={{ fontSize: 16, color: 'gray', marginLeft: 4 }} >Ghi chú ảnh</Text>
                            <Input
                                placeholder='...'
                                containerStyle={{ width: 160, }}
                                inputStyle={{ fontSize: 14, textAlign: 'left', fontWeight: '400' }}
                                value={item.description}
                                onChangeText={value => onChangeDescriptionImage(value, item, index)}
                            />
                        </View>
                        <Icon name='close' type='font-awesome' color='#f00' size={30}
                            containerStyle={{
                                justifyContent: 'center',
                            }}
                            onPress={() => onRemoveImage(index)}
                            activeOpacity={0.7}
                        />
                    </View>
                ))
                :
                <View style={styles.containerEmpty}>
                    <Text style={{ fontSize: 24, color: 'gray', left: 10 }}>Thêm ảnh đơn hàng</Text>
                </View>
            }
            <Input
                onChangeText={(value) => setNote(value)}
                value={note}
                inputStyle={{ marginLeft: 10, color: '#000', fontSize: 16 }}
                keyboardAppearance="light"
                placeholder={"Ghi chú bước xử lý"}
                autoCapitalize="none"
                // maxLength={10}
                autoCorrect={true}
                // keyboardType="number-pad"
                blurOnSubmit={true}
                placeholderTextColor="gray"
                errorStyle={{ textAlign: 'left' }}
            // errorMessage={errors.note}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <ButtonBottomComponent
                    title="Thêm ảnh"
                    onPress={selectPhotoTapped}
                    containerButtonGroup={styles.addImage}
                    buttonStyle={styles.addImageStyle}
                    disabled={!!(listImage.length >= 5)}
                />
                <ButtonBottomComponent
                    title="Xác nhận"
                    onPress={() => props.uploadImage(listImage, note)}
                    containerButtonGroup={styles.uploadImage}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    uploadImage: {
        height: 48,
        width: '45%',
        justifyContent: "center",
        alignItems: 'center',
    },
    addImage: {
        height: 48,
        width: '45%',
        justifyContent: "center",
        alignItems: 'center',
    },
    addImageStyle: {
        backgroundColor: '#0f0'
    },
    containerData: {
        minHeight: 128, width: '100%',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        paddingVertical: 10
    },
    containerItem: {
        height: 64,
        width: "100%", flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10
    },
    containerEmpty: {
        height: 80,
        width: '100%',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});