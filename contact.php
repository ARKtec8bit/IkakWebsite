<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $dojo = $_POST['dojo'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $to = 'kyokushinkikanalliedkarate@gmail.com'; // Replace with your email address
    $subject = 'New Contact Enquiry: ' . $subject;
    $body = 'Name: ' . $name . "\nEmail: " . $email . "\nDojo: " . $dojo . "\nSubject: " . $subject . "\nMessage: " . $message;

    $headers = 'From: ' . $email . "\r\n" .
               'Reply-To: ' . $email . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['result' => 'success']);
    } else {
        echo json_encode(['result' => 'error', 'message' => 'Email sending failed']);
    }
} else {
    http_response_code(405);
    echo json_encode(['result' => 'error', 'message' => 'Method Not Allowed']);
}
?>


kyokushinkikanalliedkarate@gmail.com