import React, { Component } from 'react';
import Checkbox from "../components/Checkbox";
class ToolsList extends Component {

    constructor() {
        super();
        this.state = {
            //OPTIONS : ["One", "Two", "Three"],
            //availableToolList 
            OPTIONS: [
                {
                    "id": "tool10",
                    "item_name": "Tool10",
                    "unit": "cm",
                    "availability": 2,
                    "cost": 10
                },
                {
                    "id": "tool11",
                    "item_name": "Tool11",
                    "unit": "inch",
                    "availability": 20,
                    "cost": 50
                }
            ],
            selectedToolList: [],
            checkboxes: [],
            searchValue: ""
        };
        this.setCheckbox();
    }

    setCheckbox() {
        

        var tmpCheckboxes = this.state.OPTIONS.reduce(
            (options, option) => ({
                ...options,
                [option.id]: false
            }),
            {}
        );
        //this.state.checkboxes = tmpCheckboxes; 
        this.setState({
            checkboxes: tmpCheckboxes
          });
    }

    selectAllCheckboxes = isSelected => {
        Object.keys(this.state.checkboxes).forEach(checkbox => {
            this.setState(prevState => ({
                checkboxes: {
                    ...prevState.checkboxes,
                    [checkbox]: isSelected
                }
            }));
        });
    };

    selectAll = () => this.selectAllCheckboxes(true);
    deselectAll = () => this.selectAllCheckboxes(false);

    handleCheckboxChange = changeEvent => {
        const { name } = changeEvent.target;
        debugger;
        this.setState(prevState => ({
            checkboxes: {
                ...prevState.checkboxes,
                [name]: !prevState.checkboxes[name]
            }
        }));
        
        
    };
    
    handleSearchChange(e) {
        this.setState({
            searchValue: e.target.value.toLowerCase()
        });
    }

    handleFormSubmit = formSubmitEvent => {
        var tmpSelected = [];
        formSubmitEvent.preventDefault();
        Object.keys(this.state.checkboxes)
      .filter(checkbox => this.state.checkboxes[checkbox])
      .forEach(checkbox => {
        console.log(checkbox, "is selected.");
        var tmp = this.state.OPTIONS.filter(item => item.id === checkbox);
        tmpSelected = [...tmpSelected, ...tmp] ;
      });
      this.props.popupClose(tmpSelected);
  };


    createCheckbox = option => (
        <Checkbox
            label={option.item_name}
            isSelected={this.state.checkboxes[option.id]}
            onCheckboxChange={this.handleCheckboxChange}
            id={option.id}
            key={option.id}
        />
    );

    createCheckboxes = () => (
       
        this.state.OPTIONS.filter(item =>item.item_name.toLowerCase().includes(this.state.searchValue)).map(this.createCheckbox)

        );
    render() {
        return (
            <React.Fragment>
                <form onSubmit={this.handleFormSubmit}>
                    
                    <div className="form-group mt-2 float-right">
                    <button
                            type="button"
                            className="btn btn-blue mr-2 btn-sm"
                            onClick={this.selectAll}
                        >
                            Select All
                </button>
                        <button
                            type="button"
                            className="btn btn-primary mr-2 btn-sm"
                            onClick={this.deselectAll}
                        >
                            Deselect All
                </button>
                        <button type="submit" className="btn btn-success btn-sm" >
                            Save
                </button>
                    </div>

                    <div className="has-search mb-2">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input type="text" className="form-control search-box" placeholder="Search tools..." onChange={this.handleSearchChange.bind(this)} />
                    </div>

                    {this.createCheckboxes()}
                </form>
            </React.Fragment>
        );
    }
}
export default ToolsList;