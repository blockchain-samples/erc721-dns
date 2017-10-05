import React from 'react';
import { connect } from 'react-redux';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import { orderBuy } from '../actions/submit';

const web3 = window.web3;

const SellOrders = (props) => {
    const { orders, orderBuy } = props;
    const columns = [{
        title: 'Domain',
        dataIndex: 'domain'
    }, {
        title: 'Price',
        dataIndex: 'price',
        render: (r) => `${web3.fromWei(r)} ETH`
    }, {
        render: (r) => (
            <Button onClick={() => orderBuy(r)}>
                Buy
            </Button>
        )
    }];

    return (
      <Table columns={columns} rowKey='domain' dataSource={
        Object.keys(orders)
            .filter(order => !!orders[order])
            .map(order => ({
                domain: order,
                price: orders[order]
            }))
    }/>
)};

export default connect(
    state => ({ orders: state.orders }),
    { orderBuy } 
)(SellOrders);
