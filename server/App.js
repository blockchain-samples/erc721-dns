import React from 'react';
import Alert from 'antd/lib/alert';
import 'antd/lib/alert/style/css';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';
import './index.css';

import DomainForm from './components/DomainForm';
import TransferForm from './components/TransferForm';

import { init, getDomains, getNameServers } from './actions/receive';
import { saveDomain, transferDomain } from './actions/submit';

const web3 = window.web3;

export default class extends React.Component {
    state = {domains: []};

    componentDidMount () {
        init((addr, contract) => {
            this.contract = contract;
            this.setState({addr}, () => getDomains(contract, addr, this));
        });
    }

    render() {
        return (
            <div className="container">
                <h1>Blockchain DNS</h1>

                {!!this.state.addr && <Alert
                    message={`Your address is ${this.state.addr}`}
                    type="success"
                    style={{marginBottom: 20}}
                />}

                <table id="tabs"><tbody>
                    <tr><td className="left">
                        <Table
                            columns={[{title: 'Your domains', dataIndex: 'domain'}]}
                            rowKey='domain'
                            dataSource={this.state.domains.map(domain => ({domain}))}
                            pagination={false}
                            onRowClick={(r) => getNameServers(this.contract, r.domain, this)}
                        />
                    </td><td className="right">
                        <DomainForm
                            web3={web3}
                            disabled={!this.state.addr}
                            domain={this.state.selected}
                            nameservers={this.state.nameservers}
                            saveDomain={saveDomain(this.contract, this.state.addr, this)}
                        />
                        {!!this.state.selected && <div><div className="divider"/>
                            <TransferForm
                                web3={web3}
                                domain={this.state.selected}
                                transferDomain={transferDomain(this.contract, this.state.addr, this)}
                            />
                        </div>}
                    </td></tr>
                </tbody></table>

                <p style={{marginTop: 300}}>
                    <a href="https://github.com/ilyapt/blockchain-dns" target="_blank">Blockchain DNS</a> (c) Ilya Petrusenko
                </p>
            </div>
        );
    }
}

