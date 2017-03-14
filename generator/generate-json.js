"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
var _ = require("lodash");
var acorn_1 = require("acorn");
/** Generate documention for all classes in a set of .ts files */
function generateDocumentation(fileNames, options) {
    // Build a program using the set of root file names in fileNames
    var program = ts.createProgram(fileNames, options);
    // Get the checker, we will use it to find more about classes
    var checker = program.getTypeChecker();
    var entities = {};
    // Visit every sourceFile in the program
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
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
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var t = types_1[_i];
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
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var d = nodes_1[_i];
            if (d.types && oneEntity(d.types)) {
                return true;
            }
        }
        return false;
    }
    function getDescription(properties) {
        var o = {};
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var p = properties_1[_i];
            o[p.key.name] = p.value.value || p.value.raw || p.value.name || p.value.type;
        }
        return o;
    }
    function visitMembers(members) {
        var fields = [];
        fields.push({ name: "id", type: "string", group: "default", description: "Entity id" });
        fields.push({ name: "created_at", type: "number", group: "default", description: "Creation datetime (unix)" });
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var m = members_1[_i];
            if (m.decorators && m.decorators.length == 1) {
                var d = _.trim(m.decorators[0].getFullText());
                if (_.startsWith(d, "@EntityField")) {
                    var l = "@EntityField(".length;
                    var e = d.substr(l, d.length - l - 1);
                    var result = acorn_1.parse('(' + e + ')');
                    var description = getDescription(result.body[0].expression.properties);
                    description.type = m.type ? _.trim(m.type.getFullText()) : "";
                    fields.push(description);
                }
            }
        }
        return fields;
    }
    /** visit nodes finding exported classes */
    function visit(node) {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            var cd = node;
            if (isEntity(cd.heritageClauses)) {
                var entityName = cd.name.getFullText().trim();
                var fields = [];
                var decs = visitMembers(cd.members);
                entities[entityName] = decs;
            }
        }
        return;
    }
}
generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});
