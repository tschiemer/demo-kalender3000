<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::model('event','VAEvent');
Route::model('invitee','Invitee');
Route::model('todo','Todo');
Route::model('user','User');

Route::pattern('token','.+');

Route::get('/', array('before'=>'db.exists',function()
{
    return View::make('public');
}));

Route::group(array('prefix'=>'/setup'),function(){
    
    try {
        User::first();
        
        Route::get('/{asdf?}',function($any=NULL){
            return 'Datenbank bereits aufgesetzt. <a href="'.url().'">Gehe zu Webseite</a>';
        });
        
    } catch (Exception $e){
        
        Route::get('/',function(){
            return '<a href="setup/run">Datenbank aufsetzen</a>';
        });
        
        Route::get('/run',function(){
            
            $output = "<b>Erstelle Datenbank-Schema...</b>\n";
            
            $cmd = 'php ../artisan migrate';
            
            $descriptorspec = array(
                0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
                1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
                2 => array("pipe", "w") // stderr is a file to write to
             );

//            $cwd = '/tmp';
//            $env = array('some_option' => 'aeiou');

            $process = proc_open($cmd, $descriptorspec, $pipes);//, $cwd, $env);

            if (is_resource($process)) {
                // $pipes now looks like this:
                // 0 => writeable handle connected to child stdin
                // 1 => readable handle connected to child stdout
                // Any error output will be appended to /tmp/error-output.txt

                fclose($pipes[0]);

                $output .= stream_get_contents($pipes[1]);
                fclose($pipes[1]);
                
                $output .= stream_get_contents($pipes[2]);
                fclose($pipes[2]);

                // It is important that you close any pipes before calling
                // proc_close in order to avoid a deadlock
                $return_value = proc_close($process);
            } else {
                $return_value = false;
            }
            
            return nl2br($output);
        });
    }
});

Route::get('login',function(){
    if (Auth::check()){
        return Auth::user()->toJson(JSON_NUMERIC_CHECK);
    } else {
        return json_encode(FALSE);
    }
});

Route::post('login',function(){
    $credentials = Input::only('email','password');
//    return json_encode($credentials);
    if (Auth::attempt($credentials)){
        return Auth::user()->toJson(JSON_NUMERIC_CHECK);
    } else {
        return json_encode(FALSE);
    }
});

Route::get('logout',function(){
    Auth::logout();
});

Route::get('setting',array('before' => 'auth', function(){
    return Setting::where('internal',FALSE)->get()->toJson(JSON_NUMERIC_CHECK);
}));

Route::get('setting/{key}',function($key = NULL){
    $setting = Setting::where('key',$key)->first();
    if ($setting){
        return $setting->toJson();
    } else {
        return;
    }
});

//Route::get('dbExists',function(){
//    try {
//        User::first();
//        $response = Response::json(true);
//    } catch (Exception $ex) {
//        $response = Response::json(false);
//    }
//    return $response;
//});

Route::get('user/exists',function(){
    $response = Response::json(false);
    try {
        if (User::first()){
            $response = Response::json(true);
        }
    } catch (Exception $ex) {
    }
    return $response;
});

Route::get('user',array('before' => 'auth', function(){
    return User::with('todos')->get()->toJson(JSON_NUMERIC_CHECK);
}));

Route::post('user',array('before' => 'auth', function(){
    $newUser = new User();
    $newUser->username = Input::get('username');
    $newUser->email = Input::get('email');
    $newUser->password = Hash::make(Input::get('password'));
    $newUser->save();
    
    
    
    if (Input::get('sendEmail',FALSE)){
        $user = Auth::user();
        Mail::send('emails.user-added', array(
           'newUser' => $newUser,
            'password' => Input::get('password'),
            'user' => $user
        ), function($message)use($newUser,$user){
            if ($user){
                $message->from($user->email);
            }
            $message->to($newUser->email);
            $subject = "Neuer Account";
            $message->subject($subject);
        });
    }
    
    return User::find($newUser->id)->toJson();
}));

Route::get('user/{user}',array('before' => 'auth', function(User $user){
    return $user->toJson(JSON_NUJSON_NUMERIC_CHECK);
})); 

Route::delete('user/{user}',array('before' => 'auth', function(User $user){
   $user->delete(); 
}));



Route::get('event',function(){
    return VAEvent::all()->toJson(JSON_NUMERIC_CHECK);
});

Route::post('event',array('before' => 'auth', function(){
    $event = new VAEvent();
    $event->name = Input::get('name','Nameless');
    $event->location = Input::get('location','');
    $event->startDate = Input::get('startDate','');
    $event->description = Input::get('description','');
    $event->state = Input::get('state');
    $event->save();
    return $event->toJson(JSON_NUMERIC_CHECK);
}));

Route::get('event/{event}',function(VAEvent $event){
    return $event->toJson(JSON_NUMERIC_CHECK);
});

Route::put('event/{event}',array('before' => 'auth', function(VAEvent $event){
    $event->name = Input::get('name','Nameless');
    $event->location = Input::get('location','');
    $event->startDate = Input::get('startDate','');
    $event->description = Input::get('description','');
    $event->state = Input::get('state');
    $event->save();
    return $event->toJson(JSON_NUMERIC_CHECK);
}));

Route::delete('event/{event}',array('before' => 'auth', function(VAEvent $event){
    $event->delete();
}));


Route::get('invitee/{event}',function(VAEvent $event){
    return $event->invitees()->get()->toJson(JSON_NUMERIC_CHECK);
});

Route::post('invitee/{event}/{invitee}/{participation}',function(VAEvent $event, Invitee $invitee, $participation){
    $invitee->participation = $participation;
    $invitee->save();
})->where('participation','confirmed','declined','maybe');
//Route::post('invitee/{event}/{invitee}/decline',function(VAEvent $event, Invitee $invitee){
//    $invitee->participation = Invitee::PARTICIPATION_DECLINED;
//    $invitee->save();
//});
//Route::post('invitee/{event}/{invitee}/maybe',function(VAEvent $event, Invitee $invitee){
//    $invitee->participation = Invitee::PARTICIPATION_MAYBE;
//    $invitee->save();
//});

Route::post('invitee/{event}',array('before' => 'auth', function(VAEvent $event){
    $invitee = new Invitee();
    $invitee->event_id = $event->id;
    $invitee->name = Input::get('name','');
    $invitee->email = Input::get('email','');
    $invitee->save();
    
    
    if (Input::get('sendEmail',FALSE)){
        $user = Auth::user();
        Mail::send('emails.invitation', array(
            'inviter' => $user,
            'event' => $event,
            'invitee' => $invitee,
            'welcomeText' => Input::get('text','')
        ), function($message)use($user,$invitee,$event){
            $message->from($user->email);
            $message->to($invitee->email);
            $subject = "Einladung zu {$event->name}";
            if ($event->validStartDate()){
                $subject .= " am {$event->startDate}";
            }
            $message->subject($subject);
        });
    }
}));

Route::delete('invitee/{event}/{invitee}',array('before' => 'auth', function(VAEvent $event, Invitee $invitee){
    $invitee->delete();
}));



Route::get('todo',array('before' => 'auth', function(){
    return Todo::with('assignees','closedBy')->get()->toJson(JSON_NUMERIC_CHECK);
}));

Route::get('todo/{todo}',array('before' => 'auth', function(Todo $todo){
    return Todo::with('assignees','closedBy')->find($todo->id)->toJson(JSON_NUMERIC_CHECK);
}));

Route::post('todo',array('before' => 'auth', function(){
    $todo = new Todo();
    $todo->name = Input::get('name','Ohne Name');
    $todo->priority = Input::get('priority','normal');
    $todo->deadline = Input::get('deadline','0000-00-00 00:00:00');
    $todo->description = Input::get('description','');
    $todo->save();
    
    
    $assignees = Input::get('assignees',array());
    foreach($assignees as $a){
//        var_dump($a);
//        die('asdf');
        $assignee = User::find($a['id']);
        if ($assignee){
            $todo->assignees()->save($assignee);
        }
    }
    
    return Todo::with('assignees','closedBy')->find($todo->id)->toJson(JSON_NUMERIC_CHECK);
}));

Route::put('todo/{todo}', array('before' => 'auth', function(Todo $todo){
    
    $todo->name = Input::get('name','Ohne Name');
    $todo->priority = Input::get('priority','normal');
    $todo->deadline = Input::get('deadline','0000-00-00 00:00:00');
    $todo->description = Input::get('description','');
    $todo->save();
    
    
    $todo->assignees()->detach();
    
    
    $assignees = Input::get('assignees',array());
    foreach($assignees as $a){
//        var_dump($a);
//        die('asdf');
        $assignee = User::find($a['id']);
        if ($assignee){
            $todo->assignees()->save($assignee);
        }
    }
}));

Route::delete('todo/{todo}',array('before' => 'auth', function(Todo $todo){
    $todo->delete();
}));

Route::post('todo/{todo}/{state}',array('before' => 'auth',function(Todo $todo, $action){
    if ($action == 'close'){
        $todo->closeByUser(Auth::user());
    } else if ($action == 'reopen') {
        $todo->reopen();
    }
    $todo->save();
    return Todo::with('assignees','closedBy')->find($todo->id)->toJson(JSON_NUMERIC_CHECK);
}))->where('state','close|reopen');

//Route::post('todo/{todo}/priority/{priority}',function(Todo $todo,$priority){
//    $todo->priority = $priority;
//    $todo->save();
//})->where('priority','critical|high|normal|low');