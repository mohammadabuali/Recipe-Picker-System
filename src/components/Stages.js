import React from "react";
import '../css/designs.css'

export class MeatStage extends React.Component {
    render() {
        return (
            <div className="meat">
                <h1>Choose Your Meat</h1>
                <div className="meatGrid">
                    <div className="gridItem">

                        <img
                            src={require('../assets/chicken.jpg')}
                            alt='Chicken'
                            onClick={() => this.props.choose('chicken')}
                        />
                        <p>chicken</p>
                    </div>
                </div>
                <div className="meatGrid">
                    <div className="gridItem">

                        <img
                            // src="https://www.euractiv.com/wp-content/uploads/sites/2/2020/01/shutterstock_1031664748-800x450.jpg"
                            src={require('../assets/beef.jpg')}
                            alt='Beef'
                            onClick={() => this.props.choose('beef')}
                        />
                        <p>beef</p>
                    </div>
                </div>
                <div className="meatGrid">
                    <div className="gridItem">

                        <img
                            // src="https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/roast-rack-of-pork-with-wild-garlic-stuffing_1.jpg"
                            src={require('../assets/pork.jpg')}
                            alt='Port'
                            onClick={() => this.props.choose('pork')}
                        />
                        <p>pork</p>
                    </div>
                </div>

            </div>
        );
    }
}

export class CarbStage extends React.Component {
    render() {
        return (
            <div className="carb">
                <h1>Choose Your Carbs</h1>
                <div className="carbGrid">
                    <div className="gridItem">

                        <img
                            src={require('../assets/pasta.jpg')}
                            alt='Pasta'
                            onClick={() => this.props.choose('pasta')}
                        />
                        <p>pasta</p>
                    </div>
                </div>
                <div className="carbGrid">
                    <div className="gridItem">

                        <img
                            src={require('../assets/potatoes.jpg')}
                            alt='Potatoes'
                            onClick={() => this.props.choose('potatoes')}
                        />
                        <p>potato</p>
                    </div>
                </div>
                <div className="carbGrid">
                    <div className="gridItem">

                        <img
                            src={require('../assets/rice.jpg')}
                            alt='Rice'
                            onClick={() => this.props.choose('rice')}
                        />
                        <p>rice</p>
                    </div>
                </div>
                <div className="carbGrid">
                    <div className="gridItem">

                        <img
                            src={require('../assets/bread.jpg')}
                            alt='Bread'
                            onClick={() => this.props.choose('bread')}
                        />
                        <p>bread</p>
                    </div>
                </div>
            </div>
        );
    }
}

export class PiquantStage extends React.Component {
    render() {
        return (
            <div className="spice">
                <h1>Choose Your Spiciness Level</h1>
                <div className="spiceGrid">
                    <div className="gridItem">

                        <img
                            src={require('../assets/spicy.jpg')}
                            alt='Spicy'
                            onClick={() => this.props.choose('spicy')}
                        />
                        <p>hot</p>
                    </div>
                </div>
                <div className="spiceGrid">
                    <div className="gridItem">

                        <img
                            src={require('../assets/mild.jpg')}
                            alt='Mild'
                            onClick={() => this.props.choose('mild')}
                        />
                        <p>mild</p>
                    </div>
                </div>
            </div>
        );
    }
}