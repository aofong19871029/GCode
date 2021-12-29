import {Scanner} from './Scanner';

/**
 * Token 结构
 */
interface Token {
    type: string;
    value: string;
}

/**
 * 分词
 */
export class Tokenizer {

    scanner: Scanner;

    constructor(code: string) {
        this.scanner = new Scanner(code);
    }

    getNextToken(): Token {

        // 扫描注释，空格
        this.scanner.scanComments();

        let token;
        if (!this.scanner.eof()) {
            token = this.scanner.lex();
        }

        return token;
    }

}
