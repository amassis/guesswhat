const { getPlural } = require('./plural');

const words = ['Animal', 'Country', 'Flower'];
const palavras = ['Animal', 'Pai', 'Flor', 'País', 'Ação'];

words.forEach((word) => console.log(getPlural(word, 'en_US')));
palavras.forEach((palavra) => console.log(getPlural(palavra, 'pt_BR')));
