export function toJSON(theXML) {
    let children = [...theXML.children];
    
    // base case for recursion. 
    if (!children.length) {
      return theXML.innerHTML
    }
    
    // initializing object to be returned. 
    let jsonResult = {};
    
    for (let child of children) {
      
      // checking is child has siblings of same name. 
      let childIsArray = children.filter(eachChild => eachChild.nodeName === child.nodeName).length > 1;
  
      // if child is array, save the values as array, else as strings. 
      if (childIsArray) {
        if (jsonResult[child.nodeName] === undefined) {
          jsonResult[child.nodeName] = [toJSON(child)];
        } else {
          jsonResult[child.nodeName].push(toJSON(child));
        }
      } else {
        jsonResult[child.nodeName] = toJSON(child);
      }
    }
    
    return jsonResult;
}

export function toXML(jsonObj) {
    const xmlDoc = document.implementation.createDocument('', '', null);

    function buildXML(json, parent) {
        if (typeof json === 'string' || typeof json === 'number') {
            parent.appendChild(xmlDoc.createTextNode(json.toString()));
            return;
        }

        for (const key in json) {
            const value = json[key];

            if (Array.isArray(value)) {
                value.forEach(item => {
                    const childElement = xmlDoc.createElement(key);
                    buildXML(item, childElement);
                    parent.appendChild(childElement);
                });
            } else if (typeof value === 'object') {
                const childElement = xmlDoc.createElement(key);
                buildXML(value, childElement);
                parent.appendChild(childElement);
            } else {
                const childElement = xmlDoc.createElement(key);
                childElement.textContent = value;
                parent.appendChild(childElement);
            }
        }
    }

    // Create a temporary root element to hold all top-level nodes
    const tempRoot = xmlDoc.createElement('tempRoot');
    buildXML(jsonObj, tempRoot);

    // Serialize each child node separately to omit the root
    const xmlSerializer = new XMLSerializer();
    let xmlString = '';
    tempRoot.childNodes.forEach(node => {
        xmlString += xmlSerializer.serializeToString(node);
    });

    return xmlString;
}

