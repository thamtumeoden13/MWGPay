import React, { useState, useEffect, Fragment } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Alert,
    Text,
    TextInput,
} from 'react-native';
import { connect } from "react-redux";
import { Icon } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import { ModalDropList } from '../common/modal/ModalDropList';
import { ModalConfigContentAddress } from './ModalConfigContentAddress';
import { callGetCache } from "@actions/cacheAction";

const mapStateToProps = state => {
    return {
        AppInfo: state,
        FetchAPIInfo: state.FetchAPIInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        callGetCache: (cacheKeyID) => {
            return dispatch(callGetCache(cacheKeyID));
        },

    };
};

const ModalConfigAddress = (props) => {
    const [address, setAddress] = useState(props.address ? props.address : '')
    const [provinceID, setProvinceID] = useState(props.provinceID ? props.provinceID : '');
    const [provinceName, setProvinceName] = useState('');
    const [districtID, setDistrictID] = useState(props.districtID ? props.districtID : '');
    const [districtName, setDistrictName] = useState('');
    const [wardID, setWardID] = useState(props.wardID ? props.wardID : '');
    const [wardName, setWardName] = useState('');
    const [fullNameAddress, setFullNameAddress] = useState(props.fullNameAddress ? props.fullNameAddress : '');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dataModal, setDataModal] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataProvince, setDataProvince] = useState([]);
    const [dataWard, setDataWard] = useState([]);
    const [errors, setErrors] = useState(props.errors ? props.errors : {})
    const [errorClass, setErrorClass] = useState({ province: '', district: '', ward: '' })
    const [dataTypeModal, setDataType] = useState('')
    const [headerTitle, setHeaderTitle] = useState('')

    useEffect(() => {
        getProvince()
    }, [])

    useEffect(() => {
        const fullName = address + ", " + wardName + ", " + districtName + ", " + provinceName;
        if (props.onChangeText)
            props.onChangeText(address, provinceID, districtID, wardID, fullName);
        setErrors({})
    }, [address, provinceID, districtID, wardID,])

    useEffect(() => {
        const fullName = address + ", " + wardName + ", " + districtName + ", " + provinceName;
        setFullNameAddress(fullName)
    }, [address, wardName, districtName, provinceName])

    useEffect(() => {
        onFilterByProvinceID(provinceID);
    }, [provinceID, dataProvince])

    useEffect(() => {
        onFilterByDistrictID(districtID);
    }, [districtID, dataDistrict])

    useEffect(() => {
        onFilterByWardID(wardID);
    }, [wardID, dataWard])

    useEffect(() => {
        let errorClassProvince = '';
        let errorClassDistrict = '';
        let errorClassWard = '';

        if (errors) {
            if (errors.provinceID === '0') {
                errorClassProvince = {
                    borderColor: 'red',
                    color: 'red',
                }
            }
            if (errors.districtID === '0') {
                errorClassDistrict = {
                    borderColor: 'red',
                    color: 'red',
                }
            }
            if (errors.wardID === '0') {
                errorClassWard = {
                    borderColor: 'red',
                    color: 'red',
                }
            }
            setErrorClass({ province: errorClassProvince, district: errorClassDistrict, ward: errorClassWard })
        }
    }, [errors])

    useEffect(() => {
        setErrors(props.errors ? props.errors : {})
    }, [props.errors])

    const onFilterByProvinceID = (provinceID) => {
        if (provinceID) {
            dataProvince.filter((item, index) => {
                if (item.ProvinceID === provinceID) {
                    setProvinceName(item.ProvinceName)
                }
            });
        }
    }

    const onFilterByDistrictID = (districtID) => {
        if (districtID) {
            dataDistrict.filter((item, index) => {
                if (item.DistrictID === districtID) {
                    setDistrictName(item.DistrictName)
                }
            });
        }
    }

    const onFilterByWardID = (wardID) => {
        if (wardID) {
            dataWard.filter((item, index) => {
                if (item.WardID === wardID) {
                    setWardName(item.WardName)
                }
            });
        }
    }

    const showModal = (dataType) => {
        let dataModalType = [];
        switch (dataType) {
            case 'province':
                dataModalType = dataProvince;
                setDataType(dataType);
                setHeaderTitle("Danh sách các tỉnh thành ");
                break;
            case 'district':
                setDataType(dataType);
                setHeaderTitle("Danh sách các Quận/Huyện");
                if (provinceName.length > 0) {
                    dataDistrict.filter((item, index) => {
                        if (item.ProvinceID === provinceID) {
                            dataModalType.push(item);
                        }
                    })
                }
                break;
            case 'ward':
                setDataType(dataType);
                if (districtName.length > 0) {
                    dataWard.filter((item, index) => {
                        if (item.DistrictID === districtID) {
                            dataModalType.push(item);
                        }
                    })
                }
                break;
        }
        setDataModal(dataModalType);
        setIsModalVisible(true);
    }

    const onPressItem = (item, index) => {
        let dataDistrictNew = [];
        let dataWardNew = [];
        if (dataModal) {
            if (dataModal[index].WardID && dataModal[index].DistrictID) {
                setWardName(dataModal[index].WardName);
                setWardID(dataModal[index].WardID);
                setIsModalVisible(false);
            }

            if (dataModal[index].DistrictID && dataModal[index].ProvinceID) {
                setDistrictName(dataModal[index].DistrictName);
                setDistrictID(dataModal[index].DistrictID)
                setWardName('--- Chọn Phường/Xã ---');
                setWardID('');

                dataWard.filter((itemWard, index1) => {
                    if (itemWard.DistrictID === dataModal[index].DistrictID) {
                        dataWardNew.push(itemWard);
                    }
                })
                setDataModal(dataWardNew);
                setDataType('ward');
                setHeaderTitle("Danh sách các Phường/Xã");
            }

            if (dataModal[index].CountryID && dataModal[index].ProvinceID) {

                setProvinceName(dataModal[index].ProvinceName);
                setProvinceID(dataModal[index].ProvinceID);
                setDistrictName('--- Chọn Quận/Huyện ---');
                setWardName('--- Chọn Phường/Xã ---');
                setDistrictID('');
                setWardID('');

                dataDistrict.filter((itemDistrict, index1) => {
                    if (itemDistrict.ProvinceID === dataModal[index].ProvinceID) {
                        dataDistrictNew.push(itemDistrict);
                    }
                })
                setDataModal(dataDistrictNew);
                setDataType('district');
                setHeaderTitle("Danh sách các Quận/Huyện");
            }

        }
    }

    const getProvince = () => {
        const cacheKeyID = "EWALLETCOMMONCACHE.PROVINCE";
        props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                setDataProvince(cacheResult.ResultObject.CacheData)
                getDistrict();
            }
            else {
                //console.log("getProvince fail", cacheResult.MessageDetail)
            }
        });
    }

    const getDistrict = () => {
        const cacheKeyID = "EWALLETCOMMONCACHE.DISTRICT";
        props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                setDataDistrict(cacheResult.ResultObject.CacheData)
                getWard();
            }
            else {
                // console.log("getDistrict fail", cacheResult.MessageDetail)
            }
        });
    }

    const getWard = () => {
        const cacheKeyID = "EWALLETCOMMONCACHE.WARD";
        props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                setDataWard(cacheResult.ResultObject.CacheData)
            }
            else {
                // console.log("getWard fail", cacheResult.MessageDetail)
            }
        });
    }

    return (
        <View style={styles.container}>
            <ModalDropList
                isVisible={isModalVisible}
                content={
                    <ModalConfigContentAddress
                        data={dataModal}
                        onClose={() => setIsModalVisible(false)}
                        onPressItem={onPressItem}
                        dataType={dataTypeModal}
                        headerTitle={headerTitle}
                    />
                }
            />
            <Fragment>
                <View style={[styles.groupItem, styles.province, errorClass.province]}>
                    <Text style={{ height: '100%', width: '100%', fontSize: 15, lineHeight: 40, paddingLeft: 5, }} onPress={() => showModal('province')}>
                        {provinceName.length > 0 ? provinceName : "--- Chọn Tỉnh/Thành phố ---"}
                    </Text>
                </View>
                {
                    errors && errors.provinceID === '0' &&
                    <View style={{ height: 15, width: '95%', flexDirection: 'row', marginRight: 'auto', marginLeft: 'auto', marginBottom: 5, }}>
                        <Text style={{ height: '100%', width: '100%', fontSize: 10, paddingLeft: 5, color: 'red' }}>
                            {
                                errors.messProvince
                            }
                        </Text>
                    </View>
                }
                <View style={[styles.groupItem, styles.district, errorClass.district]}>
                    <Text style={{ height: '100%', width: '100%', fontSize: 15, lineHeight: 40, paddingLeft: 5, }} onPress={() => showModal('district')}>
                        {districtName.length > 0 ? districtName : '--- Chọn Quận/Huyện ---'}
                    </Text>
                </View>
                {
                    errors && errors.districtID === '0' &&
                    <View style={{ height: 15, width: '95%', flexDirection: 'row', marginRight: 'auto', marginLeft: 'auto', marginBottom: 5, }}>
                        <Text style={{ height: '100%', width: '100%', fontSize: 10, paddingLeft: 5, color: 'red' }}>
                            {
                                errors.messDistrict
                            }
                        </Text>
                    </View>
                }

                <View style={[styles.groupItem, styles.ward, errorClass.ward]}>
                    <Text style={{ height: '100%', width: '100%', fontSize: 15, lineHeight: 40, paddingLeft: 5, }} onPress={() => showModal('ward')}>
                        {wardName.length > 0 ? wardName : '--- Chọn Phường/Xã ---'}
                    </Text>
                </View>
                {
                    errors && errors.wardID === '0' &&
                    <View style={{ height: 15, width: '95%', flexDirection: 'row', marginRight: 'auto', marginLeft: 'auto', }}>
                        <Text style={{ height: '100%', width: '100%', fontSize: 10, paddingLeft: 5, color: 'red' }}>
                            {
                                errors.messWard
                            }
                        </Text>
                    </View>
                }
            </Fragment>
            <View style={[styles.groupItemAddress]}>
                <TextField
                    label='Số nhà'
                    inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                    value={address}
                    onChangeText={(value) => setAddress(value)}
                    clearButtonMode="always"
                    keyboardType="default"
                    error={errors ? errors.address : ''}
                />
            </View>

            <View style={[styles.fullNameAddress]}>
                <Icon
                    name='address-book'
                    type='font-awesome'
                    color='#000'
                    containerStyle={{ position: 'absolute', top: 20, left: 0, width: 20, }}
                    iconStyle={{ alignContent: 'center', alignItems: 'center', fontSize: 26 }}
                />
                <Text style={{ lineHeight: 20, marginTop: 10, paddingLeft: 30, position: 'absolute', width: "100%", flexWrap: "wrap", paddingTop: 5 }}>
                    {
                        fullNameAddress
                    }
                </Text>
            </View>
        </View>

    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalConfigAddress);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    province: {
        marginTop: 10
    },
    groupItem: {
        height: 40,
        width: '95%',
        flexDirection: 'row',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: 'gray',
    },

    groupItemAddress: {
        width: '95%',
        height: 50,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 5,
    },
    fullNameAddress: {
        position: 'relative',
        flexDirection: 'row',
        width: '95%',
        height: 50,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 15,
    }
});