import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col,FormGroup, ControlLabel, FormControl } from 'react-bootstrap';


import {Card} from 'components/Card/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
import {FormInputs} from 'components/FormInputs/FormInputs.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';    
import {Tasks} from 'components/Tasks/Tasks.jsx';
import loadingGif from 'assets/img/loading.gif';

import {
    dataPie,
    legendPie,
    dataSales,
    optionsSales,
    responsiveSales,
    legendSales,
    dataBar,
    optionsBar,
    responsiveBar,
    legendBar
} from 'variables/Variables.jsx';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {period:'',type_money:'',tableHtml:'',reload:false,loadGraph:false,dataGraph:{},loading:false}
    }

    changePeriod = (selectPeriod) =>{
        this.state.period = selectPeriod.target.value;
        console.log("Seleccionado",this.state.period);
    }

    changeTypeMoney = (selectTypeMoney) =>{
        this.state.type_money = selectTypeMoney.target.value;
        console.log("Seleccionado",this.state.type_money);
    }

    sendFilter = (e, message) => {
        e.preventDefault();
        if (this.state.period == "" && this.state.type_money == "") {
          return false;
        }
        this.setState({loading:true,loadGraph:false})
        fetch("http://localhost:5555/?period="+this.state.period+"&type_money="+this.state.type_money,
        {
            method:"GET"
        })
            .then(res => res.json())
            .then(
                (result)=>{
                    if(typeof(result.error) != "undefined"){
                        alert("Ocurrio un error se reintentara");
                        this.sendFilter(e,message)
                        return;
                    }
                    this.state.loadGraph = true;
                    this.state.dataGraph = result.graph_format;
                    console.log(this.state.dataGraph);
                    this.setState({reload:true,loading:false})
                    //otro
                },
                (error) => {
                    console.log("ERROR");
                });
    }

    render() { 
        let graph = null
        let loading = null
        if(this.state.loadGraph){
            graph=<Row>
                    <Col md={12}>
                        <Card
                            statsIcon="fa fa-history"
                            id="chartHours"
                            title="Fluctación"
                            category="Separado por horas"
                            content={
                                <div className="ct-chart">
                                    <ChartistGraph
                                        data={this.state.dataGraph}
                                        type="Line"
                                        options={optionsSales}
                                        responsiveOptions={responsiveSales}
                                    />
                                </div>
                                }   
                        />
                    </Col>
                </Row>
        }
        if(this.state.loading){
            loading = <Row>
                    <Col md={12}>
                        <Card
                            statsIcon="fa fa-history"
                            id="chartHours"
                            content={
                                <div className="text-center">
                                    <img src={loadingGif} width="100" />
                                </div>
                                }   
                        />
                    </Col>
                </Row>
        }
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Fluctación de monedas"
                                content={
                                    <form className='react-form' onSubmit={this.sendFilter}>
                                        <Col md={4}>
                                            <FormGroup controlId="Period">
                                              <ControlLabel>Periodo</ControlLabel>
                                              <FormControl componentClass="select" placeholder="select" onChange={this.changePeriod}>
                                                <option value="">Seleccione Periodo</option>
                                                <option value="diario">Diario</option>
                                                <option value="mensual">Mensual</option>
                                              </FormControl>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup controlId="Type_Money">
                                              <ControlLabel>Moneda</ControlLabel>
                                              <FormControl componentClass="select" placeholder="select" onChange={this.changeTypeMoney}>
                                                <option value="">Seleccione moneda</option>
                                                <option value="BTC">Bitcoin</option>
                                                <option value="ETH">Ethereum</option>
                                              </FormControl>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            &nbsp;
                                        </Col>
                                        <Button
                                            bsStyle="info"
                                            pullRight
                                            fill
                                            type="submit"
                                        >
                                            Filtrar
                                        </Button>
                                        <div className="clearfix"></div>
                                    </form>
                                }
                            />
                        </Col>
                    </Row>
                    {graph}
                    {loading}
                </Grid>
            </div>
        );
    }
}

export default Dashboard;
