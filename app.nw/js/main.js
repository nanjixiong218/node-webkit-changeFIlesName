/**
 * Created by xu on 2014/9/5.
 */
define(function(require,exports,module){
    var $ = require("$");
    var chooseFile = $("#chooseFile");
    var chooseExt = $(":checkbox[name='changedExt']").val();
    var fileNamePre = $(":text[name='fileNamePre']").val();
    var fileNameExt = $(":radio[name='fileNameExt']").val();
    alert(fileNameExt);
    exports.init = function(){

    }
});