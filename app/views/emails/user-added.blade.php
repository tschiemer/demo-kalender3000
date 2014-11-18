<!DOCTYPE html>
<head>
    
</head>
<body>
    <p>Hei {{ $newUser->username }}</p>

    <p>{{ $user->username }} hat auf <a href="{{ url() }}">{{ url() }}</a> einen Account für dich angelegt. Mittels folgenden Angaben kannst du dich einloggen:</p>
    
    <blockquote>
        Email: <i>{{ $newUser->email }}</i> <br/>
        Passwort: <i>{{ $password }}</i>
    </blockquote>
    
    <p>Viel Spass!</p>
    
</body>
</html>