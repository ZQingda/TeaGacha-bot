var unitIcons = require("../icons/unitIcons");

var columnSynonyms = [
  {
    name:"unit_name",
    synonym: ["name"],
    value_synonym: {}
  },
  {
    name:"class",
    synonym: ["class"],
    value_synonym: {
      engineer:["engi"],
      necromancer:["necro"],
      thief:[],
      elementalist:["ele"],
      warrior:["war"],
      ranger:[],
      mesmer:[],
      guardian:["guard"],
      revenant:["rev"]
    }
  },
  {
    name:"armor_class",
    synonym: ["armor"],
    value_synonym: {
      heavy:[],
      medium:[],
      light:[]
    }
  },
  {
    name:"combat_type",
    synonym: ["armor"],
    value_synonym: {
      melee:["dagger"],
      ranged:["bow"],
      magic:[]
    }
  },
];

var Filter = class {
  constructor() {
    this.ALL_COLUMNS=[];
    this.armor_class=[];
    this.combat_type=[];
    this.rank=[];
    this.class=[];
    this.unit_name=[];
  }

  getSQLWhere(){
    let operator = " AND "
    let filterColumns = ["armor_class", "combat_type", "rank", "class", "unit_name"];
    let sql = "";
    let values = [];
    for (var i = 0; i < filterColumns.length; i++) {
      let filterColumn = filterColumns[i];
      let filterValues = this[filterColumn];
      if( filterValues instanceof Array ){
        if(filterValues.length>0){
          sql += sql.length>0 ? operator : "";
          sql += filterColumn+" in ("+ "?,".repeat(filterValues.length).slice(0,-1)+ ")";
  
          values = values.concat(filterValues);
        }
      } else if (filterValues instanceof String){
        sql += sql.length>0 ? operator : "";
        sql += filterColumn+" = ?";
  
        values.push(filterValues);
      }
    }
    sql = sql.length==0? "" : "("+sql+")";
    return [sql, values]
  }
}






function accumulateFilterCriteria(result, lookupValue){
  if(!result.hasOwnProperty("ALL_COLUMNS")){
    result = new Filter();
  }

  //Check if lookup is an approved Icon.  If so Convert into db value and add to result.
  var lookupResult = unitIcons.getIconRankType(lookupValue);
  if (typeof(lookupResult) != "undefined"){
    result.rank.push(lookupResult);
    return result;
  }
  var lookupResult = unitIcons.getIconArmorType(lookupValue);
  if (typeof(lookupResult) != "undefined"){
    result.armor_class.push(lookupResult);
    return result;
  }
  var lookupResult = unitIcons.getIconCombatType(lookupValue);
  if (typeof(lookupResult) != "undefined"){
    result.combat_type.push(lookupResult);
    return result;
  }

  //It wasn't an icon so 
  var lowerLookupvalue = lookupValue.toLowerCase();
  let foundFilterValue = false;
  if(isNaN(lookupValue)){
    //Does not support number based filtering.
    for(let i=0; i<columnSynonyms.length; i++){
      let columnLookup = columnSynonyms[i];
  
      if(columnLookup.value_synonym.hasOwnProperty(lowerLookupvalue) ){
        foundFilterValue = true;
        result[columnLookup.name].push(lowerLookupvalue);
      }else{
        let k = Object.keys(columnLookup.value_synonym)
        .filter(key => columnLookup.value_synonym[key].indexOf(lowerLookupvalue)>=0)
        .forEach(value => 
          result[columnLookup.name].push(value)
        );
        console.log("Special Key:"+ k);
      }
    }
  }
  
  return result;
}


/**
 * 
 * @param {Array} args 
 */
function parseIntoFilters(args){
  return args.reduce(accumulateFilterCriteria, {});
}

module.exports = {
  parseIntoFilters: parseIntoFilters
}