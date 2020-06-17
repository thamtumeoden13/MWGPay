import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    Button
} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { FlatListComponent } from '@componentsCommon/flatList'
import { formatMoney } from '@utils/function';
import { CDN_IMG } from "@constants/systemVars.js";

const renderFLData = (paymentInfo, paymentKey) => {
    let detailData = []
    switch (paymentKey.toString()) {
        case "1": //nap tien dien thoai
            detailData = [
                {
                    leftTitle: "Nhà Mạng",
                    rightTitle: paymentInfo.DataNetworkSelect.title
                },
                {
                    leftTitle: "Số Điện Thoại",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Mệnh Giá",
                    rightTitle: formatMoney(paymentInfo.AmountPerCard, 0) + "đ"
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: "Miễn phí"
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.Amount, 0) + "đ"
                }
            ]
            break;
        case "3": //the dien thoai
            detailData = [
                {
                    leftTitle: "Nhà Mạng",
                    rightTitle: paymentInfo.DataNetworkSelect.title
                },
                {
                    leftTitle: "Số Điện Thoại",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Mệnh Giá",
                    rightTitle: formatMoney(paymentInfo.AmountPerCard, 0) + "đ"
                },
                {
                    leftTitle: "Số Lượng",
                    rightTitle: paymentInfo.Quantity
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: "Miễn phí"
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.Amount, 0) + "đ"
                }
            ]
            break;
        case "4": //the game
            detailData = [
                {
                    leftTitle: "Nhà Cung Cấp",
                    rightTitle: paymentInfo.DataNetworkSelect.title
                },
                {
                    leftTitle: "Dịch Vụ",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Mệnh Giá",
                    rightTitle: formatMoney(paymentInfo.AmountPerCard, 0) + "đ"
                },
                {
                    leftTitle: "Số Lượng",
                    rightTitle: paymentInfo.Quantity
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: "Miễn phí"
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.Amount, 0) + "đ"
                },
            ]
            break;
        case "6": //dien
            detailData = [
                {
                    leftTitle: "Nhà Cung Cấp",
                    rightTitle: paymentInfo.Partner
                },
                {
                    leftTitle: "Mã Khách Hàng",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Khách Hàng",
                    rightTitle: paymentInfo.CustomerName
                },
                {
                    leftTitle: "Địa Chỉ",
                    rightTitle: paymentInfo.CustomerAddress
                },
                {
                    leftTitle: "Kỳ Thanh Toán",
                    rightTitle: paymentInfo.BillCycle
                },
                {
                    leftTitle: "Số Tiền",
                    rightTitle: formatMoney(paymentInfo.ServiceAmount, 0) + "đ"
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: paymentInfo.ServiceFee == 0 ? 'Miễn phí' : formatMoney(paymentInfo.ServiceFee, 0)
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.TransactionAmount, 0) + "đ"
                },
            ]
            break;
        case "7"://nuoc
            detailData = [
                {
                    leftTitle: "Nhà Cung Cấp",
                    rightTitle: paymentInfo.Partner
                },
                {
                    leftTitle: "Mã Danh Bộ",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Khách Hàng",
                    rightTitle: paymentInfo.CustomerName
                },
                {
                    leftTitle: "Địa Chỉ",
                    rightTitle: paymentInfo.CustomerAddress
                },
                {
                    leftTitle: "Số Tiền",
                    rightTitle: formatMoney(paymentInfo.AmountPerCard, 0) + "đ"
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: "Miễn phí"
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.Amount, 0) + "đ"
                },
            ]
            break;
        case "8"://internet
            detailData = [
                {
                    leftTitle: "Nhà Cung Cấp",
                    rightTitle: paymentInfo.Partner
                },
                {
                    leftTitle: "Mã Khách Hàng",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Khách Hàng",
                    rightTitle: paymentInfo.CustomerName
                },
                {
                    leftTitle: "Địa Chỉ",
                    rightTitle: paymentInfo.CustomerAddress
                },
                {
                    leftTitle: "Kỳ Thanh Toán",
                    rightTitle: paymentInfo.Quantity
                },
                {
                    leftTitle: "Số Tiền",
                    rightTitle: formatMoney(paymentInfo.AmountPerCard, 0) + "đ"
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: "Miễn phí"
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.Amount, 0) + "đ"
                },
            ]
            break;
        case "9": //thanh toán hóa đơn của điện thoại trả sau
            detailData = [
                {
                    leftTitle: "Nhà Cung Cấp",
                    rightTitle: paymentInfo.Partner
                },
                {
                    leftTitle: "Mã Khách Hàng",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Khách Hàng",
                    rightTitle: paymentInfo.CustomerName
                },
                {
                    leftTitle: "Địa Chỉ",
                    rightTitle: paymentInfo.CustomerAddress
                },
                {
                    leftTitle: "Kỳ Thanh Toán",
                    rightTitle: paymentInfo.BillCycle
                },
                {
                    leftTitle: "Số Tiền",
                    rightTitle: formatMoney(paymentInfo.ServiceAmount, 0) + "đ"
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: paymentInfo.ServiceFee == 0 ? 'Miễn phí' : formatMoney(paymentInfo.ServiceFee, 0)
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.TransactionAmount, 0) + "đ"
                },
            ]
            break;
        case "10": //Thanh toán vay tiêu dùng
            detailData = [
                {
                    leftTitle: "Nhà Mạng",
                    rightTitle: paymentInfo.DataNetworkSelect.title
                },
                {
                    leftTitle: "Số Điện Thoại",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Mệnh Giá",
                    rightTitle: formatMoney(paymentInfo.AmountPerCard, 0) + "đ"
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: "Miễn phí"
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.Amount, 0) + "đ"
                }
            ]
            break;
        case "11": //the game
            detailData = [
                {
                    leftTitle: "Nhà Mạng",
                    rightTitle: paymentInfo.DataNetworkSelect.title
                },
                {
                    leftTitle: "Số Điện Thoại",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Mệnh Giá",
                    rightTitle: formatMoney(paymentInfo.AmountPerCard, 0) + "đ"
                },
                {
                    leftTitle: "Số Lượng",
                    rightTitle: paymentInfo.Quantity
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: "Miễn phí"
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.Amount, 0) + "đ"
                }
            ]
            break;
        case "12": // Thanh toán truyển hình cáp
            detailData = [
                {
                    leftTitle: "Nhà Cung Cấp",
                    rightTitle: paymentInfo.Partner
                },
                {
                    leftTitle: "Mã Danh Bộ",
                    rightTitle: paymentInfo.CustomerCode
                },
                {
                    leftTitle: "Khách Hàng",
                    rightTitle: paymentInfo.CustomerName
                },
                {
                    leftTitle: "Địa Chỉ",
                    rightTitle: paymentInfo.CustomerAddress
                },
                {
                    leftTitle: "Số Tiền",
                    rightTitle: formatMoney(paymentInfo.AmountPerCard, 0) + "đ"
                },
                {
                    leftTitle: "Phí Giao Dịch",
                    rightTitle: "Miễn phí"
                },
                {
                    leftTitle: "Tổng Tiền",
                    rightTitle: formatMoney(paymentInfo.Amount, 0) + "đ"
                },
            ]
            break;
    }
    return detailData;
}

const PreviewPaymentDetail = (props) => {
    const flData = renderFLData(props.paymentInfo, props.paymentKey);
    const url_img = CDN_IMG + props.paymentInfo.DataNetworkSelect.ServiceLogoURL;
    return (
        <Card
            image={{
                uri: url_img
            }}
            imageProps={{
                resizeMode: "contain"
            }}
            imageStyle={{
                height: 60,
                //width: 100,
                marginTop: 5,

            }}
        >
            {flData && flData.length > 0
                ? <FlatListComponent
                    data={flData}
                    extraData={flData}
                    rowItemType="RowItemLabel"
                    flatListStyle={{ borderRadius: 5, borderWidth: 1, borderColor: '#827c7ca8', }}
                />
                : null
            }
        </Card>
    );
}

export default PreviewPaymentDetail;

const styles = StyleSheet.create({

});