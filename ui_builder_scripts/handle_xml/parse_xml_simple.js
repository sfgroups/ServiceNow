var xmlString = '';

var xmlDoc = new XMLDocument2();
xmlString = xmlString.replace(/encoding=".*?"/, "");
xmlDoc.parseXML(xmlString);

var records = [];
var root = xmlDoc.getDocumentElement();

if (root) {
    var recNodes = root.getChildNodeIterator();
    while (recNodes.hasNext()) {
        var node = recNodes.next();

        if (node.getNodeName() === "Record") {
            var catId = "";
            var catName = "";
            var catStatus = "";

            var fieldNodes = node.getChildNodeIterator();
            while (fieldNodes.hasNext()) {
                var fieldNode = fieldNodes.next();
                var fieldId = fieldNode.getAttribute("id");

                // CAT ID
                if (fieldId === "52217") {
                    var subNodes = fieldNode.getChildNodeIterator();
                    while (subNodes.hasNext()) {
                        var sub = subNodes.next();
                        if (sub.getNodeName() === "Reference") {
                            catId = sub.getTextContent();
                        }
                    }
                }

                // CAT Name
                if (fieldId === "52223") {
                    catName = fieldNode.getTextContent().trim();
                }

                // Overall CAT Status
                if (fieldId === "52376") {
                    var subNodes2 = fieldNode.getChildNodeIterator();
                    while (subNodes2.hasNext()) {
                        var sub2 = subNodes2.next();
                        if (sub2.getNodeName() === "ListValues") {
                            var listNodes = sub2.getChildNodeIterator();
                            while (listNodes.hasNext()) {
                                var lv = listNodes.next();
                                if (lv.getNodeName() === "ListValue") {
                                    catStatus = lv.getTextContent().trim();
                                }
                            }
                        }
                    }
                }
            }

            // Collect result
            records.push({
                CAT_ID: catId,
                CAT_Name: catName,
                CAT_Status: catStatus
            });
        }
    }

    gs.info("Parsed records: " + JSON.stringify(records));
} else {
    gs.error("Failed to parse XML: root element is null");
}
