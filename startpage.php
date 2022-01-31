<?php
ob_start();

$token_base = "https://iam.ebrains.eu/auth/realms/hbp/protocol/openid-connect/token";
$token_params = http_build_query(array(
    "grant_type" => "authorization_code",
    "code" => filter_input(INPUT_GET, "code"),
    "redirect_uri" => getenv("redirect_uri"),
    "client_id" => getenv("client_id"),
    "client_secret" => getenv("client_secret")
        ));
$token_ch = curl_init($token_base);
curl_setopt_array($token_ch, array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $token_params
));
$token_res = curl_exec($token_ch);
curl_close($token_ch);
$token_obj = json_decode($token_res, true);
$token = $token_obj["access_token"];
$bearer = "Bearer " . $token;
//setcookie("bucket-bearer", $bearer, array('secure' => true, 'httponly' => true, 'samesite' => 'None'));
header("Set-Cookie: bucket-bearer=$bearer; Secure; HttpOnly; SameSite=None");
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <script>
            let bucket=<?php
            $ch = curl_init("https://data-proxy.ebrains.eu/api/buckets/" . filter_input(INPUT_COOKIE, "clb-collab-id") . "?delimiter=/");
            curl_setopt_array($ch, array(
                CURLOPT_HTTPHEADER => array(
                    "Accept: application/json",
                    "Authorization: " . $bearer
                )
            ));
            $res = curl_exec($ch);
            curl_close($ch);
            ?>;
            function startup(){
                let tbody=document.getElementById("bucket-content");
                for(let item of bucket.objects)
                    if(item.content_type==="application/json")
                        tbody.innerHTML+="<tr><td><a href=\"webalign.html?filename="+item.name+"\">"+item.name+"</a></td><td>"+item.bytes+"</td><td>"+item.last_modified+"</td></tr>";
            }
        </script>
    </head>
    <body onload="startup()">
        <table>
            <thead>
                <tr><th>Filename</th><th>Size</th><th>Modified</th></tr>
            </thead>
            <tbody id="bucket-content"></tbody>
        </table>
        <hr>
        <button onclick="location.href='newseries.html'">Create new series</button>
    </body>
</html>
