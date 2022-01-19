import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

import Popup from "../components/Popup";

import QuoteList from './QuoteList';
import Quote from './Quote';
import QuoteDetail from './QuoteDetail';

import UserService from "../services/user.service";

class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      isQuoteDetailActive: false,
      quoteItem: null,
      selectedQuoteId: null,
      popupConfig: {},
      isPopupOpen: false,
      reloadKey: 0
    }
  }
  render() {
    return (
      <React.Fragment>
        <Popup popupConfig={this.state.popupConfig} openFlag={this.state.isPopupOpen} parentCloseCallback={this.handleClose.bind(this)}></Popup>
        <Header />
        <div className="page-body row">
          <div className="col">
            <QuoteList parentCallback={this.selectedOuoteItem} key={this.state.reloadKey}/>
          </div>
          <div className="col">
            {!this.state.isQuoteDetailActive ? <Quote parentCreateCallBack={this.quoteCreateCallBack} /> : null}
            {this.state.isQuoteDetailActive ? <QuoteDetail parentDeletecallBack = {this.quoteDeletecallBack} parentEditCallBack={this.quoteEditCallBack} parentEditButtonCallBack ={this.quoteEdit} isQuoteEditActive={this.state.isQuoteEditActive} dataFromParent={this.state.quoteItem} parentCallback={this.selectedOuoteItem} /> : null}
          </div>
        </div>
        <Footer></Footer>
      </React.Fragment>
    );
  }
  selectedOuoteItem = (childData) => {
    if (childData !== undefined) {
      this.getSingleQuote(childData.id);
    } else {
      this.setState({
        isQuoteDetailActive: false,
        isQuoteEditActive: false
      });
    }

  }

  handleClose = () => {
    this.setState({
      isPopupOpen: false
    });
  }

  getSingleQuote = (id) => {
    UserService.getSingleQuote(id).then(
      response => {
        if (response) {
          this.setState({
            isQuoteDetailActive: true,
            isQuoteEditActive: false,
            quoteItem: response.data

          });


        }
      },
      error => {
        console.log("Error");
      }
    );
  };
  quoteEdit = () => {
    this.setState({
      isQuoteEditActive: true
    });
  }
  quoteDeletecallBack = () => {
    this.setState({
      reloadKey: this.state.reloadKey+1
    });
  }

  quoteEditCallBack = (response) => {


    var quoteItem = response ;

    this.setState({
      isQuoteDetailActive: true,
      isQuoteEditActive: false,
      quoteItem: quoteItem,
      reloadKey: this.state.reloadKey+1
    });

    this.setState({
      isPopupOpen: true,
      popupConfig: {
        header: "Message",
        body: "Quote Edited",
        type: "message"
      }
    });

  }

  quoteCreateCallBack = (response) => {

    var quoteItem = response.data;

    this.setState({
      isQuoteDetailActive: true,
      isQuoteEditActive: false,
      quoteItem: quoteItem,
      reloadKey: this.state.reloadKey+1
    });


    this.setState({
      isPopupOpen: true,
      popupConfig: {
        header: "Message",
        body: response.message,
        type: "message"
      }
    });
  }

  
}
export default Dashboard;