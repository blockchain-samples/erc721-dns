import React from 'react';
import Form from 'antd/lib/form';
import 'antd/lib/form/style/css';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import { TransferForm as formLayout } from './formLayouts.js';
import { isEthAddr } from '../actions/validates.js';
const FormItem = Form.Item;

class TransferForm extends React.Component {
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.transferDomain({
                    domain: this.props.domain,
                    address: values.address
                });
                this.props.form.resetFields();
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.onSubmit}>
                <FormItem
                    {...formLayout.item}
                    required={false}
                    label="Address to"
                >
                    {getFieldDecorator('address', {
                        rules: [{
                            validator: isEthAddr
                        }, {
                            required: true, message: 'Please input your E-mail!',
                        }],
                    })( <Input placeholder="0xc71fcd1cc8683a001642711698189fb4daa10ccc"/> )}
                </FormItem>
                <FormItem {...formLayout.tailItem} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">Transfer domain</Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(TransferForm);
