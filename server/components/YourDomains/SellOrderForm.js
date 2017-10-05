import React from 'react';
import { connect } from 'react-redux';
import Form from 'antd/lib/form';
import 'antd/lib/form/style/css';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import { TransferForm as formLayout } from './formLayouts';
import { isPrice } from '../../actions/validates.js';
import { addSellOrder, removeSellOrder } from '../../actions/submit';

const FormItem = Form.Item;

class SellOrderForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        const { form, addSellOrder } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            addSellOrder({
                domain: this.props.selected.domain,
                price: values.price
            });
            form.resetFields();
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return this.props.selected.ordered ? 
        (
            <Form>
                <FormItem {...formLayout.tailItem} style={{textAlign: 'right'}}>
                    <Button
                        type="danger"
                        onClick={this.props.removeSellOrder}
                        style={{width: '100%'}}
                    >Remove sell order</Button>
                </FormItem>
            </Form>
        ) : (
            <Form onSubmit={this.onSubmit}>
                <FormItem
                    {...formLayout.item}
                    required={false}
                    label="Sell price"
                >
                    {getFieldDecorator('price', {
                        rules: [{ validator: isPrice },
                            { required: true, message: 'Please input price' }],
                    })( <div><Input placeholder="0.1" style={{width: '90%'}}/> ETH</div>)}
                </FormItem>
                <FormItem {...formLayout.tailItem} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">Order to sell</Button>
                </FormItem>
            </Form>
        );
    }
}

export default connect(
    state => ({ selected: state.selected }),
    { addSellOrder, removeSellOrder }
)(Form.create()(SellOrderForm));
