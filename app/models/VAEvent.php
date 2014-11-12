<?php

class VAEvent extends Eloquent {
    
    protected $table = 'events';
    
    public function invitees(){
        return $this->hasMany('Invitee','event_id');
    }
    
    public function validStartDate(){
        return $this->startDate != '0000-00-00 00:00:00';
    }
    
}