import Prism from "prismjs";
import React from "react"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Button
} from "reactstrap"
import DataTable, { createTheme } from "react-data-table-component"
import { Search } from "react-feather"
import UserDataService from "../../../api/user-data-service";

createTheme('dark-giq', {
  background: {
    default: 'transparent'
  }
})

const CustomHeader = props => {
  return (
    <div className="d-flex flex-wrap justify-content-end">
      <div className="position-relative has-icon-left mb-1">
        <Input value={props.value} onChange={e => props.handleFilter(e)} />
        <div className="form-control-position">
          <Search size="15" />
        </div>
      </div>
    </div>
  )
}

function getColor(stat){
  if(stat.status === 'пополнение'){
    return "success"
  } else if(stat.status === 'в обработке'){
    return "warning"
  } else {
    return "primary"
  }
}
let $primary = "#7367F0"
class DataTableOrders extends React.Component {
  state = {
    columns: [
      {
        name: "ID транзакции",
        selector: "id",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.id}</p>
        )
      },
      {
        name: "Дата",
        selector: "created_at",
        sortable: true,
        cell: row => (
          <p className="text-bold-500 text-truncate mb-0">{row.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)}</p>
        )
      },
      {
        name: "Сумма",
        selector: "value",
        sortable: true,
        cell: row => <p className="text-bold-500 mb-0">{row.value}</p>
      },
      {
        name: "Статус ID",
        selector: "status_id",
        sortable: true,
        cell: row => (
          <Badge
            color={getColor(row)}
            pill>
            {row.status_id}
          </Badge>
        )
      }
    ],
    data: [],
    filteredData: [],
    value: "",
    page: 1,
    pages : 0
  }

  constructor(props) {
    super(props)
    this.userDataService = new UserDataService()
  }

  componentDidMount() {
    this.getTransactions();
  }

  getTransactions() {
    this.userDataService.getTransactions()
      .then(res => {
        console.log('DataTableOrders.getTransactions', res.data)

        this.setState({data: res.data.collection})
        this.setState({pages: res.data.pages})
      })
      .catch(err => console.log(err))
  }

  handleFilter = e => {
    let value = e.target.value
    let data = this.state.data
    let filteredData = this.state.filteredData
    this.setState({ value })

    if (value.length) {
      filteredData = data.filter(item => {
        let startsWithCondition =
          item.date.toLowerCase().startsWith(value.toLowerCase()) ||
          item.revenue.toLowerCase().startsWith(value.toLowerCase()) ||
          item.status.toLowerCase().startsWith(value.toLowerCase())
        let includesCondition =
          item.date.toLowerCase().includes(value.toLowerCase()) ||
          item.revenue.toLowerCase().includes(value.toLowerCase()) ||
          item.status.toLowerCase().includes(value.toLowerCase())

        if (startsWithCondition) {
          return startsWithCondition
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition
        } else return null
      })
      this.setState({ filteredData })
    }
  }

  render() {
    let { data, columns, value, filteredData } = this.state
    return (
      <Card>
        <CardHeader>
          <CardTitle>История транзакций</CardTitle>
        </CardHeader>
        <CardBody className="rdt_Wrapper">
          <DataTable
            className="dataTable-custom"
            data={value.length ? filteredData : data}
            columns={columns}
            noHeader
            pagination
            onChangePage={() => {

            }}
            subHeader
            theme="dark-giq"
            subHeaderComponent={
              <CustomHeader value={value} handleFilter={this.handleFilter} />
            }
          />
        </CardBody>
      </Card>
    )
  }
}

export default DataTableOrders
