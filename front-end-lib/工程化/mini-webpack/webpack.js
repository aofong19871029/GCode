const fs =require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

// https://astexplorer.net/ AST语法树
// 直播到 1:11

/**
 *
 * @param {*} file 文件路径
 */
function getModuleInfo(file) {
    // 读取文件
    const body = fs.readFileSync(file, 'utf-8');

    // 代码字符串进行解析 编译ast
    const ast = parser.parse(body, {
        sourceType: 'module'
    });

    // 查找依赖 import
    const deps = {};
    traverse(ast, {
        // visitor 访问者
        ImportDeclaration({node}){
            const dirname = path.dirname(file)
            const absPath = './' + path.join(dirname, node.source.value).replace(/\\/g, '/') + '.js';
            deps[node.source.value] = absPath;
        }
    });

    // ES6转成ES5
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"],
    });

    const moduleInfo = {
        file,
        deps,
        code
    };
    return moduleInfo;
}



/**
 * 模块解析
 * @param file
 */
function parseModules(file) {
    const entry = getModuleInfo(file);
    const temp = [entry];
    const depsGraph = {}; //依赖图

    // 递归调用的过程
    getDeps(temp, entry);

    temp.forEach((moduleInfo) => {
        depsGraph[moduleInfo.file] = {
            deps: moduleInfo.deps,
            code: moduleInfo.code
        };
    });

    return depsGraph;
}

/**
 * 获取依赖
 * @param temp
 * @param deps
 */
function getDeps(temp, {deps}) {
    Object.keys(deps).forEach(key => {
       const child = getModuleInfo(deps[key]);
       temp.push(child);
       getDeps(temp, child);
    });
}


/**
 * 生成bundle文件
 * @param {*} file
 * @returns
 */
function bundle(file) {
    const depsGraph = JSON.stringify(parseModules(file));
    return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code);
            return exports
        };
        require('${file}');
    })(${depsGraph})`;
}


const content = bundle('./src/index2.js');
!fs.existsSync('./dist') && fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js', content)