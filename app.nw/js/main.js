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
        /*等价的异步操作,顺序执行，注意重名覆盖问题，这种异步其实和同步无异，并没有真正的利用异步的特性
        fs.stat(dirPath,function (err,status) {
            if(status.isDirectory()){
                fs.readdir(dirPath,function(err,files){

                    (function next(i){//先重命名为当前时间戳
                        if(i<files.length){
                            console.log(files.length);
                            console.log(i);
                            var oldName = path.join(dirPath,files[i]);
                            var newName = path.join(dirPath,Date.now()+".jpg");
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
        //这种异步才是真正的利用了异步，注意如果直接用时间戳会出现重名问题，
        // 同一时间戳可能已经完成数个文件的重命名，所以用到了时间戳加序号的方式
        //但是大家已经看出这种代码是多么的难看了！
        //这种用IIFE闭包的方式可以替换为forEach吧
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
        })
    });
};
window.onload = loaded;