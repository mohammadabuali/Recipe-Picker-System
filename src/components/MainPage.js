import React from 'react';
import {CarbStage, MeatStage, PiquantStage} from "./Stages.js";
import {UserInputStage} from "./UserInputStage";

class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stage: 0,
            meat: null,
            carb: null,
            piquant: null,
        };
    }

    chooseMeat(meat) {
        this.setState({
            meat: meat,
            stage: 1,
        });
    }

    chooseCarb(carb) {
        this.setState({
            carb: carb,
            stage: 2,
        });
    }

    choosePiquant(piquant) {
        this.setState({
            piquant: piquant,
            stage: 3
        })
    }


    removeSettings(key) {
        if (key === 'all') {
            localStorage.clear();
        } else {
            localStorage.removeItem(key);
        }
        this.setState({
            stage: 0,
            meat: null,
            carb: null,
            piquant: null
        });
        alert('Your preferences were reset.');
        console.log(this);
    }


    render() {
        let stageDiv;
        switch (this.state.stage) {
            default:
                stageDiv = null;
                break;
            case 0:
                stageDiv = <MeatStage choose={(x) => this.chooseMeat(x)}/>;
                break;
            case 1:
                stageDiv = <CarbStage choose={(x) => this.chooseCarb(x)}/>;
                break;
            case 2:
                stageDiv = <PiquantStage choose={(x) => this.choosePiquant(x)}/>;
                break;
            case 3:
                stageDiv =
                    <UserInputStage protein={this.state.meat} carb={this.state.carb} piquant={this.state.piquant}/>;
                break;
        }

        return (
            <div className='main-page'>
                {stageDiv}

                <div className="btnDiv">
                    <button className="prb" onClick={() => {
                        this.setState({
                            stage: 0,
                            meat: null,
                            carb: null,
                            piquant: null
                        });
                    }
                    }
                    >
                        Change settings
                    </button>
                    <button className="prb" onClick={() => {
                        if (window.confirm('Are you sure you wish to remove all preferences?')) {
                            this.removeSettings('all');
                        }
                    }}
                    >
                        Remove all preferences
                    </button>
                    {this.state.piquant && <button className="prb"
                                                   onClick={() => this.removeSettings(
                                                       this.state.meat + '_' + this.state.carb + '_' + this.state.piquant
                                                   )}
                    >
                        Remove current setting preferences
                    </button>}
                </div>
            </div>
        );
    }
}

export default MainPage;