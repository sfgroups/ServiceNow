var xmlString = '';

var xmlDoc = new XMLDocument2();
xmlDoc.parseXML(xmlString);

var records = [];
var root = xmlDoc.getDocumentElement();

function cleanKey(str) {
    return str.replace(/\s+/g, "_")   // spaces → underscores
              .replace(/[()]/g, "")   // remove parentheses
              .replace(/__+/g, "_");  // collapse multiple underscores
}

if (root) {
    var fieldMap = {};

    // Step 1: Build fieldId → clean name map
    var childNodes = root.getChildNodeIterator();
    while (childNodes.hasNext()) {
        var node = childNodes.next();
        if (node.getNodeName() === "Metadata") {
            var metaChildren = node.getChildNodeIterator();
            while (metaChildren.hasNext()) {
                var fdParent = metaChildren.next();
                if (fdParent.getNodeName() === "FieldDefinitions") {
                    var defs = fdParent.getChildNodeIterator();
                    while (defs.hasNext()) {
                        var def = defs.next();
                        if (def.getNodeName() === "FieldDefinition") {
                            var id = def.getAttribute("id");
                            var name = def.getAttribute("name") || def.getAttribute("alias");
                            fieldMap[id] = cleanKey(name);
                        }
                    }
                }
            }
        }
    }

    // Step 2: Process Record nodes
    var recNodes = root.getChildNodeIterator();
    while (recNodes.hasNext()) {
        var rec = recNodes.next();
        if (rec.getNodeName() === "Record") {
            var recordObj = {};
            var fieldNodes = rec.getChildNodeIterator();

            while (fieldNodes.hasNext()) {
                var fieldNode = fieldNodes.next();
                if (fieldNode.getNodeName() === "Field") {
                    var fieldId = fieldNode.getAttribute("id");
                    var key = fieldMap[fieldId] || fieldId;
                    var value = "";

                    var subNodes = fieldNode.getChildNodeIterator();
                    while (subNodes.hasNext()) {
                        var sub = subNodes.next();
                        if (sub.getNodeName() === "Reference") {
                            value = sub.getTextContent().trim();
                        } else if (sub.getNodeName() === "ListValues") {
                            var listNodes = sub.getChildNodeIterator();
                            while (listNodes.hasNext()) {
                                var lv = listNodes.next();
                                if (lv.getNodeName() === "ListValue") {
                                    value = lv.getTextContent().trim();
                                }
                            }
                        }
                    }

                    if (!value) {
                        value = fieldNode.getTextContent().trim();
                    }

                    recordObj[key] = value;
                }
            }

            records.push(recordObj);
        }
    }

    gs.info("Parsed records: " + JSON.stringify(records));
} else {
    gs.error("Failed to parse XML: root element is null");
}
