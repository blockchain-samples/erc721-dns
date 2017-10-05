import React from 'react';
import Form from 'antd/lib/form';
import 'antd/lib/form/style/css';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import { DomainForm as formLayout } from '../formLayouts.js';
import { isIpAddr } from '../../../actions/validates.js';

const FormItem = Form.Item;
let uuid = 1;

export default class DynamicInput extends React.Component {
    state = {init: [0]}

    init = (props) => {
        if (Array.isArray(props.nameservers) && !!props.nameservers.length) {
            this.setState({ init: props.nameservers.map((_, i) => i) });
            uuid = props.nameservers.length;
        } else {
            this.setState({ init: [0] });
            uuid = 1;
        }
    }
    componentDidMount  = () => this.init(this.props);
    componentWillReceiveProps = (props) => this.init(props);

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

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: this.state.init });
        const keys = getFieldValue('keys');
        const dynamicItems = keys.map((k, index) => (
            <FormItem
                {...(index === 0 ? formLayout.item : formLayout.tailItem)}
                label={index === 0 ? 'Nameserver ip address' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`nameservers[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true,
                        message: "Please input nameserver's IP or delete this field.",
                    }, { validator: isIpAddr }],
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
        return (
            <div>
                {dynamicItems}
                <FormItem {...formLayout.tailItem}>
                    <Button type="dashed" onClick={this.add} style={{width: '100%'}}>
                        <Icon type="plus" /> Add nameserver
                    </Button>
                </FormItem>
            </div>
        );
    }
}
