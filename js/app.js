/* 
There are sets of node ids which contain partly-contiguous ranges of node ids.
The first part of the exercise is to (in a language of your choice) model the
ranges in a space efficient manner.
An example set:
a/1, a/2, a/3, a/4, a/128, a/129, b/65, b/66, c/1, c/10, c/42
Secondly, given the model already developed, write an algorithm that will add
two sets, merging any overlapping ranges.
For example
Set A (same as example for part 1):
a/1, a/2, a/3, a/4, a/128, a/129, b/65, b/66, c/1, c/10, c/42
Set B:
a/1, a/2, a/3, a/4 a/5, a/126, a/127, b/100, c/2, c/3, d/1
Set A + Set B should contain:
a/1, a/2, a/3, a/4, a/5, a/126, a/127, a/128, a/129, b/65, b/66, b/100, c/1,
c/2, c/3, c/10, c/42, d/1
*/


var app = angular.module('cmed', [ ]);

app.controller('formCtrl', function($scope) {
    $scope.master = {
				    	setA: "a/1,a/2,a/3,a/4,a/128,a/129,b/65,b/66,c/1,c/10,c/42", 
				    	setB: "a/1,a/2,a/3,a/4,a/5,a/126,a/127,b/100,c/2,c/3,d/1"
				    };

    $scope.merge = function() {
    	
        var sepA 		= separateElem($scope.form.setA),
        	sepB 		= separateElem($scope.form.setB),
        	mergedSets 	= mergeSets(sepA, sepB);

        $scope.form.merged = readableSet(mergedSets);
        $scope.form.sorted = readableSet(quickSort(mergedSets, 0, mergedSets.length - 1));
    };

    $scope.reset = function() {
        $scope.form = angular.copy($scope.master);
    };
});

separateElem = function(mySet) {
	mySet = mySet.split(",");

	var separatedSet = [];

	mySet.forEach(function(val, index) {
		var elem = val.split('/');
		
		var newElem = {};
		newElem["key"] = elem[0];
		newElem["val"] = elem[1];
		separatedSet.push(newElem);
	});

	return separatedSet;
}

mergeSets = function(setA, setB) {
	var mergedSet = setA;

	for (var i = 0; i < setB.length; i++) {
		if (!existsInArray(setB[i], setA)) {
	        mergedSet.push(setB[i]);
	    }
	}

	return mergedSet;
}

existsInArray = function(node, setA) {
	return setA.some(function(arrVal) {
        return node["key"] == arrVal["key"] && node["val"] == arrVal["val"];
    });
}

// sort

quickSort = function(arr, left, right) {
    var len = arr.length,
        pivot,
        partitionIndex;


    if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);

        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
}

partition = function(arr, pivot, left, right) {
    var pivotValue = arr[pivot],
        partitionIndex = left;

    for (var i = left; i < right; i++) {
        if (compareNodes(arr[i], pivotValue)) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}

compareNodes = function(node1, node2) {
    var compare = node1['key'].localeCompare(node2['key']);
    if (compare == 1) {
        return false;
    }

    if (compare == -1) {
        return true;
    }

    if (parseInt(node1['val']) > parseInt(node2['val'])) {
        return false;
    }

    return true;

}

swap = function(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}


// end sort

readableSet = function(set) {
	var readable = [];

	for (var i = 0; i < set.length; i++) {
		readable.push(set[i]["key"] + "/" + set[i]["val"]);
	}

	return readable;
}