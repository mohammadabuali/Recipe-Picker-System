import cleanIngredient from "./ingrediant_cleaning";

export default class Sababa {

    constructor(meat, carb, piquant, startWaitCB, stopWaitCB) {
        this.meat = meat;
        this.carb = carb;
        this.piquant = piquant;
        this.startWaitCB = startWaitCB;
        this.stopWaitCB = stopWaitCB;

        this.data = require('../data/recipes/yummly_' + meat + '_' + carb + '_' + piquant)['recipes'];

        this.orderedRecipes = this.orderRecipes();

        this.cat = {};
        this.ing = {};
        this.vectorDict = {};
        this.sectionDict = {};
        this.count = 0;

        this.loved_recipes = [];
        this.hated_recipes = {};
        this.ingredient_occurence = {};
        this.key = this.meat + '_' + this.carb + '_' + this.piquant;

        this.load();
    }

    load() {
        let data = localStorage.getItem(this.key);
        if (data == null) {
            return;
        }

        data = JSON.parse(data);
        this.vectorDict = data.vectorDict;
        this.count = data.count;
        this.loved_recipes = [...this.data].filter((x) => data.loved_recipes.includes(x['id']));
        this.hated_recipes = data['hated_recipes'];
        // this.hated_recipes = [...this.data['recipes']].filter((x) => data.loved_recipes.includes(x['id']));
        this.ingredient_occurence = data.ingredient_occurence;
    }

    save() {
        let data = {
            count: this.count,
            vectorDict: this.vectorDict,
            loved_recipes: this.loved_recipes.map((x) => x['id']),
            hated_recipes: this.hated_recipes,
            ingredient_occurence: this.ingredient_occurence
        };
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    orderRecipes() {
        return [...this.data].sort((x, y) => y['yums'] - x['yums']);
    }

    determineWeight(ing) {
        this.startWaitCB();
        let min = 1000000;
        let max = 0;

        for (let x in Object.keys(this.ingredient_occurence)) {
            if (this.ingredient_occurence[x] > max) {
                max = this.ingredient_occurence[x];
            }
            if (this.ingredient_occurence[x] < min) {
                min = this.ingredient_occurence[x];
            }
        }
        this.stopWaitCB();
        return (max - this.ingredient_occurence[ing] + 1) / (max - min);
    }

    buildVector() {
        this.startWaitCB();
        for (let x in Object.keys(this.orderedRecipes)) {
            let recipe = this.orderedRecipes[x];
            for (let y in Object.keys(recipe['ingredients'])) {
                let ingredient = recipe['ingredients'][y];
                let cat = ingredient['category'];
                let ing = ingredient['name'];
                let filt = cleanIngredient(ing, cat);
                if (filt != null && filt !== '') {
                    if (!(filt in this.ingredient_occurence)) {
                        this.ingredient_occurence[filt] = 1;
                    } else {
                        this.ingredient_occurence[filt] += 1;
                    }
                    this.vectorDict[filt] = 0;
                }
            }
        }
        this.save();
        this.stopWaitCB();
    }

    incrementWeightTop() {
        this.startWaitCB();
        for (let v = 0; v < Math.ceil(this.orderedRecipes.length / 4); ++v) {
            let ingredientDictionary = {};
            let rec = this.orderedRecipes[v];
            for (let x in Object.keys(rec['ingredients'])) {
                let ing = rec['ingredients'][x];
                let name = ing['name'];
                let cat = ing['category'];
                let filt = cleanIngredient(name, cat);
                if (filt != null && filt !== '') {
                    this.vectorDict[filt] += this.determineWeight(filt) / 2
                    // ingredientDictionary[filt] = 1;
                }
            }
            // for (let k in Object.keys(ingredientDictionary)) {
            // for (let k in ingredientDictionary) {
            //     let ing = ingredientDictionary[k];
            //     this.vectorDict[ing] += this.determineWeight(ing) / 2;
            // }
        }
        this.save();
        this.stopWaitCB();
    }

    incrementWeightUser(rec, rating) {
        this.startWaitCB();
        if (rating === 1) {
            this.loved_recipes.push(rec);
        } else {
            this.hated_recipes[rec['name']] = 2;
        }
        this.count += 1;
        for (let k in Object.keys(rec['ingredients'])) {
            let ing = rec['ingredients'][k];
            let name = ing['name'];
            let cat = ing['category'];
            let filt = cleanIngredient(name, cat);
            this.vectorDict[filt] += rating * this.determineWeight(filt);
        }

        let ingList = [];
        if (this.count % 10 === 0) {
            for (let k of Object.keys(this.vectorDict)) {
                ingList.push(k);
            }

            ingList.sort((a, b) => this.vectorDict[b] - this.vectorDict[a]);
            let bestIng = [...ingList].splice(Math.floor(8.5 * ingList.length / 10));
            let worstIng = [...ingList].splice(0, Math.ceil(2.5*ingList / 10));
            let toDelete = [];
            for (let k in Object.keys(this.data)) {
                let recipeIter = this.data[k];
                let score = this.positiveScore(recipeIter, bestIng, worstIng);
                if (score >= 0) {
                    if (this.hated_recipes[recipeIter['name']] >= 2) {
                        toDelete.push(recipeIter['name']);
                    } else if (this.hated_recipes[recipeIter['name']] >= 0) {
                        this.hated_recipes[recipeIter['name']] -= 1;
                    }
                } else {
                    if (!this.hated_recipes.includes(recipeIter['name'])) {
                        this.hated_recipes[recipeIter['name']] = 1;
                    } else {
                        toDelete.push(recipeIter['name']);
                    }
                }
            }
            console.log(toDelete);
            this.data = this.data.filter((x) => !toDelete.includes(x['name']));
        }
        console.log(this);
        this.save();
        this.stopWaitCB();
    }

    positiveScore(rec, best, worst) {
        let score = 0;
        for (let k in Object.keys(rec['ingredients'])) {
            let ing = rec['ingredients'][k];
            let filt = cleanIngredient(ing['name'], ing['category']);
            if (best.indexOf(filt) >= 0) {
                score += 1;
            } else if (worst.indexOf(filt) >= 0) {
                score -= 1;
            }
        }
        return score;
    }

}