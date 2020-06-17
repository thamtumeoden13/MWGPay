import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressCircle from 'react-native-progress-circle'

const ProfileAccAuth = (props) => {
    const [preAccAuthRatio, setPreAccAuthRatio] = useState(0)
    console.log("preAccAuthRatio", props)
    const onPress = () => {
        if (props.onPreAccAuth)
            props.onPreAccAuth()
    }

    useEffect(() => {
        let ratioValue = 0;
        if (props.isVerifiedEmail) {
            ratioValue += 30
        }
        if (props.isUpdatedPersonalInfo) {
            ratioValue += 35
        }
        if (props.isVerifiedWalletAccount) {
            ratioValue += 35
        }
        setPreAccAuthRatio(ratioValue)
    }, [props.isVerifiedEmail, props.isUpdatedPersonalInfo, props.isVerifiedWalletAccount])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
            <View style={styles.containerSecurity}>
                <View style={styles.containerTop}>
                    <Text style={{ fontSize: 18, textAlign: "left" }}>
                        Thiết lập an toàn bảo mật ngay
                    </Text>
                </View>
                <View style={styles.containerMiddle}>

                    <View style={styles.containerMiddleLeft}>
                        {/* <View style={[styles.containerMiddleLeftCircle]}>
                            <Text style={{ color: 'black', fontSize: 20, color: 'green' }}>{preAccAuthRatio}%</Text>
                        </View> */}
                        <ProgressCircle
                            percent={preAccAuthRatio}
                            radius={30}
                            borderWidth={5}
                            color="#3399FF"
                            shadowColor="#999"
                            bgColor="#fff"
                        >
                            <Text style={{ fontSize: 16 }}>{preAccAuthRatio+'%'}</Text>
                        </ProgressCircle>
                       
                    </View>

                    <View style={styles.containerMiddleRight}>
                        <Text style={styles.containerMiddleRightText}>
                            Hoàn thành các bước sau để tăng độ an toàn bảo mật và giúp MWGPay cung cấp dịch vụ tốt hơn
                        </Text>
                    </View>
                </View>
                <View style={styles.containerBottom}>
                    <View style={styles.containerBottomLeft}>
                        {!props.isVerifiedWalletAccount &&
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Icon name="shield" type="material-community" size={18} color='gray' />
                                <Text style={{ fontSize: 12, textAlign: "left", paddingLeft: 5, color: 'gray' }}>
                                    Xác thực tài khoản
                                </Text>
                            </View>
                        }
                        {!props.isVerifiedEmail &&
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Icon name="shield" type="material-community" size={18} color='gray' />
                                <Text style={{ fontSize: 12, textAlign: "left", paddingLeft: 5, color: 'gray' }}>
                                    Xác thực địa chỉ email
                                </Text>
                            </View>
                        }
                        {!props.isUpdatedPersonalInfo &&
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Icon name="shield" type="material-community" size={18} color='gray' />
                                <Text style={{ fontSize: 12, textAlign: "left", paddingLeft: 5, color: 'gray' }}>
                                    Cập nhật thông tin cá nhân
                                </Text>
                            </View>
                        }
                    </View>
                    <View style={styles.containerBottomRight}>
                        <Button
                            title="Thiết lập"
                            status="success"
                            onPress={() => onPress()}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default ProfileAccAuth;
const styles = StyleSheet.create({
    containerSecurity: {
        width: '100%',
        height: 200,
        borderWidth: 1,
        backgroundColor: "#f1e3bc8c",
        borderColor: '#d2a1188c',
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 10,
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    containerTop: { flex: 1, width: '100%' },
    containerMiddle: { flex: 2, width: '100%', flexDirection: 'row', flexWrap: 'wrap' },
    containerMiddleLeft: { flex: 1, justifyContent: 'center', alignItems: 'center', },
    containerMiddleLeftCircle: {
        width: 150,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerMiddleLeftCircleText: { color: 'black', fontSize: 20, color: 'green' },
    containerMiddleRight: { flex: 4 },
    containerMiddleRightText: { fontSize: 14, textAlign: "left" },
    containerBottom: { flex: 3, width: '100%', flexDirection: 'row', flexWrap: 'wrap' },
    containerBottomLeft: { flex: 2, justifyContent: 'flex-start' },
    containerBottomRight: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});