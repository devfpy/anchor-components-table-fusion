/*
 * @Author: devfpy
 * @Date: 2021-08-17 18:06:21
 * @LastEditTime: 2021-08-17 18:20:06
 * @LastEditors: devfpy
 * @Description:
 */
import React from 'react'

import {
  TableSelectionMode,
  TableComponent
} from 'anchor-components-table-fusion'
import { Table } from '@alifd/next'
import 'anchor-components-table-fusion/dist/index.css'

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

const App = () => {
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

export default App
