/**
 * Created by xu on 2014/9/5.
 */
 var loaded = function() {
    var fs = require("fs");
    var path = require("path");
    var when = require("when");
    var chooseFile = $("#chooseFile");
    var chooseExt = $(":checkbox[name='changedExt']");
    var fileNamePre = $(":text[name='fileNamePre']");
    var fileNameExt = $(":radio[name='fileNameExt']");
    var beginBtn = $("#begin");
    var dirPath;

    chooseFile.on("change", function () {
        dirPath = this.value.replace(/(.*\\).*$/, "$1");
        alert(dirPath);
    });
    beginBtn.on("click", function () {

        /*同步操作
        if (fs.statSync(dirPath).isDirectory()) {
             fs.readdirSync(dirPath).forEach(function(file,i){
             var oldName = path.join(dirPath,file);
             var newName = path.join(dirPath,"xu"+i+".jpg");
             fs.renameSync(oldName,newName);
             });
             alert("ok");
        }
        */
        //等价的异步操作,顺序执行，文件会莫名其妙变少
        fs.stat(dirPath,function (err,status) {
            if(status.isDirectory()){
                fs.readdir(dirPath,function(err,files){
                    (function next(i){
                        if(i<files.length){
                            console.log(files.length);
                            console.log(i);
                            var oldName = path.join(dirPath,files[i]);
                            var newName = path.join(dirPath,"xu"+i+".jpg");
                            fs.rename(oldName,newName,function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    next(++i);
                                }
                            });
                        }else{
                            alert("ok");
                        }

                    }(0));

                });
            }
        })

    });
};
window.onload = loaded;