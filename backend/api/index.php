<?php
echo "Backend server is running!";
echo "<br>Current directory: " . getcwd();
echo "<br>Files in current directory:";
echo "<pre>";
print_r(scandir('.'));
echo "</pre>";

echo "<br>API files:";
echo "<pre>";
print_r(scandir('./api'));
echo "</pre>";
?>
