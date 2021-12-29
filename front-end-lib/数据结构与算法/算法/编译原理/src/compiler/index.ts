import {Tokenizer} from './Tokenizer'
import { Parser } from "./parser";

export function tokenize(code: string) {
    const tokenizer = new Tokenizer(code);
    const tokens: any = [];

    while (true) {
        // 迭代器
        let token = tokenizer.getNextToken();
        if (!token) {
            break;
        }
        tokens.push(token);
    }

    return tokens;

}

export function parse(tokens) {
    const parser = new Parser(tokens);

    return parser.parse();
}
