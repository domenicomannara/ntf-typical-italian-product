import React, { Component } from 'react';
import {Card} from 'react-bootstrap';
import Web3 from 'web3'
import './App.css';
import TypicalProduct from '../abis/TypicalProduct.json';

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      products: []
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = TypicalProduct.networks[networkId]
    if(networkData) {
      const abi = TypicalProduct.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      
      for (var i = 1; i <= totalSupply; i++) {
        const product = await contract.methods.products(i - 1).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (region, typeProduct, nameProduct) => {
    this.state.contract.methods.mint(region, typeProduct, nameProduct).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        products: [...this.state.products, {region, typeProduct, nameProduct}]
      })
    })
  }

 

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          -
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">Address: {this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <h1>Typical Italian Product (Issue Token)</h1>
          <form onSubmit={(event) => {
                  event.preventDefault()
                  const reg = this.region.value
                  const typeProduct = this.typeProduct.value
                  const nameProduct = this.nameProduct.value
                  this.mint(reg, typeProduct, nameProduct)
              }}>
                <div className="form-group row">
                  <label className="col-sm-1 col-form-label">Region</label>
                  <div className="col-sm-3">
                  <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='e.g. Abruzzo'
                        ref={(input) => { this.region = input }}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-1 col-form-label">Typology</label>
                  <div className="col-sm-3">
                  <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='e.g. Formaggi'
                        ref={(input) => { this.typeProduct = input }}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-1 col-form-label">Product</label>
                  <div className="col-sm-3">
                  <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='e.g. Pecorino di Atri'
                        ref={(input) => { this.nameProduct = input }}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-1">
                    <input
                      type='submit'
                      className='btn btn-block btn-primary'
                      value='MINT'
                    />
                  </div>
                </div>
              </form>
          
          <hr/>
          
          <h1>Products List</h1>
          <div className="row text-center">
            { this.state.products.map((product, key) => {
              return(
                <Card key={key} border="primary" style={{ width: '18rem', margin: '20px' }}>
                  <Card.Header>{product.nameProduct}</Card.Header>
                  <Card.Body>
                    <Card.Title>({product.typeProduct})</Card.Title>
                    <Card.Text>
                    produced in {product.region}
                    </Card.Text>
                  </Card.Body>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
