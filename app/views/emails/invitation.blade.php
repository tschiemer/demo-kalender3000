<!DOCTYPE html>
<head>
    
</head>
<body>
    <p>Hei {{ $invitee->name }}</p>

    <p>Du wurdest von {{ $inviter->username }} zum Event <a href="{{ url("#/events/{$event->id}") }}">{{ $event->name }}</a> eingeladen:</p>
    
    <blockquote>{{ $welcomeText }}</blockquote>
    
    <p><i>{{ $event->description }}</i></p>
    
</body>
</html>