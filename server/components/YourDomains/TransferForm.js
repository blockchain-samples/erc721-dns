import React from 'react';
import { connect } from 'react-redux';
import Form from 'antd/lib/form';
import 'antd/lib/form/style/css';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import { TransferForm as formLayout } from './formLayouts.js';
import { isEthAddr } from '../../actions/validates.js';
import { transferDomain } from '../../actions/submit';
const FormItem = Form.Item;

class TransferForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        const { form, transferDomain } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            transferDomain({
                domain: this.props.selected.domain,
                address: values.address
            });
            form.resetFields();
        });
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.onSubmit}>
                <FormItem
                    {...formLayout.item}
                    required={false}
                    label="Address to"
                >
                    {getFieldDecorator('address', {
                        rules: [{ validator: isEthAddr },
                            { required: true, message: 'Please input address to' }],
                    })( <Input placeholder="0xc71fcd1cc8683a001642711698189fb4daa10ccc"/> )}
                </FormItem>
                <FormItem {...formLayout.tailItem} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">Transfer domain</Button>
                </FormItem>
            </Form>
        );
    }
}

export default connect(
    state => ({ selected: state.selected }),
    { transferDomain }
)(Form.create()(TransferForm));
