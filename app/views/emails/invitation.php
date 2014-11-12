<!DOCTYPE html>
<head>
    
</head>
<body>
    <p>Hei {{ $invitee->name }}</p>

    <p>Du wurdest von {{ $inviter->name }} zum Event <a href="#">{{ $event->name }}</a> eingeladen:</p>
    
    <p>{{ $invitee->text }}</p>
</body>
</html>