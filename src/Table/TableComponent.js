import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Pagination, Input, Balloon, Form, Icon } from '@alifd/next'
import styles from '../styles.module.css'

const TableSelectionMode = {
  TableSelectionModeNone: 'none',
  TableSelectionModeSingle: 'single',
  TableSelectionModeMultiple: 'multiple'
}

class TableComponent extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    dataSource: PropTypes.array.isRequired,
    isZebra: PropTypes.bool,
    primaryKey: PropTypes.string.isRequired,
    isShowPagination: PropTypes.bool,
    isShowTotalRecord: PropTypes.bool, //是否显示总记录数
    selectedRowKeys: PropTypes.array,
    selectedRowData: PropTypes.array,
    tablePagesize: PropTypes.number,
    tableTotalRecord: PropTypes.number,
    children: PropTypes.any,
    tableSelectionMode: PropTypes.string,
    tableDefaultSelectRowKeys: PropTypes.array,
    tableOnChange: PropTypes.func,
    tableOnSelect: PropTypes.func,
    tableOnRowClick: PropTypes.func,
    getCellProps: PropTypes.func,
    paginationOnChange: PropTypes.func,
    paginationShape: PropTypes.string,
    paginationType: PropTypes.string,
    cols: PropTypes.array,
    currentPage: PropTypes.number,
    rowProps: PropTypes.func,
    onSort: PropTypes.func,
    onFilter: PropTypes.func,
    handleOnSort: PropTypes.func,
    isShowSelectAll: PropTypes.bool,
    hasHeader: PropTypes.bool,
    hasBorder: PropTypes.bool,
    useVirtual: PropTypes.bool,
    maxBodyHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    getProps: PropTypes.func,
    onResizeChange: PropTypes.func
  }

  static defaultProps = {
    isShowPagination: true,
    isShowTotalRecord: false,
    paginationShape: 'normal',
    paginationType: 'normal',
    hasHeader: true,
    hasBorder: true,
    useVirtual: false,
    isZebra: true
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedRowKeys: [],
      selectedRowData: [],
      currentPage: 1
    }

    this.tableRef = React.createRef()
  }

  // tableOnChange = (ids, records) => {
  //     // 该方法与tableOnSelect方法 使用其中一个即可
  //     this.setState({
  //         selectedRowKeys: ids
  //     });
  //     if (this.props.tableOnChange) {
  //         this.props.tableOnChange(ids, records);
  //     }
  // };

  tableOnSelect = (selected, record) => {
    this.setSelectedData(record)
  }

  tableOnSelectAll = (selected, records) => {
    let selectedKeys = []
    records.map((ele) => {
      selectedKeys.push(ele[this.props.primaryKey])
    })
    if (this.props.tableOnChange) {
      this.props.tableOnChange(selectedKeys, records)
    }
  }

  tableRowOnClick = (record) => {
    this.setSelectedData(record)
  }

  clear() {
    this.setState({
      selectedRowKeys: []
    })
  }

  paginationOnChange = (currentPage) => {
    this.setState({
      currentPage
    })
    if (this.props.paginationOnChange) {
      this.props.paginationOnChange(currentPage)
    }
  }

  /**
   * 设置选中数据
   */
  setSelectedData = (selectedItem) => {
    if (
      this.props.tableSelectionMode ===
      TableSelectionMode.TableSelectionModeMultiple
    ) {
      let selectedRowKeys =
        typeof this.props.selectedRowKeys === 'undefined'
          ? this.state.selectedRowKeys
          : this.props.selectedRowKeys
      let selectedRowData =
        typeof this.props.selectedRowData === 'undefined'
          ? this.state.selectedRowData
          : this.props.selectedRowData

      //获取当前选中项
      let rowKey = selectedItem[this.props.primaryKey]
      let isSelected = false // this.checkTableRowIsSelected(rowKey);
      for (let i = 0; i < selectedRowKeys.length; i++) {
        if (selectedRowKeys[i] == rowKey) {
          isSelected = true
          break
        }
      }
      // this.props.dataSource.map((ele) => {
      //     selectedRowKeys.map((sKey) => {
      //         if (ele[this.props.primaryKey] === sKey) {
      //             selectedRowData.push(ele);
      //         }
      //     });
      // });

      if (isSelected) {
        //将rowKey从selectedKeys中删除 将selectedItem从selectedRowData中删除

        const index = selectedRowKeys.indexOf(rowKey)
        selectedRowKeys.splice(index, 1)
        selectedRowData.splice(index, 1)
      } else {
        //将rowKey添加到selectedKeys中 将selectedItem添加到 selectedRowData中
        selectedRowKeys.push(rowKey)
        selectedRowData.push(selectedItem)
      }
      this.setState(
        {
          selectedRowKeys: selectedRowKeys,
          selectedRowData: selectedRowData
        },
        () => {
          if (this.props.tableOnChange) {
            this.props.tableOnChange(selectedRowKeys, selectedRowData)
          }
        }
      )
    } else {
      this.setState({
        selectedRowKeys: [selectedItem[this.props.primaryKey]],
        selectedRowData: [selectedItem]
      })

      if (this.props.tableOnChange) {
        this.props.tableOnChange(
          [selectedItem[this.props.primaryKey]],
          [selectedItem]
        )
      }
    }
  }

  /**
   * 检查key是否被选中
   */
  checkTableRowIsSelected = (rowKey) => {
    let result = false

    for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
      if (this.state.selectedRowKeys[i] == rowKey) {
        result = true
        break
      }
    }
    return result
  }

  handleOnSort = (dataIndex, order) => {
    if (this.props.onSort) {
      this.props.onSort(dataIndex, order)
    }
  }

  handleOnFilter = (filterParams) => {
    if (this.props.onFilter) {
      let obj = {}
      let keys = Object.keys(filterParams)
      obj[keys[0]] = filterParams[keys[0]].selectedKeys.join(',')
      this.props.onFilter(obj)
    }
  }

  handleInputFilter = (filterParams) => {
    if (this.props.onFilter) {
      this.props.onFilter(filterParams)
    }
  }

  handleInputFilterReset = (dataIndex) => {
    if (this.props.onFilter) {
      let obj = {}
      obj[dataIndex] = ''
      this.props.onFilter(obj)
    }
  }

  handleTableOnResizeChange = (dataIndex, value) => {
    this.props.onResizeChange && this.props.onResizeChange(dataIndex, value)
  }

  render() {
    const renderTitle = (colItem) => {
      let dom = <span>{colItem.title}</span>
      if (colItem.filter && colItem.filterType == 'input') {
        dom = (
          <Balloon
            autoFocus
            trigger={
              <div>
                {colItem.title}{' '}
                <Icon type='filter' size='xs' style={{ marginLeft: '8px' }} />
              </div>
            }
            closable={false}
            triggerType='click'
            style={{ border: '1px solid #70A1FF' }}
          >
            <Form>
              <Form.Item style={{ marginBottom: '10px' }}>
                <Input name={colItem.dataIndex} placeholder='请输入筛选内容' />
              </Form.Item>
              <Form.Item label='' style={{ marginBottom: '0' }}>
                <Form.Submit type='primary' onClick={this.handleInputFilter}>
                  确认
                </Form.Submit>{' '}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Form.Reset
                  onClick={() => this.handleInputFilterReset(colItem.dataIndex)}
                >
                  重置
                </Form.Reset>
              </Form.Item>
            </Form>
          </Balloon>
        )
      }
      return dom
    }

    return (
      <div style={{ height: '100%' }} ref={this.tableRef}>
        <Table
          type='list'
          loading={this.props.loading}
          dataSource={this.props.dataSource}
          isZebra={this.props.isZebra ? this.props.isZebra : false}
          hasHeader={this.props.hasHeader ? this.props.hasHeader : false}
          hasBorder={this.props.hasBorder ? this.props.hasBorder : false}
          useVirtual={this.props.useVirtual ? this.props.useVirtual : false}
          fixedHeader={this.props.maxBodyHeight ? true : false}
          maxBodyHeight={
            this.props.maxBodyHeight ? this.props.maxBodyHeight : null
          }
          primaryKey={this.props.primaryKey}
          onRowClick={
            this.props.tableOnRowClick
              ? this.props.tableOnRowClick
              : this.tableRowOnClick
          }
          rowSelection={
            this.props.tableSelectionMode == 'none'
              ? null
              : {
                  onChange: this.tableOnChange,
                  onSelect: this.tableOnSelect,
                  onSelectAll: this.tableOnSelectAll,
                  titleProps: () => {
                    return {
                      style: {
                        display:
                          this.props.isShowSelectAll === false
                            ? 'none'
                            : 'block'
                      }
                    }
                  },

                  selectedRowKeys:
                    typeof this.props.selectedRowKeys === 'undefined'
                      ? this.state.selectedRowKeys
                      : this.props.selectedRowKeys,
                  mode: this.props.tableSelectionMode,
                  getProps: this.props.getProps
                }
          }
          onSort={
            this.props.handleOnSort
              ? this.props.handleOnSort
              : this.handleOnSort
          }
          onFilter={this.handleOnFilter}
          cellProps={this.props.getCellProps}
          rowProps={this.props.rowProps ? this.props.rowProps : () => {}}
          onResizeChange={this.handleTableOnResizeChange}
          tableLayout='fixed'
        >
          {this.props.cols
            ? this.props.cols.map((col) => (
                <Table.Column
                  title={renderTitle(col)}
                  filters={col.filterData}
                  filterMode={col.filterMode}
                  dataIndex={col.dataIndex}
                  key={col.dataIndex}
                  cell={col.render}
                  align={col.align}
                  alignHeader={col.alignHeader}
                  width={col.width}
                  lock={col.lock ? col.lock : false}
                  sortable={col.sortable ? col.sortable : false}
                  resizable={col.resizable == true ? true : false}
                />
              ))
            : this.props.children}
          {/*{this.props.children}*/}
        </Table>
        {this.props.isShowPagination ? (
          <Pagination
            pageSize={this.props.tablePagesize}
            total={this.props.tableTotalRecord}
            current={
              this.props.currentPage
                ? this.props.currentPage
                : this.state.currentPage
            }
            onChange={this.paginationOnChange}
            type={this.props.paginationType}
            shape={this.props.paginationShape}
            className={styles.marginTop12}
            totalRender={
              this.props.isShowTotalRecord == true
                ? (total) => `总记录数：${total}`
                : undefined
            }
          />
        ) : null}
      </div>
    )
  }
}

export { TableSelectionMode, TableComponent }
