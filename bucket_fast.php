<?php

$referer=$_SERVER["HTTP_REFERER"];
$validator="https://".$_SERVER["SERVER_NAME"]."/";
strpos($referer,$validator) === 0 or die("!");

$params = json_decode(urldecode(filter_input(INPUT_SERVER, "QUERY_STRING")),true);

$ch = curl_init(getenv("ebrains_bucket").$params["filename"].(strpos($params["filename"], "?")===false?"?":"&")."redirect=false");
curl_setopt_array($ch, array(
    CURLOPT_HTTPHEADER => array(
        "Accept: application/json",
        "Authorization: Bearer " . $params["token"]
    )
));
curl_exec($ch);
curl_close($ch);
