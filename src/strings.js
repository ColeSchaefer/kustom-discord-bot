module.exports = {
  GetString: function(lang, key) {
      let strings = require('../lang/' + lang + '.json');
      return strings[key];
  }  
};