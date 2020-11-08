let posTagger = require('wink-pos-tagger');

// eslint-disable-next-line no-unused-vars
function clean_pepper(name, category) {
    if (!name.includes("pepper") && !name.includes("jala") && !name.includes("chili") && !name.includes("chill")) {
        return name;
    } else {
        if (category === "Baking & Cooking") {
            if (name.includes("cayenn")) {
                return "cayenne"
            } else if (name.includes("black") || name.includes("white")) {
                return "black pepper"
            } else {
                return "chili powder"
            }
        } else if (category === "Produce") {
            if (name.includes("bell") || name.includes("sweet") || /peppers?/.exec(name) !== null) {
                return "sweet pepper"
            } else {
                return "hot pepper"
            }
        } else if (category === "Condiments") {
            if (name.includes('peppercorn')) {
                return 'black pepper'
            } else if (name.includes('pepper sauc') || name.includes('pepper paste')) {
                return 'hot sauce'
            } else if (name.includes('pepper')) {
                return 'hot pepper'
            }
        }
    }
    return name;
}

function reduce_categories(name, category) {
    if (category === 'Alcohol') {
        return 'alcohol'
    } else if (category === 'Seafood' && !name.includes('anchov')) {
        return 'seafoog'
    } else if (category === 'Coffee & Tea') {
        return 'coffee-tea'
    } else if (category === 'Frozen Desserts') {
        return 'frozen desserts'
    }
    return name;
}

function clean_dairy(name, category) {
    if (category !== 'Dairy') {
        return name;
    }

    if (name.includes('jack')) {
        return 'cheese'
    }
    if (name.includes('butter')) {
        if (name.includes('milk')) {
            return 'buttermilk'
        } else if (name.includes('cup')) {
            return 'buttercup'
        } else if (name.includes('apple')) {
            return 'apple butter'
        } else if (name.includes('peanut') || name.includes('almond') || name.includes('cashew')) {
            return 'nut butter'
        } else {
            return 'butter'
        }
    } else if (name.includes('milk')) {
        if (name.includes('coconut')) {
            return 'coconut milk';
        } else if (name.includes('nut') || name.includes('cashew') || name.includes('almond')) {
            return 'nut milk';
        }
    }
    return name;
}

function clean_starches(name, category) {
    if (name.includes('starch')) {
        return 'starch'
    }
    return name;
}

function clean_nuts(name, category) {
    if (category === 'Dairy') {
        return name;
    }
    if (name.includes('coconut')) {
        return 'coconut';
    } else if (name.includes('pecan') || name.includes('cashew') ||
        name.includes('almond') || name.includes('pistachio') ||
        name.includes('nut')) {
        return 'nut';
    }
    return name;
}

function clean_oils(name, category) {
    if (name.includes('spray') && !name.includes('olive')) {
        return 'cooking oil'
    } else if (name.includes('oil)')) {
        if (name.includes('olive')) {
            return 'olive oil';
        } else if (name.includes('canola') || name.includes('sesame') || name.includes('cooking')) {
            return 'cooking oil';
        }
    }
    return name;
}

function clean_nlp(name, category) {
    let tagger = posTagger();
    let verb_pos = ['VB', 'VBD', 'VBG', 'VBN', 'VBD', 'VBZ'];
    let pos = tagger.tagSentence(name);
    let cleaned_pos = pos.filter(word => !verb_pos.includes(word.pos));
    let cleaned_word = cleaned_pos.map(word => word.value);
    return cleaned_word.join(' ');
}

function clean_tokens(name, category) {
    let tokens = {
        'garlic': (category === 'Baking & Cooking') ? 'garlic powder' : 'garlic',
        'onion': (category === 'Baking & Cooking') ? 'onion powder' : 'onion',
        'shallot': 'shallot',
        'salt': 'salt',
        'stock': 'stock',
        'broth': 'stock',
        'gravy': 'stock',
        'bouillon': 'stock',
        'soup': 'stock',
        'cheese': 'cheese',
        'mozzarella': 'cheese',
        'cheddar': 'cheese',
        'ricotta': 'cheese',
        'milk': 'milk',
        'heavy cream': 'heavy cream',
        'whipping cream': 'heavy cream',
        'sour cream': 'sour cream',

        'parme': 'cheese',
        'mushroom': 'mushroom',
        'shiitake': 'mushroom',
        'cabbage': 'cabbage',
        'lettuce': 'lettuce',
        'tomato': 'tomato',
        'marinara': 'tomato',
        'vinegar': 'vinegar',
        'bean': 'beans',
        'soy': 'soy',
        'egg': 'eggs',
        'crumb': 'crumbs',
        'apple': 'apple',
        'basil': 'basil',
        'anchov': 'anchovy',
        'syrup': 'syrup',
        'oat': 'oats',
        'waffl': 'waffle',
        'cereal': 'cereal',
        'molass': 'syrup',
        'guacamole': 'avocado',
        'avocado': 'avocado',
        'hot sauce': 'hot sauce',
        'tabasco': 'hot sauce',
        'mayo': 'mayonnaise',
        'mustard': 'mustard',
        'pickle': 'pickles',
        'jam': 'jam',
        'dressing': 'dressing',
        'worchestire': 'worchestire sauce',
        'worcestershire': 'worchestire sauce',
        'sour sauce': 'sweet and sour sauce',
        'margarin': 'margarin',

        'radish': category === 'Condiments' ? 'horse radish' : name,
        'relish': 'relish',
        'olive': 'olives',
        'teriyaki': 'teriyaki',
        'barbeque': 'bbq',
        'bbq': 'bbq',
        'yogurt': 'yogurt',
        'peppercorn': 'black pepper',
        'curry': 'curry',
        'corn\\s?flakes?': 'cereal',
        'hash': '',
        'corn': 'corns',
        'vegetable': 'vegetables',
        'cole\\s?slaw': 'cole slaw',
        'ranch': 'ranch',
        'hummus': 'hummus',
        'garbanzo': 'hummus',
        'chick\\s?pea': 'hummus',
        'pineappl': 'pineapple',
        'brocc': 'broccoli',
        'cauli': 'cauliflower',
        'potato': '',
        'rice': '',
    };

    for (let token in tokens) {
        let r = RegExp(token);
        if (r.exec(name) != null) {
            return tokens[token];
        }
    }
    return name;
}

function clean_redundant(name, category) {
    let redundant = [
		'ground',
		'fresh',
		'crushed',
		'powder',
		'granulated',
		'hungarian',
		'dried',
		'leaves',
		'extra',
		'virgin',
		'roasted',
		'pure',
		'extra virgin',
		'flakes',
		'seeds',
		'fine',
		'neutral',
		'smoked',
		'kosher',
		'cracked',
		'dehydrated',
		'red',
		'hot',
		'dry',
		'dark',
		'brown',
		'crushed',
		'Diamond',
		'Crystal',
		'light',
		'brown',
		'sorghum',
		'white',
		'coarse',
		'toasted',
		'blanched',
		'threads',
		'freshly',
		'all purpose',
		'warm',
		'hot',
		'filtered',
		'juice',
		'orange',
		'sprouts',
		'head',
		'minced',
		'hearts',
		'roma',
		'chopped',
		'spring',
		'wedge',
		'small',
		'sweet',
		'green',
		'floret',
		'baby',
		'baking',
		'medium',
		'leaves',
		'leaf',
		'garnish',
		'chips',

		'slices',
		'whole',
		'ripe',
	];
    for (let word in redundant) {
        if (name.includes(word)) {
            name = name.replace(word, '');
        }
    }
    return name;
}

function remove_category(category) {
    let to_remove = [
        'Meat',
        'Bakery',
        'Floral',
        'Packaged Meals & Side Dishes',
        'Soy Products',
        'Pharmacy & First-Aid',
        'Other',
        'null',
    ];
    return to_remove.includes(category)
}


function cleanIngredient(name, category) {
    if (remove_category(category)) {
        return null;
    }

    let filters = [
		clean_pepper,
		clean_starches,
		clean_dairy,
		clean_oils,
		reduce_categories,
		clean_tokens,
		clean_nuts,
        clean_redundant,
		clean_nlp,
    ];
    for (let filter in filters) {
        let cleaned_name = filters[filter](name, category);
        if (cleaned_name !== name) {
            return cleaned_name === '' ? null : cleaned_name;
        }
    }
    return name;
}


export default cleanIngredient;
