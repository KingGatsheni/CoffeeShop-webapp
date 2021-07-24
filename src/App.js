import './App.css';
import React, { useState, useEffect } from 'react';
import { Table, Tab, Tabs, Row, Col, DropdownButton, Dropdown, Form, Button, Image, Navbar, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import cart from './assets/cart.png';
import SalesData from './components/sales'


import api from './api/axios';

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const [id, setId] = useState("");
  const [list, setList] = useState([]);
  //const list = []


  useEffect(() => {
    ApiRequest();
  }, [])
  const ApiRequest = () => {
    api.get('/api/products').then((products) => {
      setProducts(products.data);
    }).catch((error) => {
      console.log(error);
    })
  }
  if (!products) {
    return null;
  }
  const handleSelect = (e) => {
    setValue(e);
  }
  const RequestById = () => {
    let salesObj = {
      "productId": "",
      "qty": "",
      "soltAt": "",
      "total": "",
    }
    api.get(`api/products/${id}`).then((item) => {

      let price = item.data.coffeePrice
      let Total = price * value
      var date = Date.now()
      salesObj = [{
        "productId": id,
        "qty": value,
        "soltAt": date,
        "total": Total,
      }]
      setList(salesObj)
      console.log(list)
    }).catch((err) => {
      console.log(err)
    })
  }
  const Payment = () => {
    list.map((item) => {
      api.post('/api/sales', { productId: item.productId, qty: item.qty, soltAt: item.soltAt, total: item.total }).then((res) => {
        list.length = 0
      }).catch((err) => console.log(err))
    })

  }


  return (
    <div className="App">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand style={{ padding: '15px', fontSize: '22px' }} href="#home">THE DEVCOFFE SHOP ONLINE STORE</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <a href="#login"> Login </a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Tabs defaultActiveKey="Home" id="uncontrolled-tab-example" className="mb-2">
        <Tab eventKey="Home" title="CoffeeShop Home">
          <Row>
            <Col >
              <div style={{ padding: '15px' }} className="App">
                <input style={{ margin: '2px' }} type="text" placeholder="Search here " onChange={(e) => {
                  setSearch(e.target.value);
                }} />
                <Table striped bordered hover variant="light">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>CofeeType</th>
                      <th>CofeePrice</th>
                      <th>Qty InStock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter((item) => {
                      if (search == "") {
                        return item;
                      } else if (item.coffeeType.toLowerCase().includes(search.toLowerCase())) {
                        return item;
                      }
                    })
                      .map((items) => {
                        return (
                          <tr key={items.productId}>
                            <td>{"#" + items.productId}</td>
                            <td>{items.coffeeType}</td>
                            <td>{"R" + items.coffeePrice}</td>
                            <td>{items.quantity}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col>
              <div className="App" style={{ padding: '15px' }}>
                <form>
                  <Row>
                    <Col>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ padding: '15px' }}>
                            Select Amount To Buy
                          </Form.Label>
                          <Col>
                            <DropdownButton
                              alignRight
                              title="Select Qty"
                              id="dropdown-menu-align-right"
                              onSelect={handleSelect}
                            >
                              <Dropdown.Item eventKey="1">1</Dropdown.Item>
                              <Dropdown.Item eventKey="2">2</Dropdown.Item>
                              <Dropdown.Item eventKey="3">3</Dropdown.Item>
                              <Dropdown.Item eventKey="4">4</Dropdown.Item>
                              <Dropdown.Item eventKey="5">5</Dropdown.Item>
                            </DropdownButton>
                            <h6 style={{ margin: '5px' }}>Selected Quantity</h6>
                            <h6 style={{ margin: '5px', color: 'blue' }}>{value}</h6>
                            <h6>SKU code here</h6>
                            <input style={{ margin: '5px' }} type="text" placeholder="Sku Code " onChange={(x) => {
                              setId(x.target.value)
                            }} />
                            <Image style={{ marginTop: '10px', width: '180px', hieght: '180px' }} src={cart} fluid />
                            <div style={{ margin: '5px' }} className="mb-2">
                              <Button variant="primary" size="md" onClick={RequestById}>
                                Add Item To Collection
                              </Button>
                            </div>
                          </Col>
                        </Form.Group>
                      </Form>
                    </Col>
                    <Col style={{ padding: '15px' }}>
                      <h4 style={{ margin: '5px', padding: '15px' }}>Cart Items</h4>
                      <Table striped bordered hover variant="light">
                        <thead>
                          <tr>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            list.map((item) => {
                              return (
                                <tr key={item.productId}>
                                  {item.productId !== undefined ? <td>{"#" + item.productId}</td> : ""}
                                  <td>{item.qty}</td>
                                  {item.total !== undefined ? <td>{"R" + item.total}</td> : ""}
                                </tr>
                              )
                            })

                          }
                        </tbody>
                      </Table>
                      <div className="App">
                        <h6 style={{ marginTop: '85px', padding: '5px' }}>
                          SubTotal
                        </h6>
                        {
                          list.map((i) => {
                            return (
                              <>
                                {i.total !== undefined ? <h6 style={{ marginTop: '5px', padding: '5px', fontSize: '32px' }}> {"R" + i.total}</h6> : <h6 style={{ marginTop: '5px', padding: '5px', fontSize: '32px' }}>R0.00</h6>}
                              </>

                            )
                          })

                        }
                        <Button style={{ marginTop: '10px', padding: '15px' }} variant="primary" size="md" onClick={Payment}>
                          Proceed to Checkout
                        </Button>
                      </div>
                    </Col>
                  </Row>

                </form>
              </div>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="sales" title="Sales Report">
          <SalesData />
        </Tab>
        <Tab eventKey="contact" title="Inventory Management">
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
