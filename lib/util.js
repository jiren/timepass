
const Util = {
  processCLIArgs(args){
    var options = args.slice(2, args.length),
        result = {};

    for(let i = 0, l = options.length; i < l; i = i + 2){
      result[options[i]] = options[i+1];
    }

    return result; 
  }
  
}

module.exports = Util;
