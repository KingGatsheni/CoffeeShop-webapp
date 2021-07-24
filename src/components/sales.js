import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import { Table ,Row,Col} from 'react-bootstrap'

const SalesReport = () => {
    const [sales, setSales] = useState([])
    const[pay, setPay] = useState([])

    const Salesinfo = () => {
        api.get('/api/sales').then((data) => {
            setSales(data.data)
        }).catch((error) => {
            console.log(error)
        })
    }
    const PayInfo =()=>{
        api.get('/api/payments/').then((data)=>{
            setPay(data.data);
        }).catch((error)=>{
            console.log(error)
        })
    }
    useEffect(() => {
        Salesinfo()
        PayInfo()
    }, [])

    if (!sales) {
        return null
    }

    return (
        <div style={{ marginTop: '5px', padding: '15px' }} className="App">
            <Row>
                <Col>
                <h4 style={{padding: '15px' }}>Sales Report information</h4>
                <Table style={{padding: '25px' }} striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Quantity Sold</th>
                        <th>Date of Sale</th>
                        <th>Total Selling Price</th>
                    </tr>
                </thead>
                <tbody>
                    {sales
                        .map((items) => {
                            return (
                                <tr key={items.saleId}>
                                    <td>{"#" + items.productId}</td>
                                    <td>{items.qty}</td>
                                    <td>{items.soldAt}</td>
                                    <td>{"R" + items.total}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
                </Col>
                <Col>
                <h4 style={{padding: '15px' }}>Payment information</h4>
                <Table style={{padding: '25px' }} striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>Sales Code</th>
                        <th>Date of Payment</th>
                        <th>Total Paid</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {pay
                        .map((items) => {
                            return (
                                <tr key={items.payId}>
                                    <td>{"#" + items.saleId}</td>
                                    <td>{items.date}</td>
                                    <td>{"R"+items.salesTotal}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
                </Col>
            </Row>
        </div>
    )
}
export default SalesReport