<?php 

// retrieve variables for calculus
if ($_SERVER["REQUEST_METHOD"] == "GET") {
  
  $x_string = $_GET["pointX"];
  $y_string = $_GET["pointY"];

  $scale_string = $_GET["scale"];

  if (is_exceeds_length($x_string) || is_exceeds_length($y_string) || is_exceeds_length($scale_string)) {
    http_response_code(422);
    return;
  }
   
  if ((! is_numeric($x_string)) || (! is_numeric($y_string)) || (! is_numeric($scale_string))) {
    http_response_code(422);
    return;
  }

  $x = floatval($x_string);
  $y = floatval($y_string);
  $scale = floatval($_GET["scale"]);


  if(!checkArguments($x, $y, $scale)) {
    http_response_code(422);
    return;
  }


  
  // save timestamp of start of execution
  $current_time = date("Y-m-d h:i:s");
  
  $start_exec = microtime(1);
  // check if point intersects
  $intersects = intersects($x / $scale, $y / $scale);
  $execution_time = microtime(1) - $start_exec;

  $response .= $x .= ";";
  $response .= $y .= ";";
  $response .= $scale .= ";";
  $result = $intersects ? "Intersects" : "Not intersects";
  $response .= $result .= ";";
  $response .= $current_time .= ";";
  $response .= $execution_time;

  echo $response;

  return;
}

function intersects($x, $y) : bool {
  if ($x >= 0 && $y >= 0) {
    return intersectsTopRight($x, $y);
  } elseif ($x >= 0 && $y <= 0) {
    return intersectsBottomRight($x, $y);
  } elseif ($x <= 0 && $y <= 0) {
    return intersectsBottomLeft($x, $y);
  } else {
    return false;
  }
}

function intersectsTopRight($x, $y) : bool {
  return abs($x) + abs($y) < 1;
}

function intersectsBottomRight($x, $y) : bool {
  return sqrt($x**2 + $y**2) < 0.5;
}

function intersectsBottomLeft($x, $y) : bool {
  return abs($x) < 0.5 && abs($y) < 1;
}

// true means ok
function checkArguments($x, $y, $scale) : bool {
  return checkX($x) && checkY($y) && checkScale($scale);
}


function checkX($x) : bool {
  $x_valid_values = range(-3, 6);
  return in_array($x, $x_valid_values, false);
}

function checkY($y) : bool {
  return (-3 <= $y) && ($y <= 5);
}

function checkScale($scale) : bool {
  $scale_valid_values = range(1, 3, 0.5);
  return in_array($scale, $scale_valid_values, false);
}

function is_exceeds_length($s) : bool {
  $MAX_FLOAT_LENGTH = 15;
  return strlen($s) > $MAX_FLOAT_LENGTH;
}


// return result as json object

?>