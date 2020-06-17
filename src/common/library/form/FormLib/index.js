export function transform1To2Column(inputArray) {

    let resultArray = [];
    const itemCount = parseInt(Math.floor(inputArray.length / 2));
    for (let i = 0; i < itemCount; i++) {
        const Item = {
            Item1: inputArray[i * 2],
            Item2: inputArray[i * 2 + 1]
        }
        resultArray[i] = Item;
    }
    if (itemCount * 2 < inputArray.length) {
        const Item = {
            Item1: inputArray[inputArray.length - 1],
            Item2: {}
        }
        resultArray[itemCount] = Item;

    }
    return resultArray;
}

export function transform1To3Column(inputArray) {

    let resultArray = [];
    const itemCount = parseInt(Math.floor(inputArray.length / 3));
    for (let i = 0; i < itemCount; i++) {
        const Item = {
            Item1: inputArray[i * 3],
            Item2: inputArray[i * 3 + 1],
            Item3: inputArray[i * 3 + 2]
        }
        resultArray[i] = Item;
    }
    if (itemCount * 3 < inputArray.length) {

        const Item = {
            Item1: inputArray[itemCount * 3],
            Item2: {},
            Item3: {}
        }
        // console.log("itemCount*3 + 1", itemCount * 3 + 1);
        // console.log("inputArray.length", inputArray.length);
        if (itemCount * 3 + 1 < inputArray.length) {
            Item.Item2 = inputArray[itemCount * 3 + 1]
        }
        resultArray[itemCount] = Item;

    }
    return resultArray;
}

export function bindDataToControl(listElement, dataSource) {
    debugger;
    let listElement1 = listElement;
    //console.log("dataSource:", dataSource);
    //console.log("listElement:", listElement)
    if (typeof dataSource != "undefined") {
        listElement1 = listElement.map((elementItem) => {

            const elementvalue = dataSource[elementItem.DataSourceMember];
            if (typeof elementvalue != "undefined") {
                const newElementItem = Object.assign({}, elementItem, { value: elementvalue });
                return newElementItem;
            }
            return elementItem;
        });
    }
    //console.log("listElement1:", listElement1)
    return listElement1;
}

export function GetMLObjectData(mLObjectDefinition, formData, dataSource) {

    let MLObject = {};
    //console.log("dataSource:", dataSource);
    if (typeof dataSource != "undefined") {
        mLObjectDefinition.map((Item) => {
            //console.log("mLObjectDefinition item:", Item);
            //console.log("dataSource[Item.DataSourceMember]:", dataSource[Item.DataSourceMember]);
            if (dataSource[Item.DataSourceMember] != null) {
                //console.log("dataSource[Item.DataSourceMember]:", dataSource[Item.DataSourceMember]);
                MLObject = Object.assign({}, MLObject, { [Item.Name]: dataSource[Item.DataSourceMember] });
            }


        });
    }
    //console.log("formData:", formData);
    mLObjectDefinition.map((Item) => {
        const controlName = Item.BindControlName;
        //console.log();
        if (controlName.length > 0) {
            if (formData[controlName] != null) {
                MLObject = Object.assign({}, MLObject, { [Item.Name]: formData[controlName] });
            }
            else {

            }

        }
    });

    return MLObject;
}

export function GetModalFormData(mLObjectDefinition, formData, dataSource) {

    let ModalForm = {};
    //console.log("dataSource:", dataSource);
    if (typeof dataSource != "undefined") {
        mLObjectDefinition.map((Item) => {
            //console.log("mLObjectDefinition item:", Item);
            //console.log("dataSource[Item.DataSourceMember]:", dataSource[Item.DataSourceMember]);
            if (dataSource[Item.DataSourceMember] != null) {
                //console.log("dataSource[Item.DataSourceMember]:", dataSource[Item.DataSourceMember]);
                ModalForm = Object.assign({}, ModalForm, { [Item.Name]: dataSource[Item.DataSourceMember] });
            }


        });
    }
    //console.log("formData:", formData);
    mLObjectDefinition.map((Item) => {
        const controlName = Item.BindControlName;
        //console.log();
        if (controlName.length > 0) {
            if (formData[controlName] != null) {
                ModalForm = Object.assign({}, ModalForm, { [Item.Name]: formData[controlName] });
            }
            else {

            }

        }
    });

    return ModalForm;
}

export function GetMLObjectDataList(mLObjectDefinition, formData, dataSource) {

    let MLObjectList = [];
    let arrayLength = 0;
    Object.keys(formData).forEach(function(key) {

        const templength = Object.keys(formData[key]).length;
        if(templength > arrayLength)
        {
            arrayLength = templength;
        }
      
      });

    if(dataSource !=null)
    {
        if(dataSource.length > arrayLength)
            arrayLength = dataSource.length;
    }  

    // console.log("dataSource:", dataSource);
    
    for(let i = 0; i< arrayLength; i++)
    {
        let MLObject = {};
        mLObjectDefinition.map((Item) => {
            const controlName = Item.BindControlName;
           
            if(dataSource != null)
            {
                if(dataSource[i] != null)
                {
                    if(dataSource[i][Item.DataSourceMember] != null)
                    {
                        MLObject = Object.assign({}, MLObject, { [Item.Name]: dataSource[i][Item.DataSourceMember]});
                    }
                }
            }
            if (controlName.length > 0) {
               

                if (formData[controlName] != null) {
                    if(formData[controlName][i] !=null)
                    {
                        MLObject = Object.assign({}, MLObject, { [Item.Name]: formData[controlName][i].Value });
                    }
                    
                }
                else {
    
                }
    
            }
        });
        if(!isEmpty(MLObject))
            MLObjectList.push(MLObject);

    }

    

    return MLObjectList;
}

export function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}