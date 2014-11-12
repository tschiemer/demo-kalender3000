<?php

class VAEvent extends Eloquent {
    
    protected $table = 'events';
    
    public function invitees(){
        return $this->hasMany('Invitee','event_id');
    }
    
}