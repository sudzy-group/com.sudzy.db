var _ = require("lodash");
var table = require('markdown-table');
var entities = require( "./classes.json" );

const headers = ["Field Name", "Field Type", "Group", "Description", "Comments"];
_.forIn(entities, function(properties, name) {
    console.log("# " + name);
    var t = [headers];
    _.each(properties, function(prop) {
        t.push([prop.name,'`' + prop.type + '`', prop.group, prop.description, prop.validate ? "Validated" : ""]);
    })
    console.log(table(t));
})
