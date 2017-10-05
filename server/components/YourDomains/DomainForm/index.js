import React from 'react';
import ip from 'ip';
import { connect } from 'react-redux';
import Form from 'antd/lib/form';
import 'antd/lib/form/style/css';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import { DomainForm as formLayout } from '../formLayouts.js';
import { isDomainName } from '../../../actions/validates.js';
import DynamicInput from './DynamicInput';
import { saveDomain } from '../../../actions/submit';

const FormItem = Form.Item;

class DomainForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        const { form, saveDomain } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            saveDomain({
                domain: values.domain,
                nameservers: values.keys.map(i => ip.toLong(values.nameservers[i]))
            });
            form.resetFields();
        });
    }

    render () {
        const { domain, nameservers } = this.props.selected || {};
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.onSubmit}>
                <FormItem
                    {...formLayout.item}
                    required={false}
                    label="Domain"
                >
                    {getFieldDecorator('domain', {
                        rules: [{ validator: isDomainName },
                            { required: true, message: 'Please input domain name' }],
                            initialValue: domain
                    })( <Input placeholder="google" disabled={!!this.props.selected}/> )}
                </FormItem>
                <DynamicInput form={this.props.form} nameservers={nameservers}/>
                <FormItem {...formLayout.tailItem} style={{textAlign: 'right'}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        {!!this.props.selected ? 'Save' : 'Add'} domain
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

export default connect(
    state => ({ selected: state.selected}),
    { saveDomain }
)(Form.create()(DomainForm));

