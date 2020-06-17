import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    Alert,
} from 'react-native';
import { TextField } from 'react-native-material-textfield'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const PaymentCustomerInfo = (props) => {
    const [billID, setBillID] = useState('');
    const [errors, setErrors] = useState(props.errors ? props.errors : {})
    const { urlImg, dataItem, img_help } = props;
    const onchangeValue = (value) => {
        setBillID(value)
        if (props.onchangeValue) {
            props.onchangeValue(value)
        }
        setErrors({})
    }
    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    let issusImage = false;
    if (dataItem && dataItem.ServiceLogoURL != "") {
        issusImage = true;
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerTopItem}>
                <View style={styles.topImage}>
                    {dataItem && issusImage == true ?
                        <ImageBackground
                            resizeMode="contain"
                            source={{
                                uri: urlImg,
                            }}
                            style={{ width: 100, height: 70, paddingLeft: 10, }}
                        />
                        :
                        <Icon
                            size={dataItem.size}
                            name={dataItem.icon}
                            type={dataItem.type}
                            color={dataItem.color}
                            containerStyle={{ width: 100, paddingLeft: 10, }}
                        />
                    }

                </View>
                <View style={styles.topTitle}>
                    <Text style={{ fontSize: 16, fontWeight: '300' }}>
                        {dataItem.ServiceName}
                    </Text>
                </View>
            </View>
            <KeyboardAwareScrollView>
                <View style={styles.containerDetail}>
                    <View style={styles.textInput}>
                        <TextField
                            label='Nhập mã khách hàng'
                            inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, marginVertical: 10 }}
                            value={billID}
                            onChangeText={(value) => onchangeValue(value)}
                            clearButtonMode="always"
                            containerStyle={{ width: '100%', }}
                            labelTextStyle={{ paddingLeft: 5, }}
                            keyboardType='default'
                            autoFocus={true}
                            error={errors.value}
                        />
                    </View>
                    <View style={styles.label}>
                        <Text style={{ fontSize: 18, fontWeight: '400' }}>HƯỚNG DẪN XEM MÃ KHÁCH HÀNG</Text>
                    </View>
                    <View style={styles.imageHelp}>
                        <ImageBackground
                            source={img_help}
                            resizeMode='contain'
                            style={{ width: '100%', height: 150, alignItems: 'center' }}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

export default PaymentCustomerInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
    containerTopItem: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 20,
        marginHorizontal: 10,
    },
    containerDetail: {
        flex: 1,
        flexDirection: 'column',
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    topImage: {
        width: 70,
        height: 70,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    topTitle: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        width: Math.floor(Dimensions.get('screen').width - 100),
    },
    textInput: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10
    },
    label: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
    },
    imageHelp: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        paddingBottom: 20,
        alignItems: 'center',
        marginVertical: 10
    }
});