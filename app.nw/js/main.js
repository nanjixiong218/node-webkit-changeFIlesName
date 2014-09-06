/**
 * Created by xu on 2014/9/5.
 */
define(function(require,exports,module){
    var fs = require("fs");
    var path = require("path");
    exports.init = function(){
        var $ = require("$");
        var chooseFile = $("#chooseFile");
        var chooseExt = $(":checkbox[name='changedExt']");
        var fileNamePre = $(":text[name='fileNamePre']");
        var fileNameExt = $(":radio[name='fileNameExt']");
        var beginBtn = $("#begin");
        var dirPath;
        chooseFile.on("change", function () {
            dirPath = this.value.replace(/(.*\\).*$/,"$1");
            alert(dirPath);
        });
        beginBtn.on("click",function(){
            if(fs.statSync(dirPath).isDirectory()){
                alert(1);
                /*
                fs.readdirSync(dirPath).forEach(function(file,i){
                    var oldName = path.join(dirPath,file);
                    var newName = path.join(dirPath,"xu"+i+".jpg");
                    fs.renameSync(oldName,newName);
                });
                alert("ok");
                */
            }
        });
    }
});