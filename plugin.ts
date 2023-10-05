import { readFileSync } from "fs";
import ts from "typescript";

const regexEscapedValuesOnJsx = /\{([^}]+)\}/g;

const hasSafeAttribute = async (node: ts.Node) => {
  return await new Promise<boolean>(r => {
    node.forEachChild(node => {
      if(node.kind === ts.SyntaxKind.JsxAttributes) {
        node.forEachChild(node => {
          if(node.kind === ts.SyntaxKind.JsxAttribute) {
            const { name } = node as ts.JsxAttribute
            r(name.getText() === 'safe')
          }
        })
      }
    })
    r(false)
  })
}

export function delint(sourceFile: ts.SourceFile) {
  delintNode(sourceFile);

  function delintNode(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.JsxElement:
        const [ jsxOpeningElementNode, syntaxListNode ] = node.getChildren()
        const hasJsxExpression = syntaxListNode.getChildren().some(node => node.kind === ts.SyntaxKind.JsxExpression)
        if(!hasJsxExpression) break

        hasSafeAttribute(jsxOpeningElementNode).then(hasSafeAttribute => {
          if(!hasSafeAttribute) report(jsxOpeningElementNode, 'Should be has a `safe` attribute')
        })
        break
    }

    ts.forEachChild(node, delintNode);
  }

  function report(node: ts.Node, message: string) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
  }
}

const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
  // Parse a file
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );

  // delint it
  delint(sourceFile);
});
