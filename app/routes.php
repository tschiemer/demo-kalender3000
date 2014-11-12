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

Route::get('/', function()
{
	return View::make('public');
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

Route::get('user',function(){
    return User::with('todos')->get()->toJson(JSON_NUMERIC_CHECK);
});

Route::post('user',function(){
    $user = new User();
    $user->username = Input::get('username');
    $user->email = Input::get('email');
    $user->password = Hash::make(Input::get('password'));
    $user->save();
});

Route::get('user/{user}',function(User $user){
    return $user->toJson(JSON_NUJSON_NUMERIC_CHECK);
}); 

Route::delete('user/{user}',function(User $user){
   $user->delete(); 
});



Route::get('event',function(){
    return VAEvent::all()->toJson(JSON_NUMERIC_CHECK);
});

Route::post('event',function(){
    $event = new VAEvent();
    $event->name = Input::get('name','Nameless');
    $event->location = Input::get('location','');
    $event->startDate = Input::get('startDate','');
    $event->description = Input::get('description','');
    $event->state = Input::get('state');
    $event->save();
    return $event->toJson(JSON_NUMERIC_CHECK);
});

Route::get('event/{event}',function(VAEvent $event){
    return $event->toJson(JSON_NUMERIC_CHECK);
});

Route::put('event/{event}',function(VAEvent $event){
    $event->name = Input::get('name','Nameless');
    $event->location = Input::get('location','');
    $event->startDate = Input::get('startDate','');
    $event->description = Input::get('description','');
    $event->state = Input::get('state');
    $event->save();
    return $event->toJson(JSON_NUMERIC_CHECK);
});

Route::delete('event/{event}',function(VAEvent $event){
    $event->delete();
});


Route::get('invitee/{event}',function(VAEvent $event){
    return $event->invitees()->get()->toJson(JSON_NUMERIC_CHECK);
});

Route::post('invitee/{event}',function(VAEvent $event){
    $invitee = new Invitee();
    $invitee->event_id = $event->id;
    $invitee->name = Input::get('name','');
    $invitee->email = Input::get('email','');
    $invitee->save();
    
    $user = Auth::user();
    Mail::send('emails.invitation', array(
        'inviter' => $user,
        'event' => $event,
        'invitee' => $invitee,
        'welcomeText' => Input::get('text')
    ), function($message)use($user,$invitee,$event){
        $message->from($user->email);
        $message->to($invitee->email);
        $subject = "Einladung zu {$event->name}";
        if ($event->validStartDate()){
            $subject .= " am {$event->startDate}";
        }
        $message->subject($subject);
    });
    
});

Route::delete('invitee/{event}/{invitee}',function(VAEvent $event, Invitee $invitee){
    $invitee->delete();
});


Route::get('todo',function(){
    return Todo::with('assignees')->get()->toJson(JSON_NUMERIC_CHECK);
});

Route::get('todo/{todo}',function(Todo $todo){
    return $todo->toJson(JSON_NUMERIC_CHECK);
});

Route::post('todo',function(){
});

Route::delete('todo/{todo}',function(Todo $todo){
    $todo->delete();
});