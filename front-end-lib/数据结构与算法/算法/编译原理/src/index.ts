import {tokenize, parse} from './compiler'

const code = ` const answer = 42;`

const tokens = tokenize(code);
console.dir(tokens, { depth: 10 });

const ast = parse(tokens);
console.dir(ast, { depth: 10 });


