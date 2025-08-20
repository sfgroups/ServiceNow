from xml.etree import ElementTree as ET

class SNXML:
    def __init__(self, xml_str, namespaces=None):
        self.root = None
        self.ns = namespaces or {}
        try:
            if xml_str and xml_str.strip():
                self.root = ET.fromstring(xml_str)
        except ET.ParseError as e:
            print(f"[ERROR] XML parsing failed: {e}")
            self.root = None

    def get_first_node(self, xpath):
        """Equivalent to getFirstNode(xpath)"""
        if not self.root:
            return None
        try:
            return self.root.find(xpath, self.ns)
        except Exception as e:
            print(f"[WARN] get_first_node failed for {xpath}: {e}")
            return None

    def get_nodes(self, xpath):
        """Equivalent to getNode(xpath) returning a list"""
        if not self.root:
            return []
        try:
            return self.root.findall(xpath, self.ns)
        except Exception as e:
            print(f"[WARN] get_nodes failed for {xpath}: {e}")
            return []

    def get_node_text(self, xpath, default=""):
        """Equivalent to getNodeText(xpath)"""
        try:
            el = self.get_first_node(xpath)
            return (el.text.strip() if el is not None and el.text is not None else default)
        except Exception as e:
            print(f"[WARN] get_node_text failed for {xpath}: {e}")
            return default

    def get_attribute(self, element, attr, default=""):
        """Equivalent to getAttribute(attributeName) on a node"""
        try:
            return element.get(attr, default) if element is not None else default
        except Exception as e:
            print(f"[WARN] get_attribute failed for {attr}: {e}")
            return default

soap_xml = "<invalid><xml>"  # Bad XML on purpose

doc = SNXML(soap_xml, namespaces={})

first_name = doc.get_node_text(".//ns:User/ns:FirstName", default="N/A")
print("First Name:", first_name)   # -> N/A, no crash

soap_xml = """<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                                xmlns:ns="http://example.com/ns">
  <soapenv:Body>
    <ns:GetUserResponse>
      <ns:User id="123" active="true">
        <ns:FirstName>Jane</ns:FirstName>
        <ns:LastName>Doe</ns:LastName>
      </ns:User>
    </ns:GetUserResponse>
  </soapenv:Body>
</soapenv:Envelope>"""

# Namespace map (like XMLDocument2 setNamespace)
ns = {
    "soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
    "ns": "http://example.com/ns"
}

doc = SNXML(soap_xml, namespaces=ns)

# Examples similar to XMLDocument2 usage
user_el = doc.get_first_node(".//ns:User")
first_name = doc.get_node_text(".//ns:User/ns:FirstName")
last_name  = doc.get_node_text(".//ns:User/ns:LastName")
user_id    = doc.get_attribute(user_el, "id")
is_active  = doc.get_attribute(user_el, "active")

print(first_name, last_name, user_id, is_active)
# -> Jane Doe 123 true

