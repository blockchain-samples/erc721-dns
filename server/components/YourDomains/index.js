import React from 'react';
import { connect } from 'react-redux';
import DomainListing from './DomainListing';
import DomainForm from './DomainForm';
import TransferForm from './TransferForm';
import SellOrderForm from './SellOrderForm';

const YourDomains = (props) => (

        <table id="tabs">
            <tbody>
                <tr>
                    <td className="left">
                        <DomainListing/>
                    </td>
                    <td className="right">
                        <DomainForm />
                        {!!props.selected && <div>
                            <div className="divider"/>
                            <TransferForm />
                            <div className="divider"/>
                            <SellOrderForm />
                        </div>}
                    </td>
                </tr>
            </tbody>
        </table>
);

export default connect(
    state => ({ selected: state.selected }),
    {  } 
)(YourDomains);
