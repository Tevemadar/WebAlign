<?php
ob_start();
strpos($_SERVER["HTTP_REFERER"],
       $_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"].str_replace("zipper.php", "webalign.html?", $_SERVER["REQUEST_URI"])) === 0 or die("!");
$zipfile=tempnam(sys_get_temp_dir(), "zip");
if($_FILES["zip"]["size"]>0){
    move_uploaded_file($_FILES["zip"]["tmp_name"], $zipfile);
}
$zip=new ZipArchive();
$zip->open($zipfile, ZipArchive::CREATE);
$zip->addFile($_FILES["flat"]["tmp_name"], $_FILES["flat"]["name"]);
$zip->close();
readfile($zipfile);
unlink($zipfile);
