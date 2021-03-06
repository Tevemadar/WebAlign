<?php
ob_start();

$token_params = http_build_query(array(
    "grant_type" => "authorization_code",
    "code" => filter_input(INPUT_GET, "code"),
    "redirect_uri" => getenv("ebrains_redirect_wa"),
    "client_id" => getenv("ebrains_id_wa"),
    "client_secret" => getenv("ebrains_secret_wa")
        ));
$token_ch = curl_init(getenv("ebrains_token"));
curl_setopt_array($token_ch, array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $token_params
));
$token_res = curl_exec($token_ch);
curl_close($token_ch);
$token_obj = json_decode($token_res, true);
$token = $token_obj["access_token"];

$json= json_decode(urldecode(filter_input(INPUT_GET, "state")), true);
$json["token"]=$token;
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <script>
            let bucket=<?php
            $ch = curl_init(getenv("ebrains_bucket") . $json["clb-collab-id"] . "?delimiter=/");
            curl_setopt_array($ch, array(
                CURLOPT_HTTPHEADER => array(
                    "Accept: application/json",
                    "Authorization: Bearer " . $token
                )
            ));
            $res = curl_exec($ch);
            curl_close($ch);
            ?>;
            let state=<?php echo json_encode($json);?>;
            function startup(){
                let tbody=document.getElementById("bucket-content");
                for(let item of bucket.objects)
                    if(item.content_type==="application/json")
                        tbody.innerHTML+="<tr><td><a href='#"+item.name+"' onclick='clicky(event)'>"+item.name+"</a></td><td>"+item.bytes+"</td><td>"+item.last_modified+"</td></tr>";
            }
            function clicky(event){
                state.filename=event.target.innerText;
                location.href="webalign.html?"+encodeURIComponent(JSON.stringify(state));
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
        <button onclick="location.href='newseries.html?<?php echo urlencode(json_encode($json));?>'">Create new series</button>
    </body>
</html>
