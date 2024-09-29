//runGame(typeId, elementId, operation='goLeft')

//read Type
//read Element
//// if operation != guess
////// define operation (guess, askLeft, askRight)

//// RENDER question w/ nextnodeYes, nextnodeNo, operation
////// if operation == guess
//////// question=guess
//////// answer is yes => runGameSuccess
//////// answer is no => runGameLearn
////// if operation != guess
//////// question=element.question
//////// answer is yes => runGame nextnodeYes with operation
//////// answer is no => runGame nextnodeNo with operation

// Ask for Type
// Read Type Initial Element
// Ask question
// get Answer
// if answer true
//// check leftNode
////// if null, unknow Element, insert new after curEl for true
////// if id === current_id, found, I won
////// else go to 3
// if answer is false
//// check rightNode
////// if null, unknow Element, insert new after curEl for false
////// if id === current_id, found, I won
////// else go to 3

// insert new after curEl
// ask which element?
// ask what question to identify
// create element
// ask answer for element?
// if true leftNode = element.id; rightNode = null
// if false rightNode = element.id; leftNode = null
// curEl leftNode = element.id


if(op=guessR) op=final; goyes = success; gono = learn;
if(direita) if(direita=from op=guessR; go=direita; from=from; current) op=askD; go=direita; from=current; current
if(esquerda) op=askE; go=esquerda; from=current; current