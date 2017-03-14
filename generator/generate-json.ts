import * as ts from "typescript";
import * as fs from "fs";
import * as _ from 'lodash';
import { parse } from 'acorn';
import { ClassDeclaration } from "typescript";


/** Generate documention for all classes in a set of .ts files */
function generateDocumentation(fileNames: string[], options: ts.CompilerOptions): void {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);

    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();

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
            o[p.key.name] = p.value.value || p.value.raw || p.value.name || p.value.type;
        }
        return o;
    }

    function visitMembers(members) {
        let fields = [];
        fields.push({ name : "id", type: "string", group: "default", description: "Entity id"})
        fields.push({ name : "created_at", type: "number", group: "default", description: "Creation datetime (unix)"})
        for (let m of members) {
            if (m.decorators && m.decorators.length == 1) {
                let d = _.trim(m.decorators[0].getFullText());
                if (_.startsWith(d, "@EntityField")) {
                    let l = "@EntityField(".length;
                    var e = d.substr(l, d.length - l - 1);
                    var result = parse('(' + e + ')');
                    var description: any = getDescription(result.body[0].expression.properties);
                    description.type = m.type ? _.trim(m.type.getFullText()) : "";
                    fields.push(description);
                }               
            }
        }

        return fields;
    }

    /** visit nodes finding exported classes */
    function visit(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            let cd = (<ClassDeclaration> node);
            if (isEntity(cd.heritageClauses)) {
                let entityName = cd.name.getFullText().trim();
                let fields = []
                let decs = visitMembers(cd.members);
                entities[entityName] = decs;
            }
        }
        return;
    }
}

generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});