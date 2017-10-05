import React from 'react';
import { connect } from 'react-redux';
import Tabs from 'antd/lib/tabs';
import 'antd/lib/tabs/style/css';
import Alert from 'antd/lib/alert';
import 'antd/lib/alert/style/css';
import './index.css';

import { init } from './actions/init';
import SellOrders from './components/SellOrders';
import YourDomains from './components/YourDomains';

const TabPane = Tabs.TabPane;

const AddrAlert = (props) => (
    <Alert
        message={(<pre>Your address is <b>{props.account}</b></pre>)}
        type="success"
        style={{marginBottom: 20}}
    />
);

const CriticalAlert = (props) => (
    <Alert
        message={props.critical}
        type="error"
        style={{marginBottom: 20}}
    />
);

class App extends React.Component {
    state = {domains: []};

    componentDidMount () { this.props.init(); }

    render() {
        return (
            <div className="container">
                <h1 style={{marginBottom: 10}}>Blockchain DNS</h1>


            <Tabs defaultActiveKey="2">
                <TabPane tab="Domain sell orders" key="1">
                    {!!this.props.critical && <CriticalAlert {...this.props}/>}
                    {!!this.props.account && <AddrAlert {...this.props}/>}
                    <h2>Domain sell orders</h2>
                    <SellOrders/>
                </TabPane>
                <TabPane tab="Your domains" key="2">
                    {!!this.props.critical && <CriticalAlert {...this.props}/>}
                    {!!this.props.account && <AddrAlert {...this.props}/>}
                    {!this.props.critical && <YourDomains />}
            </TabPane></Tabs>

                <p style={{marginTop: 300}}>
                    <a href="https://github.com/ilyapt/blockchain-dns"
                        target="_blank">Blockchain DNS</a> (c) Ilya Petrusenko
                </p>
            </div>
        );
    }
}

export default connect(
    state => ({ critical: state.critical, account: state.account, orders: state.orders }),
    { init }
)(App);
