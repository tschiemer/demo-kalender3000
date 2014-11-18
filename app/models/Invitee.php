<?php

class Invitee extends Eloquent {
    
    const PARTICIPATION_PENDING     = 'pending';
    const PARTICIPATION_CONFIRMED   = 'confirmed';
    const PARTICIPATION_DECLINED    = 'declined';
    const PARTICIPATION_MAYBE       = 'maybe';
    
    protected $table = 'invitees';
    
    public static function boot(){
        parent::boot();

        self::creating(function($invitee){
            $invitee->token = md5(time()) . '/' . $invitee->event_id;
        });
    }
        
    public function events(){
        return $this->belongsTo('VAEvent','event_id');
    }
    
}