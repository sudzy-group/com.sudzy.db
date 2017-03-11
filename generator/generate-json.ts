import * as ts from "typescript";
import * as fs from "fs";
import * as _ from 'lodash';
import { parse } from 'acorn';

interface DocEntry {
    name?: string,
    fileName?: string,
    documentation?: string,
    type?: string,
    constructors?: DocEntry[],
    parameters?: DocEntry[],
    decorators?: DocEntry[],
    returnType?: string
};

/** Generate documention for all classes in a set of .ts files */
function generateDocumentation(fileNames: string[], options: ts.CompilerOptions): void {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);

    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();

    let output: DocEntry[] = [];

    let entities = {}

    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, visit);
    }

    // print out the doc
    fs.writeFileSync("classes.json", JSON.stringify(entities, undefined, 4));

    return;

    function oneEntity(types) {
        if (!types) {
            return;
        }
        for (let t of types) {
            if (t.getFullText().trim() == "Entity") {
                return true;
            }
        }
        return false;
    }

    function isEntity(nodes) {
        if (!nodes) {
            return false;
        }
        for(let d of nodes) {
            if (d.types && oneEntity(d.types)) {
                return true
            }
        }

        return false;
    }

    function getDescription(properties) {
        let o = {}
        for (let p of properties) {
            o[p.key.name] = p.value.value || p.value.raw || p.value.name;
        }
        return o;
    }

    function visitMembers(members) {
        let fields = [];
        for (let m of members) {
            if (m.decorators && m.decorators.length == 1) {
                let d = _.trim(m.decorators[0].getFullText());
                if (_.startsWith(d, "@EntityField")) {
                    let l = "@EntityField(".length;
                    var e = d.substr(l, d.length - l - 1);
                    var result = parse('(' + e + ')');
                    fields.push(getDescription(result.body[0].expression.properties));
                }               
            }
        }
        return fields;
    }

    /** visit nodes finding exported classes */
    function visit(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            if (isEntity(node.heritageClauses)) {
                let entityName = node.name.getFullText().trim();
                let fields = []
                let decs = visitMembers(node.members);
                entities[entityName] = decs;
            }
        }
        return;
    }

    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol: ts.Symbol): DocEntry {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
        };
    }

    /** Serialize a class symbol infomration */
    function serializeClass(node: ts.ClassDeclaration) {
        let symbol = checker.getSymbolAtLocation(node.name);
        console.log(symbol.getName());
        return {};
        let details = serializeSymbol(symbol);
        // Get the construct signatures
        details.decorators = node.decorators.map(serializeDecorator);
        let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors = constructorType.getConstructSignatures().map(serializeSignature);

        return details;
    }

    function serializeDecorator(decorator: ts.Decorator) {
        let symbol = checker.getSymbolAtLocation(decorator.expression.getFirstToken());
        let decoratorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        let details = serializeSymbol(symbol);
        details.constructors = decoratorType.getCallSignatures().map(serializeSignature);
        return details;
    }

    /** Serialize a signature (call or construct) */
    function serializeSignature(signature: ts.Signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }

    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node: ts.Node): boolean {
        return (node.flags & ts.NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
}

generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});