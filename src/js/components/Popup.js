import React from 'react';
import { Button } from 'reactstrap';
import Modal from "react-bootstrap/Modal";
import ForgotPassword from "./ForgotPassword";
import OperationList from "./OperationList";
import ConfigureOperation from "./ConfigureOperation";
import Profiile from "./Profile";

class Popup extends React.Component {

  callback = (list) => {
    this.props.parentCloseCallback(list);
  }

  renderPopupBody() {  
    switch(this.props.popupConfig.type) {
      case 'forgotPassword':
        return <ForgotPassword popupClose={this.props.parentCloseCallback}></ForgotPassword>;
      case 'toolsList':
        return <ConfigureOperation showTools={true} popupClose={this.callback}></ConfigureOperation>;
      case 'workerList':
        return <ConfigureOperation showWorkers={true} popupClose={this.callback}></ConfigureOperation>;
      case 'configureOperation':
        return <ConfigureOperation showTools={true} showWorkers={true} popupClose={this.callback}></ConfigureOperation>;
      case 'operationList':
        return <OperationList popupClose={this.callback}></OperationList>;
      case 'image':
        return <div class="container"> 
        <iframe title="doc" class="responsive-iframe"  src={this.props.popupConfig.body}  height="1000" width="1000"></iframe>
      </div>;
      case 'profile':
          return <Profiile></Profiile> ;
        default:
        return this.props.popupConfig.body;
    }
  };
  getClassName() {
    switch(this.props.popupConfig.type) {
      case 'configureOperation':
        return 'confCntr';
      case 'image':
        return 'imgCntr';
      default:
        return '';
    }
  };

  render() {
    const popupConfigType = this.props.popupConfig.type;
    let button;
    if (popupConfigType === "confirmation") {
      button = <Button color="success" onClick={this.props.parentConfirmCallback}>Confirm Delete</Button>;
    } 
    return (
      <Modal show={this.props.openFlag} onHide={this.props.parentCloseCallback}  className={this.getClassName()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.popupConfig.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        { this.renderPopupBody() }
        </Modal.Body>
        <Modal.Footer>
          {button}
        </Modal.Footer>
      </Modal>
    );
  }
}
export default Popup;