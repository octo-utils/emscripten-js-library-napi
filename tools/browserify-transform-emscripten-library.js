"use strict";
const path = require("path");
const through = require("through2");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const template = require("@babel/template").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const buildExportConst = template(`
  export const NAME = TO_EXPORT;
`);

module.exports = function(filename, opts) {
  let content = ""
  return through((buf, enc, next) => {
    content = content + buf.toString();
    next();
  }, flush => {
    const ast = parse(content, { 
      sourceType: "module",
      plugins: [
        'objectRestSpread'
      ] 
    });

    const deps_map = new Map();
    let is_updated = false;

    traverse(ast, {
      ExportNamedDeclaration(declarationPath) {
        const declaration = declarationPath.get("declaration");
        const declarationParentPath = declarationPath.parentPath;
        const declarationScope = declarationParentPath.scope;

        if (declaration.isFunctionDeclaration()) {
          const functionName = declaration.get("id").node.name;
          const functionDepsName = functionName+"__deps";
          const body = declaration.get("body");
          body.traverse({
            Identifier(iden) {
              const idenName = iden.node.name;
              const idenParent = iden.getFunctionParent();
              if (
                (iden.key === "object" || iden.key === "callee") &&
                declarationScope.hasBinding(idenName, true) && 
                !idenParent.scope.hasOwnBinding(idenName)
              ) {
                const idenBinding = declarationScope.getBinding(idenName);

                if (idenBinding.path.parentPath.isImportDeclaration()) {
                  return;
                }
                iden.node.name = "_" + idenName;
                let deps = deps_map.get(functionDepsName);
                if (deps) {
                  if (!deps.includes(idenName)) {
                    deps.push(idenName);
                  }
                } else {
                  deps = [ idenName ]
                  deps_map.set(functionDepsName, deps);
                }

                const declarationDeps = buildExportConst({
                  NAME: t.identifier(functionDepsName),
                  TO_EXPORT: t.arrayExpression(deps.map(name => t.stringLiteral(name)))
                })

                if (declarationScope.hasBinding(functionDepsName, true)) {
                  const binding = declarationScope.getBinding(functionDepsName);
                  binding.path.parentPath.replaceWith(declarationDeps.declaration);
                } else {
                  const inserBeforePaths = declaration.insertBefore(declarationDeps);
                  declarationScope.registerDeclaration(inserBeforePaths[0]);
                }

                is_updated = true;
              }
            }
          });
        }
      }
    });

    if (is_updated) {
      const output = generate(ast);
      return flush(null, output.code)
    }

    return flush(null, content);
  })
}
