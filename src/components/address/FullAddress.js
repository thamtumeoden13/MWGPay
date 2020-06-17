import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';

import ModalConfigAddress from '../personalInfo/ModalConfigAddress';

const FullAddressCom = (props) => {
    const [errors, setErrors] = useState({})

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
        if (props.onChangeAddress)
            props.onChangeAddress(address, provinceID, districtID, wardID, fullNameAddress)
    }

    useEffect(() => {
        setAddress(props.address)
        setProvinceID(props.provinceID)
        setDistrictID(props.districtID)
        setWardID(props.wardID)
        setFullNameAddress(props.fullNameAddress)
    }, [props.address, props.provinceID, props.districtID, props.wardID, props.fullNameAddress])

    useEffect(() => {
        setErrors(props.errors ? props.errors : {})
    }, [props.errors])

    return (
        <View style={styles.container} >
            <View style={styles.containerTextField}>
                <ModalConfigAddress
                    address={address}
                    provinceID={provinceID}
                    districtID={districtID}
                    wardID={wardID}
                    fullNameAddress={fullNameAddress}
                    onChangeText={onChangeAddress}
                    errors={errors}
                />
            </View>
        </View>
    );
}
export default FullAddressCom;
const styles = StyleSheet.create({
    container: {
        // height: "45%",
        height: 270,
        width: "100%",
        justifyContent: "flex-start",
        backgroundColor: '#fff',
    },
    containerTextField: {
        flex: 1,
        marginHorizontal: 10
    },
});