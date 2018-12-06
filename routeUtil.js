
function getArrData(arrIn, itemFunction) {
    let promise;
    let arr = arrIn;
    if(arr.length == 0) {
        promise = new Promise(resolve => { resolve(arr); });
    }
    else
    {
        for(let i = 0; i < arr.length; i++) {
            if(i == 0) {
                promise = itemFunction(arr[0]);
                continue;
            }
            promise = promise.then(data => {
                arr[i - 1] = data;
                return itemFunction(arr[i]);
            });
        }
        promise = promise.then(data => {
            arr[arr.length - 1] = data;
            return Promise.resolve(arr);
        });
    }
    return promise;
}

function forEach(arrIn, itemFunction) {
    let promise;
    let arr = arrIn;
    if(arr.length == 0) {
        promise = new Promise(resolve => { resolve(); });
    }
    else
    {
        for(let i = 0; i < arr.length; i++) {
            if(i == 0) {
                promise = itemFunction(arr[0]);
                continue;
            }
            promise = promise.then(() => {
                return itemFunction(arr[i]);
            });
        }
    }
    return promise;
}

function obfuscateUser(user) {
    const userObj = {
        _id: user._id,
        name: user.name,
        email: user.email,
        school: user.school,
        courses: user.courses,
        assignments: user.assignments,
        groups: user.groups
    };
    return userObj;
}

module.exports = {
    getArrData,
    obfuscateUser,
    forEach
};
