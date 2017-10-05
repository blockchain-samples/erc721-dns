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
            dataSource={(props.domains||[])
                .sort((a, b) => a.localeCompare(b))
                .map(domain => ({domain}))
            }
            pagination={false}
            onRowClick={props.selectDomain}
        />
);

export default connect(
    state => ({ domains: [...state.domains], selected: state.selected }),
    {  selectDomain } 
)(DomainListing);
