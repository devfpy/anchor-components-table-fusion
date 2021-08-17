<!--
 * @Author: devfpy
 * @Date: 2021-08-17 18:05:33
 * @LastEditTime: 2021-08-17 18:35:55
 * @LastEditors: devfpy
 * @Description:
-->

# anchor-components-table-fusion

> anchoremc component libs table

[![NPM](https://img.shields.io/npm/v/anchor-components-table-fusion.svg)](https://www.npmjs.com/package/anchor-components-table-fusion) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save anchor-components-table-fusion
```

## Usage

```jsx
import React, { Component } from 'react'
import {
  TableSelectionMode,
  TableComponent
} from 'anchor-components-table-fusion'
import { Table } from '@alifd/next'

class Example extends Component {
  render() {
    const tableDataSource = [
      {
        id: '1',
        name: '张三',
        gender: '男',
        birthData: '2000-01-01'
      },
      {
        id: '2',
        name: '李四',
        gender: '男',
        birthData: '1990-01-01'
      },
      {
        id: '3',
        name: '王五',
        gender: '男',
        birthData: '1996-01-01'
      }
    ]
    return (
      <div style={{ padding: 15 }}>
        <TableComponent dataSource={tableDataSource}>
          <Table.Column title='编号' dataIndex='id' />
          <Table.Column title='姓名' dataIndex='name' />
          <Table.Column title='性别' dataIndex='gender' />
          <Table.Column title='出生日期' dataIndex='birthData' />
        </TableComponent>
      </div>
    )
  }
}
```

## License

MIT © [https://github.com/devfpy](https://github.com/https://github.com/devfpy)
