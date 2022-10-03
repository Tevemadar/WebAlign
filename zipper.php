<?php
ob_start();

$referer=$_SERVER["HTTP_REFERER"];
$validator="https://".$_SERVER["SERVER_NAME"]."/";
strpos($referer,$validator) === 0 or die("!");

$zipfile=tempnam(sys_get_temp_dir(), "zip");
unlink($zipfile);
if($_FILES["zip"]["size"]>0){
    move_uploaded_file($_FILES["zip"]["tmp_name"], $zipfile);
}
$zip=new ZipArchive();
$zip->open($zipfile, ZipArchive::CREATE);
$zip->addFile($_FILES["flat"]["tmp_name"], $_FILES["flat"]["name"]);
$zip->close();
readfile($zipfile);
unlink($zipfile);
