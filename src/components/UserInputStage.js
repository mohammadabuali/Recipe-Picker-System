import * as React from "react";
import {css} from "@emotion/core";
import {DotLoader} from "react-spinners";
import yummly_image from '../yummly_logo.png';
import Sababa from "../logic/algorithm";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;


export class UserInputStage extends React.Component {

    constructor(props) {
        super(props);
        let data = require('../data/recipes/yummly_' + props.protein + '_' + props.carb + '_' + props.piquant);
        let recipe = data.recipes[Math.floor(Math.random() * data.recipes.length)];
        this.sababa = new Sababa(this.props.protein, this.props.carb, this.props.piquant,
            () => this.startWaiting(), () => this.stopWaiting());
        this.state = {
            isWaiting: false,
            recipe: recipe,
            data: data
        };

    }

    componentDidMount() {
        this.startWaiting();
        this.sababa.buildVector();
        this.sababa.incrementWeightTop();
        console.log(this.sababa)
        // this.startWaiting();

    }

    drawWaiting() {
        return (
            <div className="sweet-loading">
                <DotLoader
                    css={override}
                    size={50}
                    //size={"150px"} this also works
                    color={'#60ff43'}
                    // loading={true}
                />
            </div>
        );
    }

    stopWaiting() {
        this.setState({isWaiting: false})
    }

    startWaiting() {
        this.setState({isWaiting: true})
    }

    test() {
        this.startWaiting();
        let recipe = this.state.data.recipes[Math.floor(Math.random() * this.state.data.recipes.length)];
        this.setState({recipe: recipe})

        setTimeout(() => this.stopWaiting(), 1000);
    }

    compileIngredients(ingredients) {
        let res = [];
        for (let k in Object.keys(ingredients)) {
            let ingredient = ingredients[k];
            let txt = '';
            if (ingredient['quantity'] !== null) {
                txt += ingredient['quantity'];
            }
            if (ingredient['unit'] != null) {
                txt += ' ' + ingredient['unit'] + ' ';
            }
            txt += ingredient['name'];
            res.push(<p>{txt}</p>);
        }
        return res;
    }

    vote(score) {
        this.sababa.incrementWeightUser(this.state.recipe, score);
        this.setState({recipe: this.state.data.recipes[Math.floor(Math.random() * this.state.data.recipes.length)]});
    }

    render() {
        if (this.state.isWaiting) {
            return this.drawWaiting();
        } else {
            let url = this.state.recipe['page_url'];
            let img = this.state.recipe.image_url.length === 0 ? yummly_image : this.state.recipe.image_url;
            let ingredients = this.compileIngredients(this.state.recipe.ingredients);
            return (
                <div className="recipes">
                    <a href={url} target='_blank' rel="noopener noreferrer">
                        <img src={img}
                             alt={this.state.recipe.name}/>
                    </a>
                    <p>{this.state.recipe['name']}</p>
                    <div className="ings">
                        <ul>
                            <h3>Ingredients</h3>
                            <div className='ingredients'>
                                {ingredients}
                            </div>
                        </ul>
                    </div>
                    <div className="fnt">
                        <i className="fa fa-thumbs-down"
                           onClick={() => this.vote(-1)}/>
                        <i className="fa fa-thumbs-up"
                           onClick={() => this.vote(1)}/>
                    </div>

                </div>
            );
        }
    }
}