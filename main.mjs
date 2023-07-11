// const someLibrary = require('some-library');
// import someLibrary from 'some-library';
// same import structure import is better because, of destructuring
//import {module}
import {readFile, writeFile} from "fs/promises";

/*import json.type("json") from "./config.json;
import ("config.json", {with: { type: "json" }});
make this work later*/


const test_market_data = await
JSON.parse(await readFile("./testfile.json")).data
//data is formatted as [itemID:{high,hightime,low,lowtime}] high is instant buy price, low is instant sell price
//console.log(read["2"])

const recipe_data = await JSON.parse(await readFile("./config.json"));
/*
config is formatted as [
    [
        ouput,
        [{inputs, number of inputs}],
        manual adjustment,
        type,
        speed_of_action],
    ]
types of processing are: farm, not farm, potion three
make it so that the items can be pairs of 2 or more, it's an array gottem
*/
const main_item_json = await 
JSON.parse(await 
    readFile("./main_item_data.json")
    );
/*
main_item_data is formatted as [
    {
        ItemName:{
            "id"
            "cost"
            "lowalch"
            "highalch"
       }
    }
]
*/
const buy_limits = await 
JSON.parse(await 
    readFile("./buy_limits.json")
    );
//the most sanely formated kappa [Item_name:buy limit]

class Input{
    /**
     * @typedef inputProps
     * @type {Array}
     * @property {int} id -id of item
     * @property {int} amount -amount of items
     *
     * @constructor
     * @param {inputProps} param0 inputProps
     *
     * @constructor
     * @param {int} 
     */
    constructor(input){
        if (typeof(input) != 'number'){
            this.id = input[0]
            this.amount = input[1]
        }else{
            this.id = input
            this.amount = 1
        }
        this.name = item_namer(this.id)
        this.high = test_market_data[this.id].high
        this.low = test_market_data[this.id].low
        this.average = (0+this.high+this.low)/2
        this.buy_limit = buy_limits[this.name]
    }  

}



function stonks(recipe, market_data){
    //the function wants to subtract the inputs of a recipies price from
    //the output of the recipies (last in the array), and how many you can buy for that recipie
    //net = output - input(s)
    //max inputs = inputs * buy limit
    //max outputs = max inputs/
    //total potential cost = max input(s)*buy limit
    //total gain = output - buy limit * inputs
    //coccurent?
    const {output, inputs, manual_adjustment, type} = recipe
    const output_price = (0 + market_data[output].high + market_data[output].low) / 2
    let input_price = 0
    for (const x of inputs){
        console.log("inputs",x)
        const temp = new Input(x)
        input_price += (1.01*temp.average)*temp.amount
    }
    if (type == 2){
        output_price
    }
    const net = (.99*output_price) - input_price - manual_adjustment
    return(net.toFixed(1))
    //recipe looks like [output,[inputs],manual adjustment]
}
class processed_data{
    constructor(item,net_value,inputs,buy_limits){;
    this.item = item;
    this.net_value = net_value;
    this.inputs = inputs;
    this.buy_limits = buy_limits;
    }
}

// this is a change
function buy_limit_finder(recipe){
    const work = recipe.inputs
    const out = []
    for (const x of work){
        //console.log(x)
        if (magic_iterator_check(x)){
            out.push(`${Math.floor(Number(buy_limits[item_namer(x[0]).name])/Number(x[1]))} ${item_namer(x[0]).name}s`)
        }else out.push(`${Number(buy_limits[item_namer(x).name])} ${item_namer(x).name}s`)
    }
    return out
}
function magic_iterator_check(check){
    if (typeof check[Symbol.iterator] === 'function'){
    return true
    }
    return false
}

function item_namer(itemid){
    //console.log(itemid)
    if (magic_iterator_check(itemid)){
        const output = []
        for (const x of itemid){
            if (typeof(x) === "number"){
                output.push(main_item_json[x].name)
            }else{output.push(`${x[1]} ${main_item_json[x[0]].name}s`)}
        }
        return output
   }else{
    return main_item_json[itemid]
   }
}

const output_json = []
for (const x of Object.values(recipe_data.items)){
    output_json.push(new processed_data(item_namer(x.output),stonks(x,test_market_data),item_namer(x.inputs),buy_limit_finder(x)))
    //console.log(output_json)
}
writeFile("./.output_file.json", JSON.stringify(output_json,null,2))

// const big_market_data = await 
// fetch('https://prices.runescape.wiki/api/v1/osrs/latest');
// const data = await big_market_data.json()

