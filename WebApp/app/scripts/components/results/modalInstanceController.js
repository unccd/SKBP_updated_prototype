unccdApp.controller('ModalInstanceController', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.currentResultItem    = items;

    $scope.selected = {
        item: $scope.items
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    //Shows the formatted versions of the value received as parameter
    $scope.getFormattedVersion  = function (resultValue) {
        var formattedValue  = '';
        if(Array.isArray(resultValue)){
            for(var i = 0; i < resultValue.length; i++){
                if(i !== 0){
                    formattedValue = formattedValue + ', ';
                }
                formattedValue = formattedValue + resultValue[i];
            }
            return formattedValue;
        }
        else{
            return resultValue;
        }
    };
});