import React from 'react';
import ip from 'ip';
import Form from 'antd/lib/form';
import 'antd/lib/form/style/css';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import { DomainForm as formLayout } from './formLayouts.js';
import { isDomainName, isIpAddr } from '../actions/validates.js';

const FormItem = Form.Item;
let uuid = 1;

class DomainForm extends React.Component {
    state = {init: [0]}
    init = (nameservers) => {
        if (nameservers) {
            this.setState({
                init: nameservers.map((_, i) => i)
            });
            uuid = nameservers.length;
        }
    }
    componentDidMount = () => this.init(this.props.nameservers);
    componentWillReceiveProps = (props) => this.init(props.nameservers);

    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) return;
        form.setFieldsValue({ keys: keys.filter(key => key !== k) });
    }
    
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid++);
        form.setFieldsValue({ keys: nextKeys });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.saveDomain({
                    domain: values.domain,
                    nameservers: values.keys.map(i => ip.toLong(values.nameservers[i]))
                });
                this.props.form.resetFields();
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: this.state.init });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <FormItem
                {...(index === 0 ? formLayout.item : formLayout.tailItem)}
                label={index === 0 ? 'Nameserver ip address' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`nameservers[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "Please input nameserver's IP or delete this field.",
                    }, {
                        validator: isIpAddr
                    }],
                    initialValue: this.props.nameservers ? this.props.nameservers[k] : undefined
                })(
                    <Input placeholder="8.8.8.8" style={{ width: '90%', marginRight: 8 }} />
                )}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 1}
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </FormItem>
        ));

        console.log(this.props.nameservers);
        return (
            <Form onSubmit={this.onSubmit}>
                <FormItem
                    {...formLayout.item}
                    required={false}
                    label="Domain"
                >
                    {getFieldDecorator('domain', {
                        rules: [{
                            validator: isDomainName
                        }, {
                            required: true, message: 'Please input domain name',
                        }],
                        initialValue: this.props.domain
                    })( <Input placeholder="google" disabled={!!this.props.domain}/> )}
                </FormItem>
                {formItems}
                <FormItem {...formLayout.tailItem}>
                    <Button type="dashed" onClick={this.add} style={{width: '100%'}}>
                        <Icon type="plus" /> Add nameserver
                    </Button>
                </FormItem>
                <FormItem {...formLayout.tailItem} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">{!!this.props.domain ? 'Save' : 'Add'} domain</Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(DomainForm);
