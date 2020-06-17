import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ModalConfigIdentityCard } from './ModalConfigIdentityCard'
import { ModalConfigBirthday } from './ModalConfigBirthday'
import { ModalConfigEmail } from './ModalConfigEmail'
import { ModalConfigPassword } from './ModalConfigPassword'
import { ModalConfigGender } from './ModalConfigGender'
import ModalConfigAddress from './ModalConfigAddress';
import { regExEmail } from '@utils/function';
import MD5Digest from "@common/library/cryptography/MD5Digest.js";
import { HashingSHA256 } from '@common/library/cryptography/DotNetRSACrypto.js';

export const ModalConfigContent = (props) => {
    const [errors, setErrors] = useState({})
    const [idCard, setIDCard] = useState(props.idCard ? props.idCard : '')
    const onChangeIdentityCard = (value) => {
        setIDCard(value)
    }
    useEffect(() => {
        setIDCard(props.idCard)
    }, [props.idCard])

    const [birthday, setBirthday] = useState(props.birthday ? new Date(props.birthday) : new Date())
    const onChangeBirthday = (value) => {
        setBirthday(value)
    }
    useEffect(() => {
        setBirthday(props.birthday)
    }, [props.birthday])

    const [email, setEmail] = useState(props.email ? props.email : '')
    const onChangeEmail = (value) => {
        setEmail(value)
    }
    useEffect(() => {
        setEmail(props.email)
    }, [props.email])

    const [password, setPassword] = useState(props.password ? props.password : '')
    const onChangePassword = async (value) => {
        //let passwordMD5 = await MD5Digest(value);
        let passwordHashingSHA256 = HashingSHA256(password);
        setPassword(passwordHashingSHA256)
    }
    useEffect(() => {
        setPassword(props.password)
    }, [props.password])

    const [gender, setGender] = useState(props.gender ? props.gender : true)
    const onChangeGender = (value) => {
        setGender(value)
    }
    useEffect(() => {
        setGender(props.gender)
    }, [props.gender])

    const [address, setAddress] = useState(props.address ? props.address : '')
    const [provinceID, setProvinceID] = useState(props.provinceID ? props.provinceID : '')
    const [districtID, setDistrictID] = useState(props.districtID ? props.districtID : '')
    const [wardID, setWardID] = useState(props.wardID ? props.wardID : '')
    const [fullNameAddress, setFullNameAddress] = useState(props.fullNameAddress ? props.fullNameAddress : '')

    const onChangeAddress = (address, provinceID, districtID, wardID, fullNameAddress) => {
        setAddress(address)
        setProvinceID(provinceID)
        setDistrictID(districtID)
        setWardID(wardID)
        setFullNameAddress(fullNameAddress)
    }

    useEffect(() => {
        setAddress(props.address)
        setProvinceID(props.provinceID)
        setDistrictID(props.districtID)
        setWardID(props.wardID)
        setFullNameAddress(props.fullNameAddress)
    }, [props.address, props.provinceID, props.districtID, props.wardID, props.fullNameAddress])

    const [modalType, setModalType] = useState(props.modalType ? props.modalType : '');
    let styleContainer = props.styleContainer;
    let contentModal;
    switch (modalType) {
        case "Birthday":
            contentModal = (<ModalConfigBirthday birthday={birthday} onChangeText={onChangeBirthday} errors={errors} />)
            break
        case "IdentityCard":
            contentModal = (<ModalConfigIdentityCard idCard={idCard} onChangeText={onChangeIdentityCard} errors={errors} />)
            break
        case "Email":
            contentModal = (<ModalConfigEmail email={email} onChangeText={onChangeEmail} errors={errors} />)
            break
        case "Password":
            contentModal = (<ModalConfigPassword password={password} onChangeText={onChangePassword} onConfirmTouchID={props.onConfirmTouchID} errors={errors} />)
            break
        case "Gender":
            contentModal = (<ModalConfigGender gender={gender} onChangeText={onChangeGender} errors={errors} />)
            break
        case "Address":
            styleContainer = {
                height: "45%",
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: 'white',
            }
            contentModal = (
                <ModalConfigAddress
                    address={address}
                    provinceID={provinceID}
                    districtID={districtID}
                    wardID={wardID}
                    fullNameAddress={fullNameAddress}
                    onChangeText={onChangeAddress}
                    errors={errors}
                />
            )
            break
        default:
            break
    }
    useEffect(() => {
        setModalType(props.modalType)
    }, [props.modalType])

    const onConfirm = () => {
        let errors = {}
        let isError = false
        switch (modalType) {
            case "IdentityCard":
                if (idCard.length <= 0) {
                    errors.idCard = "Vui lòng nhập số CMND/CCCD"
                    isError = true
                }
                else {
                    if (idCard.length !== 9 && idCard.length !== 12) {
                        errors.idCard = "Số CMND/CCCD không đúng định dạng(9 hoặc 12 số)"
                        isError = true
                    }
                }
                setErrors(errors);
                break;
            case "Email":
                if (!regExEmail.test(email)) {
                    errors.email = "Email không hợp lệ. Vui lòng kiểm tra lại!"
                    isError = true
                }
                break;
            case "Password":
                if (props.onConfirm) {
                    props.onConfirm(password)
                }
                isError = true
                break;
            case "Birthday":

                break;
            case "Address":
                if (provinceID.length <= 0) {
                    errors.provinceID = "0";
                    errors.messProvince = "Vui lòng chọn Tỉnh/Thành phố!"
                    isError = true;
                }
                else if (districtID.length <= 0) {
                    errors.districtID = "0"
                    errors.messDistrict = "Vui lòng chọn Quận/Huyện!"
                    isError = true;
                }
                else if (wardID.length <= 0) {
                    errors.wardID = "0"
                    errors.messWard = "Vui lòng chọn Phường/Xã!"
                    isError = true;
                }
                else if (address.length <= 0) {
                    errors.address = "Địa chỉ không được để trống!";
                    isError = true;
                }

                break;
        }

        if (!isError) {
            if (props.onConfirm) {
                props.onConfirm(idCard, birthday, email, gender, address,
                    provinceID, districtID, wardID, fullNameAddress)
            }
            if (props.onConfirmEmail) {
                props.onConfirmEmail(email)
            }
        }
        setErrors(errors)
    }
    useEffect(() => {
        setErrors(props.errors ? props.errors : {})
    }, [props.errors])

    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            <View style={[styles.container, styleContainer]} >
                <View style={styles.containerTextField}>
                    {
                        contentModal
                    }
                </View>
                <View style={styles.containerButtonGroup}>
                    <Button
                        title="Huỷ"
                        type="solid"
                        buttonStyle={styles.cancelButton}
                        containerStyle={styles.containerButton}
                        textStyle={styles.title}
                        onPress={props.onClose}
                    />
                    <Button
                        title="Xác nhận"
                        buttonStyle={styles.confirmButton}
                        containerStyle={styles.containerButton}
                        textStyle={styles.title}
                        type="solid"
                        onPress={onConfirm}
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        height: "50%",
        width: "100%",
        justifyContent: "flex-end",
        backgroundColor: '#fff',
    },
    containerTextField: {
        flex: 1,
        marginHorizontal: 10
    },
    containerButtonGroup: {
        height: 50,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "flex-end",
        marginVertical: 20,
    },
    containerButton: {
        width: Dimensions.get("screen").width / 3,
        height: 40,
    },
    title: {
        textAlign: 'center'
    },
    cancelButton: {
        backgroundColor: 'gray',
        borderRadius: 2,
    },
    confirmButton: {
        backgroundColor: 'blue',
        borderRadius: 2,
    }
});