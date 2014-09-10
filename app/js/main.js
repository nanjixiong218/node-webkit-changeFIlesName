/**
 * Created by xu on 2014/9/5.
 */
 var loaded = function() {
    var when = require("when");
    var fs = require("fs");
    var path = require("path");
    var chooseFile = $("#chooseFile");
    var beginBtn = $("#begin");
    var dirPath;

    chooseFile.on("change", function () {
        dirPath = this.value.replace(/(.*\\).*$/, "$1");
        //alert(dirPath);
    });

    beginBtn.on("click", function () {

        var chooseExt = $(":checkbox[name='changedExt']:checked");
        var chooseExtArr = [];
        for(var i = 0,len=chooseExt.length;i<len;i++){
            chooseExtArr.push(chooseExt[i].value);
        }
        function isWithExt(file){
            var result =false;
            chooseExtArr.forEach(function(ext){
                if(file.indexOf("."+ext)!=-1){
                    result = true;
                }
            });
            return result;
        }
        var fileNamePre = $(":text[name='fileNamePre']");
        var fileNameExt = $(":radio[name='fileNameExt']:checked");
        /*
        //同步操作
        if (fs.statSync(dirPath).isDirectory()) {
             fs.readdirSync(dirPath).forEach(function(file,i){
                var oldName = path.join(dirPath,file);
                var newName = path.join(dirPath,Date.now()+i+".jpg");
                fs.renameSync(oldName,newName);
             });
             fs.readdirSync(dirPath).forEach(function(file,i){
                var oldName = path.join(dirPath,file);
                var newName = path.join(dirPath,"xu"+i+".jpg");
                fs.renameSync(oldName,newName);
             });
             alert("ok");
        }
        */
        /*等价的异步操作,顺序执行，注意重名覆盖问题，这种异步其实和同步无异，并没有真正的利用异步的特性
        fs.stat(dirPath,function (err,status) {
            if(status.isDirectory()){
                fs.readdir(dirPath,function(err,files){

                    (function next(i){//先重命名为当前时间戳
                        if(i<files.length){
                            console.log(files.length);
                            console.log(i);
                            var oldName = path.join(dirPath,files[i]);
                            var newName = path.join(dirPath,Date.now()+i+".jpg");
                            fs.rename(oldName,newName,function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    next(++i);
                                }
                            });
                        }else{
                            //这里是所有异步结束之后的操作
                            fs.readdir(dirPath,function(err,files){//再重命名为特定名字
                                (function next(i){
                                    if(i<files.length) {
                                        console.log(files.length);
                                        console.log(i);
                                        var oldName = path.join(dirPath, files[i]);
                                        var newName = path.join(dirPath, "xu" + i + ".jpg");
                                        fs.rename(oldName, newName, function (err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                next(++i);
                                            }
                                        });
                                    }else{

                                        alert("ok");
                                    }
                                })(0);
                            });
                        }

                    }(0));

                });
            }
        })
        */
        /*
        //这种异步才是真正的利用了异步，注意如果直接用时间戳会出现重名问题，
        // 同一时间戳可能已经完成数个文件的重命名，所以用到了时间戳加序号的方式
        //但是大家已经看出这种代码是多么的难看了！

        fs.stat(dirPath,function (err,status) {
            if(status.isDirectory()){
                fs.readdir(dirPath,function(err,files){
                    var times = 0;
                    (function next(i){//先重命名为当前时间戳
                        if(i<files.length){
                            console.log(files.length);
                            console.log(i);
                            var oldName = path.join(dirPath,files[i]);
                            var newName = path.join(dirPath,Date.now()+i+".jpg");
                            fs.rename(oldName,newName,function(err){
                                if(err){
                                    console.log(err);
                                }else{

                                   if(times==files.length-1){
                                       //这里是所有异步接受之后的操作

                                       fs.readdir(dirPath,function(err,files){
                                           var times = 0 ;
                                           (function next(i){
                                               if(i<files.length){
                                                   var oldName = path.join(dirPath,files[i]);
                                                   var newName = path.join(dirPath,"xu"+i+".jpg");
                                                   fs.rename(oldName,newName,function(err){
                                                       if(err){
                                                           console.log(err);
                                                       }else{
                                                           if(times==files.length-1){
                                                               alert("over!");
                                                           }else{
                                                               times++;
                                                           }

                                                       }
                                                   });
                                                   next(++i);
                                               }else{
                                                   alert("异步2启动完毕!");
                                               }
                                           })(0)
                                       });
                                   }else{
                                       times++;
                                   }

                                }
                            });
                            next(++i);
                        }else{
                            alert("异步1启动完毕!");
                        }
                    }(0));

                });
            }
        });
        */
        /*
        //forEach改写next IIFE形成第一版
        fs.stat(dirPath,function (err,status) {
            if(err){
                console.log(err);
                return;
            }
            if(status.isDirectory()){
                fs.readdir(dirPath,function(err,files){
                    if(err){
                        console.log(err);
                        return;
                    }
                    var times = 0;
                    files.forEach(function(file,i){
                            //console.log(files.length);//奇怪，为什么这里用console.log开始报错了？
                            //console.log(i);
                            if(isWithExt(file)){
                                var oldName = path.join(dirPath,file);
                                var newName = path.join(dirPath,Date.now()+i+"."+chooseExt.val());
                                fs.rename(oldName,newName,function(err){
                                    if(err){
                                        console.log(err);
                                    }else{

                                        if(times==files.length-1){
                                            //这里是所有异步接受之后的操作

                                            fs.readdir(dirPath,function(err,files){
                                                var times = 0 ;
                                                files.forEach(function(file,i){
                                                    if(isWithExt(file)){
                                                        var oldName = path.join(dirPath,file);
                                                        var newName = path.join(dirPath,fileNamePre.val()+i+"."+fileNameExt.val());
                                                        fs.rename(oldName,newName,function(err){
                                                            if(err){
                                                                console.log(err);
                                                            }else{
                                                                if(times==files.length-1){
                                                                    alert("over!");
                                                                }else{
                                                                    times++;
                                                                }
                                                            }
                                                        });
                                                    }else{
                                                        if(times==files.length-1){
                                                            alert("over!");
                                                        }else{
                                                            times++;
                                                        }
                                                    }

                                                });
                                            });
                                        }else{
                                            times++;
                                        }
                                    }
                                });
                            }else{
                                if(times==files.length-1){
                                    alert("over!");
                                }else{
                                    times++;
                                }
                            }


                    });
                });
            }
        })
        */
        //最佳方案，用promise或者用一些流行异步解决方案库，比如proxy，async，when,then等
        //这里选择whenjs
        var fStat = function (){
            var deferred = when.defer();
            fs.stat(dirPath,function (err,status){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(status);
                }
            });
            return deferred.promise;
        };
        var fReadDir = function () {
            var deferred = when.defer();
            fs.readdir(dirPath,function(err,files){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(files);
                }
            });
            return deferred.promise;
        };
        var fRename = function (oldname,newname){
            var deferred = when.defer();
            fs.rename(oldname,newname,function(err){
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(null);
                }
            });
            return deferred.promise;
        };
        var renameFilesToDateTime = function (files) {
            var deferreds = files.map(function(file,i){
                var oldName = "";
                var newName = "";
                if(isWithExt(file)) {
                    oldName = path.join(dirPath, file);
                    newName = path.join(dirPath, Date.now() + i + "." + chooseExt.val());
                }else{
                    oldName = path.join(dirPath, file);
                    newName = path.join(dirPath, file);
                }
                return fRename(oldName,newName);
            });
            return deferreds;
        };
        var renameFiles = function (files) {
            var deferreds = files.map(function(file,i){
                var oldName = "";
                var newName = "";
                if(isWithExt(file)) {
                    oldName = path.join(dirPath, file);
                    newName = path.join(dirPath, fileNamePre.val() + i + "." + fileNameExt.val());
                }else{
                    oldName = path.join(dirPath, file);
                    newName = path.join(dirPath, file);
                }
                return fRename(oldName,newName);
            });
            return deferreds;
        };
        var getFiles = function () {
            return fStat(dirPath).then(function(status){
                if(status.isDirectory()){
                    return fReadDir(dirPath);
                }else{
                    throw new Error("不是目录！");
                }
            })
        };
        /*when.all这两种用法都可以,感觉第一种更直观
        getFiles()
           .then(function(files){
               return when.all(renameFiles(files));
           })
           .then(function(){
                 alert("over!");
           })
           .otherwise(function(err){
            alert(err);
           });


        when.all(getFiles().then(renameFiles))
            .then(function(){
                alert("over!");
            })
            .otherwise(function(err){
                alert(err);
            });
        */

        getFiles()
            .then(function(files){
                return when.all(renameFilesToDateTime(files));
            })
            .then(function(){
                return getFiles();
            })
            .then(function(files){
                return when.all(renameFiles(files));
            })
            .then(function(){
                alert("over!");
            })
            .otherwise(function(err){
                alert(err);
            });
    });
};
window.onload = loaded;