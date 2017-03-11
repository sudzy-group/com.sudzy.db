var _ = require("lodash");
var table = require('markdown-table');
var entities = require( "./classes.json" );

const headers = ["Field Name", "Field Type", "Group", "Description", "Comments"];
_.forIn(entities, function(properties, name) {
    console.log("# " + name);
    var t = [headers];
    _.each(properties, function(prop) {
        var comments = [];
        prop.validate && comments.push("Validated");
        prop.search_by && comments.push( "Searchable");
        prop.name == "id" && comments.push("Auto-generated")
        prop.name == "created_at" && comments.push("Auto-generated")
        t.push([prop.name,'`' + prop.type + '`', prop.group, prop.description, comments.join(", ")]);
    })
    console.log(table(t));
})
