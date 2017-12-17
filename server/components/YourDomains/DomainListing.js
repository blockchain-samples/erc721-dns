import React from 'react';
import { connect } from 'react-redux';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

import { selectDomain } from '../../actions/receive';

const DomainListing = (props) => (

        <Table
            columns={[{title: 'Your domains', dataIndex: 'domain'}]}
            rowKey='domain'
            loading={props.domains === undefined}
            dataSource={Object.keys(props.domains||{})
                .filter(token => !!props.domains[token])
                .sort((a, b) => props.domains[a].domain.localeCompare(props.domains[b].domain))
                .map(token => props.domains[token])
            }
            pagination={false}
            onRowClick={props.selectDomain}
        />
);

export default connect(
    state => ({ domains: state.domains, selected: state.selected }),
    {  selectDomain } 
)(DomainListing);
