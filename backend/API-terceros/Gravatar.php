
<?php
function get_gravatar($email, $size = 80, $default = 'mp', $rating = 'g') {
    $url = 'https://www.gravatar.com/avatar/';
    $url .= md5(strtolower(trim($email)));
    $url .= "?s=$size&d=$default&r=$rating";
    return $url;
}

?>
